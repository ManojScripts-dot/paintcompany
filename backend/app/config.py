# app/config.py
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    PROJECT_NAME: str = "Paint Website API"
    PROJECT_VERSION: str = "1.0.0"
    
    # Environment
    ENV: str = os.getenv("ENV", "development")
    DEBUG: bool = ENV == "development"
    
    # Database - PostgreSQL (Supabase)
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    
    # Individual database components (matching your working connection)
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "6543")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "postgres")
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Admin password reset
    SUPERADMIN_RESET_KEY: str = os.getenv("SUPERADMIN_RESET_KEY")
    
    # Cloudinary settings
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")  
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")
    USE_CLOUDINARY: bool = os.getenv("USE_CLOUDINARY", "false").lower() == "true"
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",  # React frontend
        "http://localhost:5173",  # Vite development server
        "http://localhost:5174",  # Admin panel (if on different port)
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "https://paintcompany.vercel.app",  # Your Vercel frontend
        "https://paintcompanybackend.onrender.com",  # Your Render backend (for docs)
        "https://paintcompany.shresthamanoj.info.np",
        "https://www.paintcompany.shresthamanoj.info.np",  # Allow all Vercel preview deployments
    ]
    
    # Static files (kept for backward compatibility)
    STATIC_DIR: str = "static"
    UPLOAD_DIR: str = os.path.join(STATIC_DIR, "uploads")
    POPULAR_PRODUCTS_DIR: str = os.path.join(UPLOAD_DIR, "popular_products")
    NEW_ARRIVALS_DIR: str = os.path.join(UPLOAD_DIR, "new_arrivals")
    PRODUCTS_DIR: str = os.path.join(UPLOAD_DIR, "products") 
    MAX_IMAGE_SIZE: int = 5 * 1024 * 1024  # 5MB
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

settings = Settings()