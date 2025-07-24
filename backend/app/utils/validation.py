# app/utils/validation.py
import re
import html
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, validator, EmailStr

def sanitize_string(text: Optional[str]) -> Optional[str]:
    """Sanitize string input"""
    if text is None:
        return None
    return html.escape(text)

def sanitize_dict(data: Dict[str, Any]) -> Dict[str, Any]:
    """Recursively sanitize all string values in a dictionary"""
    result = {}
    for key, value in data.items():
        if isinstance(value, str):
            result[key] = sanitize_string(value)
        elif isinstance(value, dict):
            result[key] = sanitize_dict(value)
        elif isinstance(value, list):
            result[key] = sanitize_list(value)
        else:
            result[key] = value
    return result

def sanitize_list(data: List[Any]) -> List[Any]:
    """Recursively sanitize all string values in a list"""
    result = []
    for item in data:
        if isinstance(item, str):
            result.append(sanitize_string(item))
        elif isinstance(item, dict):
            result.append(sanitize_dict(item))
        elif isinstance(item, list):
            result.append(sanitize_list(item))
        else:
            result.append(item)
    return result

class ContactForm(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str
    
    @validator('full_name')
    def name_must_be_valid(cls, v):
        if not v or len(v) < 2:
            raise ValueError('Name must be at least 2 characters')
        if not re.match(r'^[a-zA-Z\s.\'-]+$', v):
            raise ValueError('Name contains invalid characters')
        return v
    
    @validator('phone')
    def validate_phone(cls, v):
        if v is None:
            return v
        # Remove common formatting characters
        phone = re.sub(r'[\s\-\(\)\.]', '', v)
        # Check if it's a valid phone number
        if not re.match(r'^(\+\d{1,3})?(\d{10,15})$', phone):
            raise ValueError('Invalid phone number format')
        return phone
    
    @validator('message')
    def message_not_empty(cls, v):
        if not v or len(v) < 5:
            raise ValueError('Message must be at least 5 characters')
        return v

# Add more validation models for other form inputs as needed