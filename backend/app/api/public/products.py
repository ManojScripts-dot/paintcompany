# app/api/public/products.py
import json
import math
from typing import List, Optional, Dict
from fastapi import APIRouter, HTTPException, Query
from app.database import DatabaseConnection, execute_query
from app.models.schemas import Product, PaginatedResponse
from app.utils.cache import cached

router = APIRouter()

@router.get("/", response_model=PaginatedResponse)
@cached(ttl=300)  # Cache for 5 minutes
def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None
):
    """Get paginated list of products with optional filtering"""
    # Prepare query components
    query_conditions = []
    query_params = []
    
    # Add filter conditions
    if category:
        query_conditions.append("category = %s")
        query_params.append(category)
    
    if search:
        query_conditions.append("(name ILIKE %s OR description ILIKE %s OR category ILIKE %s)")
        search_term = f"%{search}%"
        query_params.extend([search_term, search_term, search_term])
    
    # Construct WHERE clause if needed
    where_clause = ""
    if query_conditions:
        where_clause = "WHERE " + " AND ".join(query_conditions)
    
    # Use optimized count query
    count_query = f"SELECT COUNT(*) as count FROM products {where_clause}"
    count_result = execute_query(count_query, tuple(query_params), fetch_one=True)
    # Handle the case where count_result might be None or a dict
    if count_result:
        total = count_result['count']
    else:
        total = 0
    
    # Optimize the main query by selecting only needed fields
    data_query = f"""
        SELECT 
            id, name, category, description, features, stock, 
            image_url, 
            price1L, price4L, price10L, price20L, 
            price500ml, price200ml, price1kg, 
            price500g, price200g, price100g, price50g
        FROM products 
        {where_clause}
        ORDER BY category, name
        LIMIT %s OFFSET %s
    """
    params = list(query_params)
    params.extend([limit, skip])
    items = execute_query(data_query, tuple(params))
    
    # Process products to handle JSON fields
    processed_items = []
    for item in items:
        # Convert psycopg2.extras.RealDictRow to dictionary
        item_dict = dict(item)
        
        if item_dict["features"]:
            # Handle JSONB features
            if isinstance(item_dict["features"], str):
                try:
                    item_dict["features"] = json.loads(item_dict["features"])
                except json.JSONDecodeError:
                    item_dict["features"] = []
            elif not isinstance(item_dict["features"], list):
                item_dict["features"] = []
        else:
            item_dict["features"] = []
        
        # Convert price fields to dictionary structure
        prices = {}
        price_fields = [
            "price1L", "price4L", "price10L", "price20L", 
            "price500ml", "price200ml", "price1kg", 
            "price500g", "price200g", "price100g", "price50g"
        ]
        for field in price_fields:
            if item_dict.get(field):
                # Strip "price" prefix and extract size
                key = field.replace("price", "")
                prices[key] = item_dict[field]
        
        item_dict["prices"] = prices
        processed_items.append(item_dict)
    
    # Calculate pagination info
    total_pages = math.ceil(total / limit) if total > 0 else 0
    current_page = skip // limit + 1 if total > 0 else 0
    
    return {
        "items": processed_items,
        "total": total,
        "page": current_page,
        "size": limit,
        "pages": total_pages
    }

@router.get("/categories")
@cached(ttl=3600)  # Cache for 1 hour
def get_product_categories():
    """Get list of all product categories"""
    # Optimized query with indexing in mind
    query = """
        SELECT DISTINCT category 
        FROM products 
        ORDER BY category
    """
    results = execute_query(query)
    categories = [row["category"] for row in results]
    return categories

@router.get("/by-category")
@cached(ttl=900)  # Cache for 15 minutes
def get_products_by_category():
    """Get products grouped by category for catalog display"""
    # First get all categories
    categories = get_product_categories()
    
    result = []
    
    # For each category, get the products with one optimized query
    for idx, category in enumerate(categories):
        query = """
            SELECT 
                id, name, description, category, features, 
                image_url, stock,
                price1L, price4L, price10L, price20L, 
                price500ml, price200ml, price1kg, 
                price500g, price200g, price100g, price50g
            FROM products 
            WHERE category = %s
            ORDER BY name
        """
        products = execute_query(query, (category,))
        
        # Process each product
        processed_products = []
        for product in products:
            # Convert psycopg2.extras.RealDictRow to dictionary
            product_dict = dict(product)
            
            # Process features
            if product_dict["features"]:
                # Handle JSONB features
                if isinstance(product_dict["features"], str):
                    try:
                        product_dict["features"] = json.loads(product_dict["features"])
                    except json.JSONDecodeError:
                        product_dict["features"] = []
                elif not isinstance(product_dict["features"], list):
                    product_dict["features"] = []
            else:
                product_dict["features"] = []
            
            # Convert price fields to dictionary structure
            prices = {}
            price_fields = [
                "price1L", "price4L", "price10L", "price20L", 
                "price500ml", "price200ml", "price1kg", 
                "price500g", "price200g", "price100g", "price50g"
            ]
            for field in price_fields:
                if product_dict.get(field):
                    # Strip "price" prefix and extract size
                    key = field.replace("price", "")
                    prices[key] = product_dict[field]
            
            # Determine which columns to display based on category
            columns = []
            if category in ["Silver/Copper/Gold"]:
                columns = ["1kg", "500g", "200g", "100g", "50g"]
            elif category in ["Metal and Wood Primer", "Metal and Wood Enamel", "Aluminium Paints"]:
                columns = ["20L", "4L", "1L", "500ml", "200ml"]
            else:
                columns = ["20L", "10L", "4L", "1L"]
            
            # Only include columns that have prices
            available_columns = [col for col in columns if col in prices]
            
            # Add processed product
            processed_product = {
                "id": product_dict["id"],
                "name": product_dict["name"],
                "description": product_dict["description"],
                "prices": prices,
                "features": product_dict["features"],
                "image": product_dict.get("image_url", ""),
                "stock": product_dict.get("stock", "In Stock")
            }
            
            processed_products.append(processed_product)
        
        # Add category with its products to result
        result.append({
            "id": f"category_{idx + 1}",
            "name": category,
            "products": processed_products,
            "columns": available_columns if available_columns else []
        })
    
    return result