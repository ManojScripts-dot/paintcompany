# app/api/admin/products.py
import os
import json
from typing import List, Optional
from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, File, Query, status
from app.auth.dependencies import get_current_admin
from app.auth.router import AdminUser
from app.config import settings
from app.database import DatabaseConnection
from app.models.schemas import Product, ProductCreate, ProductUpdate
from app.utils.image_handler import save_image, delete_image, get_image_url, check_image_permissions
from app.utils.logging import log_info, log_error, log_warning

router = APIRouter()

@router.get("/", response_model=List[Product])
async def get_all_products(
    current_user: AdminUser = Depends(get_current_admin),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None
):
    """Get all products with optional filtering and pagination"""
    log_info(f"Admin {current_user.username} requesting products list")
    
    with DatabaseConnection() as cursor:
        # Build query based on filters
        query = "SELECT * FROM products"
        params = []
        
        # Add filter conditions
        filters = []
        if category:
            filters.append("category = %s")
            params.append(category)
        if search:
            filters.append("(name ILIKE %s OR description ILIKE %s)")
            search_term = f"%{search}%"
            params.extend([search_term, search_term])
        
        if filters:
            query += " WHERE " + " AND ".join(filters)
        
        # Add ordering and pagination
        query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
        params.extend([limit, skip])
        
        cursor.execute(query, tuple(params))
        products = cursor.fetchall()
        
        # Convert psycopg2.extras.RealDictRow objects to dictionaries and process products
        processed_products = []
        for product in products:
            product_dict = dict(product)
            
            if product_dict["features"]:
                # Handle JSONB features
                if isinstance(product_dict["features"], str):
                    product_dict["features"] = json.loads(product_dict["features"])
                elif not isinstance(product_dict["features"], list):
                    product_dict["features"] = []
            else:
                product_dict["features"] = []
            
            # Convert price fields to dictionary structure
            prices = {}
            price_fields = [
                "price1l", "price4l", "price5l", "price10l", "price20l", 
                "price500ml", "price200ml", "price1kg", 
                "price500g", "price200g", "price100g", "price50g"
            ]
            for field in price_fields:
                if product_dict.get(field):
                    # Strip "price" prefix and extract size
                    key = field.replace("price", "")
                    prices[key] = product_dict[field]
            
            product_dict["prices"] = prices
            processed_products.append(product_dict)
            
        log_info(f"Retrieved {len(processed_products)} products for admin")
        return processed_products

@router.post("/", response_model=Product, status_code=status.HTTP_201_CREATED)
async def create_product(
    name: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    features: str = Form("[]"),  # JSON string of features
    price1l: Optional[str] = Form(None),
    price4l: Optional[str] = Form(None),
    price5l: Optional[str] = Form(None),
    price10l: Optional[str] = Form(None),
    price20l: Optional[str] = Form(None),
    price500ml: Optional[str] = Form(None),
    price200ml: Optional[str] = Form(None),
    price1kg: Optional[str] = Form(None),
    price500g: Optional[str] = Form(None),
    price200g: Optional[str] = Form(None),
    price100g: Optional[str] = Form(None),
    price50g: Optional[str] = Form(None),
    stock: str = Form("In Stock"),
    image: Optional[UploadFile] = File(None),
    current_user: AdminUser = Depends(get_current_admin)
):
    """Create a new product"""
    log_info(f"Admin {current_user.username} creating new product: {name}")
    
    # Validate and parse features
    try:
        features_list = json.loads(features)
        if not isinstance(features_list, list):
            raise ValueError("Features must be a list")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid features format")
    
    # Save image if provided
    image_filename = None
    if image:
        try:
            image_filename = save_image(image, settings.PRODUCTS_DIR)
            log_info(f"Saved product image: {image_filename}")
        except Exception as e:
            log_error(f"Failed to save product image: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")
    
    # Create product in database
    with DatabaseConnection() as cursor:
        # Build field and value lists dynamically
        fields = ["name", "category", "description", "features", "stock", "image_url"]
        values = [
            name, 
            category, 
            description, 
            json.dumps(features_list), 
            stock,
            get_image_url(image_filename, "products") if image_filename else None
        ]
        
        # Add price fields if provided
        price_fields = {
            "price1l": price1l,
            "price4l": price4l,
            "price5l": price5l,
            "price10l": price10l,
            "price20l": price20l,
            "price500ml": price500ml,
            "price200ml": price200ml,
            "price1kg": price1kg, 
            "price500g": price500g,
            "price200g": price200g,
            "price100g": price100g,
            "price50g": price50g
        }
        
        for field, value in price_fields.items():
            if value:
                fields.append(field)
                values.append(value)
        
        # Construct SQL query
        placeholders = ", ".join(["%s"] * len(values))
        field_names = ", ".join(fields)
        
        query = f"""
            INSERT INTO products 
            ({field_names})
            VALUES ({placeholders})
            RETURNING *
        """
        
        cursor.execute(query, tuple(values))
        
        # Get the created product
        product = cursor.fetchone()
        
        # Convert psycopg2.extras.RealDictRow to dictionary
        product_dict = dict(product)
        
        # Process product JSON fields
        if product_dict["features"]:
            if isinstance(product_dict["features"], str):
                product_dict["features"] = json.loads(product_dict["features"])
            elif not isinstance(product_dict["features"], list):
                product_dict["features"] = []
        else:
            product_dict["features"] = []
        
        # Convert price fields to dictionary structure
        prices = {}
        for field in price_fields.keys():
            if product_dict.get(field):
                # Strip "price" prefix and extract size
                key = field.replace("price", "")
                prices[key] = product_dict[field]
        
        product_dict["prices"] = prices
        
        log_info(f"Successfully created product with ID: {product_dict['id']}")
        return product_dict

@router.put("/{product_id}", response_model=Product)
async def update_product(
    product_id: int,
    name: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    features: Optional[str] = Form(None),
    price1l: Optional[str] = Form(None),
    price4l: Optional[str] = Form(None),
    price5l: Optional[str] = Form(None),
    price10l: Optional[str] = Form(None),
    price20l: Optional[str] = Form(None),
    price500ml: Optional[str] = Form(None),
    price200ml: Optional[str] = Form(None),
    price1kg: Optional[str] = Form(None),
    price500g: Optional[str] = Form(None),
    price200g: Optional[str] = Form(None),
    price100g: Optional[str] = Form(None),
    price50g: Optional[str] = Form(None),
    stock: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: AdminUser = Depends(get_current_admin)
):
    """Update an existing product"""
    log_info(f"Admin {current_user.username} updating product ID: {product_id}")
    
    # Check if product exists
    with DatabaseConnection() as cursor:
        cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))
        existing_product = cursor.fetchone()
        
        if not existing_product:
            log_warning(f"Product not found for update: ID {product_id}")
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Process features if provided
        features_json = None
        if features:
            try:
                features_list = json.loads(features)
                if not isinstance(features_list, list):
                    raise ValueError("Features must be a list")
                features_json = json.dumps(features_list)
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid features format")
        
        # Convert existing_product to dict for easier access
        existing_product_dict = dict(existing_product)
        
        # Handle image update
        image_url = existing_product_dict.get("image_url")
        if image:
            # Delete old image if exists
            if existing_product_dict.get("image_url"):
                old_filename = os.path.basename(existing_product_dict["image_url"])
                delete_result = delete_image(old_filename, settings.PRODUCTS_DIR)
                log_info(f"Old image deletion result: {delete_result}")
            
            # Save new image
            try:
                new_filename = save_image(image, settings.PRODUCTS_DIR)
                image_url = get_image_url(new_filename, "products")
                log_info(f"Updated product image: {new_filename}")
            except Exception as e:
                log_error(f"Failed to save updated image: {e}")
                raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")
        
        # Build update query dynamically based on provided fields
        update_fields = []
        params = []
        
        # Check and add fields
        if name:
            update_fields.append("name = %s")
            params.append(name)
        if category:
            update_fields.append("category = %s")
            params.append(category)
        if description:
            update_fields.append("description = %s")
            params.append(description)
        if features_json:
            update_fields.append("features = %s")
            params.append(features_json)
        if stock:
            update_fields.append("stock = %s")
            params.append(stock)
        
        # Process price fields
        price_fields = {
            "price1l": price1l,
            "price4l": price4l,
            "price5l": price5l,
            "price10l": price10l,
            "price20l": price20l,
            "price500ml": price500ml,
            "price200ml": price200ml,
            "price1kg": price1kg,
            "price500g": price500g,
            "price200g": price200g,
            "price100g": price100g,
            "price50g": price50g
        }
        
        for field, value in price_fields.items():
            if value is not None:  # Include empty strings to clear values
                update_fields.append(f"{field} = %s")
                params.append(value)
        
        # Add image URL if updated
        if image:
            update_fields.append("image_url = %s")
            params.append(image_url)
        
        if not update_fields:
            # No fields to update
            raise HTTPException(status_code=400, detail="No fields to update")
        
        # Add product_id to params for WHERE clause
        params.append(product_id)
        
        # Execute update query
        query = f"""
            UPDATE products 
            SET {', '.join(update_fields)}
            WHERE id = %s
            RETURNING *
        """
        
        cursor.execute(query, tuple(params))
        
        # Get updated product
        updated_product = cursor.fetchone()
        
        # Convert psycopg2.extras.RealDictRow to dictionary
        updated_product_dict = dict(updated_product)
        
        # Process product JSON fields
        if updated_product_dict["features"]:
            if isinstance(updated_product_dict["features"], str):
                updated_product_dict["features"] = json.loads(updated_product_dict["features"])
            elif not isinstance(updated_product_dict["features"], list):
                updated_product_dict["features"] = []
        else:
            updated_product_dict["features"] = []
        
        # Convert price fields to dictionary structure
        prices = {}
        for field in price_fields.keys():
            if updated_product_dict.get(field):
                # Strip "price" prefix and extract size
                key = field.replace("price", "")
                prices[key] = updated_product_dict[field]
        
        updated_product_dict["prices"] = prices
        
        log_info(f"Successfully updated product ID: {product_id}")
        return updated_product_dict

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Delete a product with enhanced error handling and logging"""
    log_info(f"Admin {current_user.username} attempting to delete product ID: {product_id}")
    
    try:
        with DatabaseConnection() as cursor:
            # First, get the product to check if it exists and get its details
            cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))
            product = cursor.fetchone()
            
            if not product:
                log_warning(f"Product not found for deletion: ID {product_id}")
                raise HTTPException(status_code=404, detail="Product not found")
            
            # Convert product to dict for easier access
            product_dict = dict(product)
            product_name = product_dict.get('name', 'Unknown')
            log_info(f"Found product for deletion: {product_name} (ID: {product_id})")
            
            # Try to delete the image file (but don't fail the entire operation if it doesn't work)
            image_deleted = False
            image_delete_error = None
            
            if product_dict.get("image_url"):
                try:
                    filename = os.path.basename(product_dict["image_url"])
                    log_info(f"Attempting to delete image file: {filename}")
                    
                    # Check directory permissions first
                    permissions = check_image_permissions(settings.PRODUCTS_DIR)
                    log_info(f"Image directory permissions: {permissions}")
                    
                    image_deleted = delete_image(filename, settings.PRODUCTS_DIR)
                    log_info(f"Image deletion result: {image_deleted}")
                    
                except Exception as img_error:
                    image_delete_error = str(img_error)
                    log_error(f"Image deletion failed but continuing with database deletion: {img_error}")
                    # Don't raise - continue with database deletion
            else:
                log_info("No image associated with product")
            
            # Delete from database
            log_info(f"Executing database deletion for product ID: {product_id}")
            
            # Use a transaction to ensure atomicity
            cursor.execute("BEGIN")
            
            try:
                # Execute the delete
                cursor.execute("DELETE FROM products WHERE id = %s", (product_id,))
                
                # Verify deletion by checking if the product still exists
                cursor.execute("SELECT id FROM products WHERE id = %s", (product_id,))
                still_exists = cursor.fetchone()
                
                if still_exists:
                    cursor.execute("ROLLBACK")
                    log_error(f"Product still exists after deletion attempt: ID {product_id}")
                    raise HTTPException(
                        status_code=500, 
                        detail="Failed to delete product from database"
                    )
                
                # Commit the transaction
                cursor.execute("COMMIT")
                log_info(f"Successfully deleted product from database: ID {product_id}")
                
                # Log the final result
                result_msg = f"Product '{product_name}' (ID: {product_id}) deleted successfully"
                if image_delete_error:
                    result_msg += f" (Note: Image deletion failed: {image_delete_error})"
                elif product_dict.get("image_url") and image_deleted:
                    result_msg += " (Including associated image)"
                
                log_info(result_msg)
                return None
                
            except Exception as db_error:
                cursor.execute("ROLLBACK")
                log_error(f"Database deletion failed for product ID {product_id}: {db_error}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Database deletion failed: {str(db_error)}"
                )
                
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        log_error(f"Unexpected error during product deletion: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, 
            detail=f"Unexpected error during deletion: {str(e)}"
        )

# Add a debug endpoint for checking product deletion
@router.get("/debug/{product_id}", tags=["Debug"])
async def debug_product(
    product_id: int,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Debug endpoint to check product and file system status"""
    debug_info = {
        "product_id": product_id,
        "database_status": {},
        "filesystem_status": {},
        "permissions": {}
    }
    
    # Check database
    try:
        with DatabaseConnection() as cursor:
            cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))
            product = cursor.fetchone()
            
            if product:
                product_dict = dict(product)
                debug_info["database_status"] = {
                    "exists": True,
                    "name": product_dict.get("name"),
                    "image_url": product_dict.get("image_url")
                }
                
                # Check if image file exists
                if product_dict.get("image_url"):
                    filename = os.path.basename(product_dict["image_url"])
                    file_path = os.path.join(settings.PRODUCTS_DIR, filename)
                    debug_info["filesystem_status"] = {
                        "image_filename": filename,
                        "full_path": file_path,
                        "file_exists": os.path.exists(file_path)
                    }
            else:
                debug_info["database_status"] = {"exists": False}
                
    except Exception as e:
        debug_info["database_status"] = {"error": str(e)}
    
    # Check directory permissions
    debug_info["permissions"] = check_image_permissions(settings.PRODUCTS_DIR)
    
    return debug_info