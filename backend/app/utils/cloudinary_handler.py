# app/utils/cloudinary_handler.py
import cloudinary
import cloudinary.uploader
from app.config import settings
from app.utils.logging import log_info, log_error, log_warning
import re
from typing import Tuple, Optional

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

def upload_to_cloudinary(file, folder_name: str) -> Tuple[str, str]:
    """
    Upload file to Cloudinary
    Returns: (secure_url, public_id)
    """
    try:
        # Reset file pointer to beginning
        file.file.seek(0)
        
        result = cloudinary.uploader.upload(
            file.file,
            folder=f"paintcompany/{folder_name}",
            resource_type="auto",
            use_filename=True,
            unique_filename=True,
            overwrite=False
        )
        
        log_info(f"Successfully uploaded to Cloudinary: {result['public_id']}")
        return result['secure_url'], result['public_id']
        
    except Exception as e:
        log_error(f"Failed to upload to Cloudinary: {e}")
        raise Exception(f"Cloudinary upload failed: {str(e)}")

def delete_from_cloudinary(image_url: str) -> bool:
    """Delete image from Cloudinary using URL"""
    if not image_url:
        log_info("No image URL provided for deletion")
        return True  # Consider it successful if no URL
    
    if "cloudinary.com" not in image_url:
        log_warning(f"Not a Cloudinary URL, skipping: {image_url}")
        return True  # Not a Cloudinary image, consider it successful
    
    try:
        # Extract public_id from Cloudinary URL
        public_id = extract_public_id_from_url(image_url)
        
        if public_id:
            log_info(f"Attempting to delete Cloudinary image with public_id: {public_id}")
            result = cloudinary.uploader.destroy(public_id)
            
            success = result.get('result') in ['ok', 'not found']
            log_info(f"Cloudinary deletion result: {result} - Success: {success}")
            return success
        else:
            log_error(f"Could not extract public_id from URL: {image_url}")
            return False
            
    except Exception as e:
        log_error(f"Failed to delete from Cloudinary: {e}")
        return False

def extract_public_id_from_url(url: str) -> Optional[str]:
    """Extract public_id from Cloudinary URL"""
    try:
        log_info(f"Extracting public_id from URL: {url}")
        
        # Updated pattern to handle various Cloudinary URL formats
        # Example: https://res.cloudinary.com/duxgtkuq8/image/upload/v1753122729/paintcompany/products/products/56ae4a0c-7579-4e95-873d-9a29189d1d5d.png
        patterns = [
            # Pattern 1: With version number
            r'cloudinary\.com/[^/]+/[^/]+/upload/v\d+/(.+?)(?:\.[^.]+)?(?:\?|$)',
            # Pattern 2: Without version number
            r'cloudinary\.com/[^/]+/[^/]+/upload/(.+?)(?:\.[^.]+)?(?:\?|$)',
            # Pattern 3: More flexible pattern
            r'/upload/(?:v\d+/)?(.+?)(?:\.[^.]*)?(?:\?.*)?$'
        ]
        
        for i, pattern in enumerate(patterns):
            match = re.search(pattern, url)
            if match:
                public_id = match.group(1)
                log_info(f"Pattern {i+1} matched. Extracted public_id: {public_id}")
                return public_id
        
        log_error(f"Could not parse Cloudinary URL with any pattern: {url}")
        return None
            
    except Exception as e:
        log_error(f"Error extracting public_id: {e}")
        return None

def get_folder_name_from_directory(directory: str) -> str:
    """Convert directory path to Cloudinary folder name"""
    if "popular_products" in directory:
        return "popular_products"
    elif "new_arrivals" in directory:
        return "new_arrivals"
    elif "products" in directory:
        return "products"
    else:
        return "general"

def is_cloudinary_url(url: str) -> bool:
    """Check if URL is a Cloudinary URL"""
    if not url:
        return False
    return "cloudinary.com" in url