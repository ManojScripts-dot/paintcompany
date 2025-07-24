# app/api/public/popular_products.py
import json
import math
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.database import DatabaseConnection
from app.models.schemas import PaginatedResponse

router = APIRouter()

@router.get("/", response_model=PaginatedResponse)
async def get_popular_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    type: Optional[str] = None,
    search: Optional[str] = None
):
    with DatabaseConnection() as cursor:
        # Prepare query components
        query_conditions = []
        query_params = []
        
        # Add filter conditions
        if type:
            query_conditions.append("type = %s")
            query_params.append(type)
        
        if search:
            query_conditions.append("(name ILIKE %s OR description ILIKE %s)")
            search_term = f"%{search}%"
            query_params.extend([search_term, search_term])
        
        # Construct WHERE clause if needed
        where_clause = ""
        if query_conditions:
            where_clause = "WHERE " + " AND ".join(query_conditions)
        
        # Count total matching records
        count_query = f"SELECT COUNT(*) as count FROM popular_products {where_clause}"
        cursor.execute(count_query, tuple(query_params))
        total = cursor.fetchone()['count']
        
        # Get paginated data
        data_query = f"""
            SELECT * FROM popular_products 
            {where_clause}
            ORDER BY rating DESC, created_at DESC
            LIMIT %s OFFSET %s
        """
        query_params.extend([limit, skip])
        cursor.execute(data_query, tuple(query_params))
        items = cursor.fetchall()
        
        # Convert features from JSONB to list and convert to dict
        processed_items = []
        for item in items:
            # Convert psycopg2.extras.RealDictRow to dictionary
            item_dict = dict(item)
            
            # Handle JSONB features
            if item_dict.get("features"):
                if isinstance(item_dict["features"], str):
                    try:
                        item_dict["features"] = json.loads(item_dict["features"])
                    except json.JSONDecodeError:
                        item_dict["features"] = []
                # If it's already a list (JSONB), keep it as is
                elif not isinstance(item_dict["features"], list):
                    item_dict["features"] = []
            else:
                item_dict["features"] = []
                
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