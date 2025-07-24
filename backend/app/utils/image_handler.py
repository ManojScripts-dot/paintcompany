# app/utils/image_handler.py
import os
import uuid
import shutil
from fastapi import HTTPException, UploadFile
from app.config import settings
from app.utils.logging import log_info, log_warning, log_error

# Import Cloudinary functions
if settings.USE_CLOUDINARY:
    from app.utils.cloudinary_handler import (
        upload_to_cloudinary, 
        delete_from_cloudinary, 
        get_folder_name_from_directory,
        is_cloudinary_url
    )

def validate_image(file: UploadFile) -> bool:
    """Validate if uploaded file is an image"""
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    
    if file.content_type not in allowed_types:
        return False
    
    return True

def save_image(file: UploadFile, directory: str) -> str:
    """Save image - either to Cloudinary or local storage"""
    if not validate_image(file):
        raise HTTPException(status_code=400, detail="Invalid image format. Only JPEG, PNG, WebP, and GIF are allowed.")
    
    # Check file size
    file.file.seek(0, 2)  # Move to end of file
    file_size = file.file.tell()  # Get file size
    file.file.seek(0)  # Reset file position
    
    if file_size > settings.MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")
    
    if settings.USE_CLOUDINARY:
        try:
            # Upload to Cloudinary
            folder_name = get_folder_name_from_directory(directory)
            log_info(f"Uploading to Cloudinary folder: {folder_name}")
            
            secure_url, public_id = upload_to_cloudinary(file, folder_name)
            log_info(f"Successfully uploaded to Cloudinary: {secure_url}")
            return secure_url  # Return the Cloudinary URL
            
        except Exception as e:
            log_error(f"Cloudinary upload failed: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
    else:
        # Fallback to local storage
        return save_local_image(file, directory)

def save_local_image(file: UploadFile, directory: str) -> str:
    """Save image to local storage"""
    file_extension = os.path.splitext(file.filename)[1].lower()
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(directory, unique_filename)
    
    # Create directory if it doesn't exist
    os.makedirs(directory, exist_ok=True)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        log_info(f"Successfully saved local image: {unique_filename}")
        return unique_filename
    except Exception as e:
        log_error(f"Could not save local image {unique_filename}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Could not save image: {str(e)}")

def delete_image(filename_or_url: str, directory: str = None) -> bool:
    """Delete image - handles both Cloudinary URLs and local files"""
    if not filename_or_url:
        log_info("No filename or URL provided for image deletion")
        return True  # Consider it successful if no image to delete
    
    # Check if it's a Cloudinary URL
    if is_cloudinary_url(filename_or_url):
        log_info(f"Attempting to delete Cloudinary image: {filename_or_url}")
        if settings.USE_CLOUDINARY:
            return delete_from_cloudinary(filename_or_url)
        else:
            log_warning("Cloudinary URL provided but Cloudinary is disabled")
            return True  # Don't fail the operation
    else:
        # Handle local file deletion
        return delete_local_image(filename_or_url, directory)

def delete_local_image(filename: str, directory: str) -> bool:
    """Delete local image file"""
    if not filename or not directory:
        log_warning("Missing filename or directory for local image deletion")
        return True  # Don't fail the operation
        
    file_path = os.path.join(directory, filename)
    log_info(f"Attempting to delete local image: {file_path}")
    
    if not os.path.exists(file_path):
        log_warning(f"Local image file not found: {file_path}")
        return True  # File doesn't exist, consider it successful
    
    if not os.access(directory, os.W_OK):
        log_error(f"Directory not writable: {directory}")
        return False
    
    if not os.access(file_path, os.W_OK):
        log_error(f"File not writable: {file_path}")
        return False
    
    try:
        os.remove(file_path)
        log_info(f"Successfully deleted local image: {file_path}")
        return True
    except Exception as e:
        log_error(f"Failed to delete local image {file_path}: {e}")
        return False

def get_image_url(filename_or_url: str, directory_type: str) -> str:
    """Generate URL for accessing the image"""
    if not filename_or_url:
        return None
    
    # If it's already a full URL (Cloudinary), return as-is
    if filename_or_url.startswith(("http://", "https://")):
        return filename_or_url
    
    # Otherwise, treat as local file and generate local URL
    if directory_type == "popular_products":
        return f"/static/uploads/popular_products/{filename_or_url}"
    elif directory_type == "new_arrivals":
        return f"/static/uploads/new_arrivals/{filename_or_url}"
    elif directory_type == "products":
        return f"/static/uploads/products/{filename_or_url}"
    else:
        return None

def check_image_permissions(directory: str) -> dict:
    """Check permissions for image directory - useful for debugging"""
    try:
        if not os.path.exists(directory):
            os.makedirs(directory, exist_ok=True)
        
        return {
            "exists": os.path.exists(directory),
            "readable": os.access(directory, os.R_OK),
            "writable": os.access(directory, os.W_OK),
            "executable": os.access(directory, os.X_OK),
            "path": directory,
            "cloudinary_enabled": settings.USE_CLOUDINARY
        }
    except Exception as e:
        return {
            "error": str(e),
            "path": directory,
            "cloudinary_enabled": settings.USE_CLOUDINARY
        }