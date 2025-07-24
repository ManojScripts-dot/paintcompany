# app/models/schemas.py
from datetime import date, datetime
from enum import Enum
from typing import List, Optional, Dict,Any
from pydantic import BaseModel, EmailStr, Field

# Enums
class NewsEventType(str, Enum):
    news = "news"
    event = "event"

class ProductType(str, Enum):
    interior = "Interior"
    exterior = "Exterior"
    other = "Other"

# Base models for image upload
class ImageUpload(BaseModel):
    filename: str
    content_type: str
    
# Popular Products
class ProductFeature(BaseModel):
    text: str

class PopularProductBase(BaseModel):
    name: str
    type: ProductType
    description: str
    features: List[str]
    rating: float = Field(..., ge=1.0, le=5.0)

class PopularProductCreate(PopularProductBase):
    pass

class PopularProductUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[ProductType] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    rating: Optional[float] = Field(None, ge=1.0, le=5.0)

class PopularProductInDB(PopularProductBase):
    id: int
    image_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class PopularProduct(PopularProductInDB):
    pass

# New Arrivals
class NewArrivalBase(BaseModel):
    name: str
    description: str
    release_date: date

class NewArrivalCreate(NewArrivalBase):
    pass

class NewArrivalUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    release_date: Optional[date] = None

class NewArrivalInDB(NewArrivalBase):
    id: int
    image_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class NewArrival(NewArrivalInDB):
    pass

# News and Events
class NewsEventBase(BaseModel):
    title: str
    type: NewsEventType
    content: str
    date: date
    end_date: Optional[date] = None
    highlighted: bool = False

class NewsEventCreate(NewsEventBase):
    pass

class NewsEventUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[NewsEventType] = None
    content: Optional[str] = None
    date: Optional[date] = None
    end_date: Optional[date] = None
    highlighted: Optional[bool] = None

class NewsEventInDB(NewsEventBase):
    id: int
    created_at: datetime
    updated_at: datetime

class NewsEvent(NewsEventInDB):
    pass

# Contact Submissions
class ContactSubmissionBase(BaseModel):
    full_name: str
    email: EmailStr
    message: str

class ContactSubmissionCreate(ContactSubmissionBase):
    pass

class ContactSubmissionInDB(ContactSubmissionBase):
    id: int
    submission_date: datetime
    read_status: bool = False

class ContactSubmission(ContactSubmissionInDB):
    pass

class ContactSubmissionUpdate(BaseModel):
    read_status: bool

# Static Contact Info
class StaticContactInfoBase(BaseModel):
    email: EmailStr
    phone: str
    address: str

class StaticContactInfoUpdate(StaticContactInfoBase):
    pass

class StaticContactInfoInDB(StaticContactInfoBase):
    id: int = 1
    updated_at: datetime

class StaticContactInfo(StaticContactInfoInDB):
    pass

# Pagination
class PaginatedResponse(BaseModel):
    items: List
    total: int
    page: int
    size: int
    pages: int
    
# Add these models to your existing app/models/schemas.py file

# Product Models
class ProductBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    features: List[str] = []
    stock: str = "In Stock"

class ProductCreate(ProductBase):
    # Price fields are optional strings to support currency formatting
    price1L: Optional[str] = None
    price4L: Optional[str] = None
    price5L: Optional[str] = None
    price10L: Optional[str] = None
    price20L: Optional[str] = None
    price500ml: Optional[str] = None
    price200ml: Optional[str] = None
    price1kg: Optional[str] = None
    price500g: Optional[str] = None
    price200g: Optional[str] = None
    price100g: Optional[str] = None
    price50g: Optional[str] = None
    image_url: str  # Changed to required field
    image_url: str  # Changed to required field

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    stock: Optional[str] = None
    price1L: Optional[str] = None
    price4L: Optional[str] = None
    price5L: Optional[str] = None
    price10L: Optional[str] = None
    price20L: Optional[str] = None
    price500ml: Optional[str] = None
    price200ml: Optional[str] = None
    price1kg: Optional[str] = None
    price500g: Optional[str] = None
    price200g: Optional[str] = None
    price100g: Optional[str] = None
    price50g: Optional[str] = None
    image_url: Optional[str] = None
    image_url: Optional[str] = None

class Product(ProductBase):
    id: int
    image_url: str  # Changed from Optional[str] = None to required field
    image_url: str  # Changed from Optional[str] = None to required field
    price1L: Optional[str] = None
    price4L: Optional[str] = None
    price5L: Optional[str] = None
    price10L: Optional[str] = None
    price20L: Optional[str] = None
    price500ml: Optional[str] = None
    price200ml: Optional[str] = None
    price1kg: Optional[str] = None
    price500g: Optional[str] = None
    price200g: Optional[str] = None
    price100g: Optional[str] = None
    price50g: Optional[str] = None
    prices: Dict[str, str] = {}  # Added to support frontend price display
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True
        
# Add these models to app/models/schemas.py - add at the end of your existing file

# Authentication models
class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: Optional[str] = None

class TokenData(BaseModel):
    username: Optional[str] = None
    exp: Optional[float] = None

class AdminUser(BaseModel):
    id: int
    username: str
    email: str

class AdminUserInDB(AdminUser):
    password_hash: str