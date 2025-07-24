# app/api/admin/popular_products.py
import os
import json
from typing import List, Optional
from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, File, Query, status
from app.auth.dependencies import get_current_admin
from app.auth.router import AdminUser
from app.config import settings
from app.database import DatabaseConnection, get_connection
from app.models.schemas import PopularProduct, PopularProductCreate, PopularProductUpdate
from app.utils.image_handler import save_image, delete_image, get_image_url, check_image_permissions
from app.utils.logging import log_info, log_error, log_warning

router = APIRouter()

@router.get("/", response_model=List[PopularProduct])
async def get_all_popular_products(
    current_user: AdminUser = Depends(get_current_admin),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    log_info(f"Admin {current_user.username} requesting popular products list")
    
    with DatabaseConnection() as cursor:
        # Get total count
        cursor.execute("SELECT COUNT(*) as count FROM popular_products")
        total = cursor.fetchone()['count']
        
        # Get paginated items
        cursor.execute(
            """
            SELECT * FROM popular_products
            ORDER BY created_at DESC
            LIMIT %s OFFSET %s
            """,
            (limit, skip)
        )
        items = cursor.fetchall()
        
        # Convert psycopg2.extras.RealDictRow objects to dictionaries and process features
        processed_items = []
        for item in items:
            item_dict = dict(item)
            
            if item_dict["features"]:
                # Handle JSONB features
                if isinstance(item_dict["features"], str):
                    item_dict["features"] = json.loads(item_dict["features"])
                elif not isinstance(item_dict["features"], list):
                    item_dict["features"] = []
            else:
                item_dict["features"] = []
                
            processed_items.append(item_dict)
        
        log_info(f"Retrieved {len(processed_items)} popular products for admin")
        return processed_items

@router.post("/", response_model=PopularProduct, status_code=status.HTTP_201_CREATED)
async def create_popular_product(
    name: str = Form(...),
    type: str = Form(...),
    description: str = Form(...),
    features: str = Form(...),  # JSON string
    rating: float = Form(...),
    image: Optional[UploadFile] = File(None),
    current_user: AdminUser = Depends(get_current_admin)
):
    log_info(f"Admin {current_user.username} creating new popular product: {name}")
    
    # Validate and parse features
    try:
        features_list = json.loads(features)
        if not isinstance(features_list, list):
            raise ValueError("Features must be a list")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid features format")
    
    # Save image if provided
    image_url = None
    if image:
        try:
            # This will return Cloudinary URL if Cloudinary is enabled, or local filename
            image_result = save_image(image, settings.POPULAR_PRODUCTS_DIR)
            if settings.USE_CLOUDINARY:
                image_url = image_result  # Cloudinary URL
            else:
                image_url = get_image_url(image_result, "popular_products")  # Local URL
            log_info(f"Saved popular product image: {image_url}")
        except Exception as e:
            log_error(f"Failed to save popular product image: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")
    
    # Create product in database
    with DatabaseConnection() as cursor:
        cursor.execute(
            """
            INSERT INTO popular_products 
            (name, type, description, features, rating, image_url)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING *
            """,
            (
                name,
                type,
                description,
                json.dumps(features_list),
                rating,
                image_url
            )
        )
        
        # Get the created product
        product = cursor.fetchone()
        
        # Convert psycopg2.extras.RealDictRow to dictionary
        product_dict = dict(product)
        
        # Convert features from JSON string to list
        if product_dict["features"]:
            if isinstance(product_dict["features"], str):
                product_dict["features"] = json.loads(product_dict["features"])
            elif not isinstance(product_dict["features"], list):
                product_dict["features"] = []
        else:
            product_dict["features"] = []
        
        # Clear cache
        from app.utils.cache import cache
        cache_keys = list(cache.cache.keys())
        for key in cache_keys:
            if "popular" in key:
                cache.delete(key)
        
        log_info(f"Successfully created popular product with ID: {product_dict['id']}")
        return product_dict

@router.put("/{product_id}", response_model=PopularProduct)
async def update_popular_product(
    product_id: int,
    name: Optional[str] = Form(None),
    type: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    features: Optional[str] = Form(None),
    rating: Optional[float] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: AdminUser = Depends(get_current_admin)
):
    log_info(f"Admin {current_user.username} updating popular product ID: {product_id}")
    
    # Check if product exists
    with DatabaseConnection() as cursor:
        cursor.execute("SELECT * FROM popular_products WHERE id = %s", (product_id,))
        existing_product = cursor.fetchone()
        
        if not existing_product:
            log_warning(f"Popular product not found for update: ID {product_id}")
            raise HTTPException(status_code=404, detail="Popular product not found")
        
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
        image_url = existing_product_dict["image_url"]
        if image:
            # Delete old image if exists
            if existing_product_dict["image_url"]:
                if settings.USE_CLOUDINARY and "cloudinary" in existing_product_dict["image_url"]:
                    from app.utils.cloudinary_handler import delete_from_cloudinary
                    delete_result = delete_from_cloudinary(existing_product_dict["image_url"])
                else:
                    delete_result = delete_image(existing_product_dict["image_url"], settings.POPULAR_PRODUCTS_DIR)
                log_info(f"Old image deletion result: {delete_result}")
            
            # Save new image
            try:
                image_result = save_image(image, settings.POPULAR_PRODUCTS_DIR)
                if settings.USE_CLOUDINARY:
                    image_url = image_result  # Cloudinary URL
                else:
                    image_url = get_image_url(image_result, "popular_products")  # Local URL
                log_info(f"Updated popular product image: {image_url}")
            except Exception as e:
                log_error(f"Failed to save updated image: {e}")
                raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")
        
        # Build update query dynamically based on provided fields
        update_fields = []
        params = []
        
        if name:
            update_fields.append("name = %s")
            params.append(name)
        if type:
            update_fields.append("type = %s")
            params.append(type)
        if description is not None:  # Allow empty description
            update_fields.append("description = %s")
            params.append(description)
        if features_json:
            update_fields.append("features = %s")
            params.append(features_json)
        if rating is not None:
            update_fields.append("rating = %s")
            params.append(rating)
        if image:
            update_fields.append("image_url = %s")
            params.append(image_url)
        
        if not update_fields:
            # No fields to update
            return existing_product_dict
        
        # Add product_id to params for WHERE clause
        params.append(product_id)
        
        # Execute update query
        cursor.execute(
            f"""
            UPDATE popular_products 
            SET {', '.join(update_fields)}
            WHERE id = %s
            RETURNING *
            """,
            tuple(params)
        )
        
        # Get updated product
        updated_product = cursor.fetchone()
        
        # Convert psycopg2.extras.RealDictRow to dictionary
        updated_product_dict = dict(updated_product)
        
        # Convert features from JSON string to list
        if updated_product_dict["features"]:
            if isinstance(updated_product_dict["features"], str):
                updated_product_dict["features"] = json.loads(updated_product_dict["features"])
            elif not isinstance(updated_product_dict["features"], list):
                updated_product_dict["features"] = []
        else:
            updated_product_dict["features"] = []
        
        # Clear cache
        from app.utils.cache import cache
        cache_keys = list(cache.cache.keys())
        for key in cache_keys:
            if "popular" in key:
                cache.delete(key)
        
        log_info(f"Successfully updated popular product ID: {product_id}")
        return updated_product_dict

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_popular_product(
    product_id: int,
    current_user: AdminUser = Depends(get_current_admin)
):
    log_info(f"Admin {current_user.username} attempting to delete popular product ID: {product_id}")

    with DatabaseConnection() as cursor:
        # Fetch product to check existence and get image URL
        cursor.execute("SELECT * FROM popular_products WHERE id = %s", (product_id,))
        product = cursor.fetchone()
        if not product:
            log_warning(f"Popular product not found for deletion: ID {product_id}")
            raise HTTPException(status_code=404, detail="Popular product not found")

        product_dict = dict(product)
        image_url = product_dict.get("image_url")
        product_name = product_dict.get("name", "Unknown")

        # Try deleting image if it exists
        if image_url:
            try:
                log_info(f"Deleting image for popular product ID {product_id}: {image_url}")

                if settings.USE_CLOUDINARY:
                    log_info("Cloudinary image deletion enabled")
                else:
                    permissions = check_image_permissions(settings.POPULAR_PRODUCTS_DIR)
                    log_info(f"Local image storage permissions: {permissions}")

                deleted = delete_image(image_url, settings.POPULAR_PRODUCTS_DIR)
                log_info(f"Image deletion success: {deleted}")
            except Exception as e:
                log_error(f"Image deletion failed but continuing with DB deletion: {e}")

        # Delete product from DB inside a transaction
        try:
            cursor.execute("BEGIN")
            cursor.execute("DELETE FROM popular_products WHERE id = %s", (product_id,))

            # Double-check deletion
            cursor.execute("SELECT 1 FROM popular_products WHERE id = %s", (product_id,))
            if cursor.fetchone():
                cursor.execute("ROLLBACK")
                log_error(f"Product ID {product_id} still exists after delete attempt")
                raise HTTPException(status_code=500, detail="Failed to delete popular product")

            cursor.execute("COMMIT")
            log_info(f"Deleted popular product ID {product_id} successfully")
        except Exception as e:
            cursor.execute("ROLLBACK")
            log_error(f"Database deletion failed for product ID {product_id}: {e}")
            raise HTTPException(status_code=500, detail=f"Database deletion failed: {e}")

    # Return no content as per 204
    return None