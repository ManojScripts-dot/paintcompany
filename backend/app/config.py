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
    
    # CORS - deployment-ready: env CORS_ORIGINS (comma-separated) is merged with defaults
    _DEFAULT_CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "https://paintcompany.vercel.app",
        "https://paintcompany-kakr.onrender.com/",
        "https://paintcompany.shresthamanoj.info.np",
        "https://www.paintcompany.shresthamanoj.info.np",
        "http://paintcompany.shresthamanoj.info.np",
        "http://www.paintcompany.shresthamanoj.info.np",
    ]
    # Any subdomain of shresthamanoj.info.np (so CORS never blocks your domain)
    CORS_ORIGIN_REGEX: str = r"^https?://([a-zA-Z0-9-]+\.)*shresthamanoj\.info\.np$"


def _build_cors_origins() -> list:
    default = list(Settings._DEFAULT_CORS_ORIGINS)
    extra = os.getenv("CORS_ORIGINS", "")
    if extra:
        for origin in extra.split(","):
            origin = origin.strip()
            if origin and origin not in default:
                default.append(origin)
    return default


# Apply CORS_ORIGINS after Settings is defined
Settings.CORS_ORIGINS = _build_cors_origins()


# Static files (kept for backward compatibility) - must be on Settings
Settings.STATIC_DIR = "static"
Settings.UPLOAD_DIR = os.path.join(Settings.STATIC_DIR, "uploads")
Settings.POPULAR_PRODUCTS_DIR = os.path.join(Settings.UPLOAD_DIR, "popular_products")
Settings.NEW_ARRIVALS_DIR = os.path.join(Settings.UPLOAD_DIR, "new_arrivals")
Settings.PRODUCTS_DIR = os.path.join(Settings.UPLOAD_DIR, "products")
Settings.MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB
Settings.LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

settings = Settings()