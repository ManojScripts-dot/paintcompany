# app/api/admin/new_arrivals.py
import os
from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, File, Query, status
from app.auth.dependencies import get_current_admin
from app.auth.router import AdminUser
from app.config import settings
from app.database import DatabaseConnection
from app.models.schemas import NewArrival, NewArrivalCreate, NewArrivalUpdate
from app.utils.image_handler import save_image, delete_image, get_image_url, check_image_permissions
from app.utils.logging import log_info, log_error, log_warning

router = APIRouter()

@router.get("/", response_model=List[NewArrival])
async def get_all_new_arrivals(
    current_user: AdminUser = Depends(get_current_admin),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    log_info(f"Admin {current_user.username} requesting new arrivals list")
    
    with DatabaseConnection() as cursor:
        # Get total count
        cursor.execute("SELECT COUNT(*) as count FROM new_arrivals")
        total = cursor.fetchone()['count']
        
        # Get paginated items
        cursor.execute(
            """
            SELECT * FROM new_arrivals
            ORDER BY release_date DESC
            LIMIT %s OFFSET %s
            """,
            (limit, skip)
        )
        items = cursor.fetchall()
        
        log_info(f"Retrieved {len(items)} new arrivals for admin")
        return [dict(item) for item in items]

@router.post("/", response_model=NewArrival, status_code=status.HTTP_201_CREATED)
async def create_new_arrival(
    name: str = Form(...),
    description: str = Form(...),
    release_date: date = Form(...),
    image: Optional[UploadFile] = File(None),
    current_user: AdminUser = Depends(get_current_admin)
):
    log_info(f"Admin {current_user.username} creating new arrival: {name}")
    
    # Save image if provided
    image_url = None
    if image:
        try:
            # This will return Cloudinary URL if Cloudinary is enabled, or local filename
            image_result = save_image(image, settings.NEW_ARRIVALS_DIR)
            if settings.USE_CLOUDINARY:
                image_url = image_result  # Cloudinary URL
            else:
                image_url = get_image_url(image_result, "new_arrivals")  # Local URL
            log_info(f"Saved new arrival image: {image_url}")
        except Exception as e:
            log_error(f"Failed to save new arrival image: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")
    
    # Create new arrival in database
    with DatabaseConnection() as cursor:
        cursor.execute(
            """
            INSERT INTO new_arrivals 
            (name, description, release_date, image_url)
            VALUES (%s, %s, %s, %s)
            RETURNING *
            """,
            (
                name,
                description,
                release_date,
                image_url
            )
        )
        
        # Get the created arrival
        arrival = cursor.fetchone()
        
        log_info(f"Successfully created new arrival with ID: {arrival['id']}")
        return dict(arrival)

@router.put("/{arrival_id}", response_model=NewArrival)
async def update_new_arrival(
    arrival_id: int,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    release_date: Optional[date] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: AdminUser = Depends(get_current_admin)
):
    log_info(f"Admin {current_user.username} updating new arrival ID: {arrival_id}")
    
    # Check if arrival exists
    with DatabaseConnection() as cursor:
        cursor.execute("SELECT * FROM new_arrivals WHERE id = %s", (arrival_id,))
        existing_arrival = cursor.fetchone()
        
        if not existing_arrival:
            log_warning(f"New arrival not found for update: ID {arrival_id}")
            raise HTTPException(status_code=404, detail="New arrival not found")
        
        # Convert to dict for easier access
        existing_arrival_dict = dict(existing_arrival)
        
        # Handle image update
        image_url = existing_arrival_dict["image_url"]
        if image:
            # Delete old image if exists
            if existing_arrival_dict["image_url"]:
                delete_result = delete_image(existing_arrival_dict["image_url"], settings.NEW_ARRIVALS_DIR)
                log_info(f"Old image deletion result: {delete_result}")
            
            # Save new image
            try:
                image_result = save_image(image, settings.NEW_ARRIVALS_DIR)
                if settings.USE_CLOUDINARY:
                    image_url = image_result  # Cloudinary URL
                else:
                    image_url = get_image_url(image_result, "new_arrivals")  # Local URL
                log_info(f"Updated new arrival image: {image_url}")
            except Exception as e:
                log_error(f"Failed to save updated image: {e}")
                raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")
        
        # Build update query dynamically based on provided fields
        update_fields = []
        params = []
        
        if name:
            update_fields.append("name = %s")
            params.append(name)
        if description:
            update_fields.append("description = %s")
            params.append(description)
        if release_date:
            update_fields.append("release_date = %s")
            params.append(release_date)
        if image:
            update_fields.append("image_url = %s")
            params.append(image_url)
        
        if not update_fields:
            # No fields to update
            return existing_arrival_dict
        
        # Add arrival_id to params for WHERE clause
        params.append(arrival_id)
        
        # Execute update query
        cursor.execute(
            f"""
            UPDATE new_arrivals 
            SET {', '.join(update_fields)}
            WHERE id = %s
            RETURNING *
            """,
            tuple(params)
        )
        
        # Get updated arrival
        updated_arrival = cursor.fetchone()
        
        log_info(f"Successfully updated new arrival ID: {arrival_id}")
        return dict(updated_arrival)

@router.delete("/{arrival_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_new_arrival(
    arrival_id: int,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Delete a new arrival with enhanced error handling and Cloudinary support"""
    log_info(f"Admin {current_user.username} attempting to delete new arrival ID: {arrival_id}")
    
    try:
        with DatabaseConnection() as cursor:
            # First, get the arrival to check if it exists and get its details
            cursor.execute("SELECT * FROM new_arrivals WHERE id = %s", (arrival_id,))
            arrival = cursor.fetchone()
            
            if not arrival:
                log_warning(f"New arrival not found for deletion: ID {arrival_id}")
                raise HTTPException(status_code=404, detail="New arrival not found")
            
            # Convert to dict for easier access
            arrival_dict = dict(arrival)
            arrival_name = arrival_dict.get('name', 'Unknown')
            image_url = arrival_dict.get('image_url')
            
            log_info(f"Found new arrival for deletion: {arrival_name} (ID: {arrival_id})")
            log_info(f"Arrival image URL: {image_url}")
            
            # Try to delete the image (both Cloudinary and local supported)
            image_deleted = False
            image_delete_error = None
            
            if image_url:
                try:
                    log_info(f"Attempting to delete image: {image_url}")
                    
                    # Check if using Cloudinary
                    if settings.USE_CLOUDINARY:
                        log_info("Using Cloudinary for image deletion")
                    else:
                        # Check directory permissions for local storage
                        permissions = check_image_permissions(settings.NEW_ARRIVALS_DIR)
                        log_info(f"Local storage permissions: {permissions}")
                    
                    image_deleted = delete_image(image_url, settings.NEW_ARRIVALS_DIR)
                    log_info(f"Image deletion result: {image_deleted}")
                    
                except Exception as img_error:
                    image_delete_error = str(img_error)
                    log_error(f"Image deletion failed but continuing with database deletion: {img_error}")
                    # Don't raise - continue with database deletion
            else:
                log_info("No image associated with new arrival")
            
            # Delete from database using transaction
            log_info(f"Executing database deletion for new arrival ID: {arrival_id}")
            
            # Use a transaction to ensure atomicity
            cursor.execute("BEGIN")
            
            try:
                # Execute the delete
                cursor.execute("DELETE FROM new_arrivals WHERE id = %s", (arrival_id,))
                
                # Verify deletion by checking if the arrival still exists
                cursor.execute("SELECT id FROM new_arrivals WHERE id = %s", (arrival_id,))
                still_exists = cursor.fetchone()
                
                if still_exists:
                    cursor.execute("ROLLBACK")
                    log_error(f"New arrival still exists after deletion attempt: ID {arrival_id}")
                    raise HTTPException(
                        status_code=500, 
                        detail="Failed to delete new arrival from database"
                    )
                
                # Commit the transaction
                cursor.execute("COMMIT")
                log_info(f"Successfully deleted new arrival from database: ID {arrival_id}")
                
                # Log the final result
                result_msg = f"New arrival '{arrival_name}' (ID: {arrival_id}) deleted successfully"
                if image_delete_error:
                    result_msg += f" (Note: Image deletion failed: {image_delete_error})"
                elif image_url and image_deleted:
                    result_msg += " (Including associated image)"
                elif image_url and not image_deleted:
                    result_msg += " (Image deletion failed but database deletion succeeded)"
                
                log_info(result_msg)
                return None
                
            except Exception as db_error:
                cursor.execute("ROLLBACK")
                log_error(f"Database deletion failed for new arrival ID {arrival_id}: {db_error}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Database deletion failed: {str(db_error)}"
                )
                
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        log_error(f"Unexpected error during new arrival deletion: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, 
            detail=f"Unexpected error during deletion: {str(e)}"
        )