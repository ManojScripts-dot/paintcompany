# app/main.py
import os
import traceback
import time
import stat
from fastapi import FastAPI, Request, status, Depends
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.gzip import GZipMiddleware
import sqlite3

from app.config import settings
from app.api.admin import popular_products as admin_popular_products
from app.api.admin import new_arrivals as admin_new_arrivals
from app.api.admin import news_events as admin_news_events
from app.api.admin import contact as admin_contact
from app.api.admin import password as admin_password
from app.api.public import popular_products as public_popular_products
from app.api.public import new_arrivals as public_new_arrivals
from app.api.public import news_events as public_news_events
from app.api.public import contact as public_contact
from app.api.public import products as public_products 
from app.api.admin import products as admin_products

from app.auth.router import router as auth_router
from app.auth.dependencies import get_current_admin
from app.models.schemas import AdminUser
from app.utils.logging import logger, log_error, log_info, log_exception, get_request_id
from app.utils.rate_limit import rate_limit_auth, rate_limit_api
from app.utils.image_handler import check_image_permissions
from app.database import DatabaseConnection

# Create directories for uploads if they don't exist
os.makedirs(settings.POPULAR_PRODUCTS_DIR, exist_ok=True)
os.makedirs(settings.NEW_ARRIVALS_DIR, exist_ok=True)
os.makedirs(settings.PRODUCTS_DIR, exist_ok=True)

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Request ID middleware
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = get_request_id()
    request.state.request_id = request_id
    
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    
    return response

# Enhanced request logging middleware with DELETE operation focus
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Special logging for DELETE requests
    if request.method == "DELETE":
        log_info(f"🗑️  DELETE request received: {request.url.path}", extra={
            "method": request.method,
            "path": request.url.path,
            "query_params": str(request.query_params),
            "client_host": request.client.host if request.client else "unknown",
            "user_agent": request.headers.get("user-agent", "unknown"),
            "authorization_header_present": "authorization" in request.headers,
            "content_type": request.headers.get("content-type", "unknown")
        }, request=request)
    else:
        # Regular logging for other requests
        log_info(f"{request.method} {request.url.path}", extra={
            "query_params": str(request.query_params),
            "client_host": request.client.host if request.client else "unknown"
        }, request=request)
    
    response = await call_next(request)
    
    # Calculate process time
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    
    # Enhanced logging for DELETE responses
    if request.method == "DELETE":
        log_info(f"🗑️  DELETE response: {response.status_code}", extra={
            "path": request.url.path,
            "status_code": response.status_code,
            "process_time_ms": round(process_time * 1000, 2),
            "response_headers": dict(response.headers)
        }, request=request)
    else:
        log_info(f"Response {response.status_code}", extra={
            "path": request.url.path,
            "status_code": response.status_code,
            "process_time_ms": round(process_time * 1000, 2)
        }, request=request)
    
    return response

# Add CORS middleware - deployment-ready: no CORS block for allowed origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=settings.CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "X-Request-ID"
    ],
    expose_headers=["X-Request-ID", "X-Process-Time"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Exception handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    log_error(f"HTTP exception: {exc.detail}", extra={
        "status_code": exc.status_code,
        "path": request.url.path,
        "method": request.method
    }, request=request)
    
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "request_id": request.state.request_id}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    error_details = []
    for error in exc.errors():
        error_details.append({
            "loc": error.get("loc", []),
            "msg": error.get("msg", ""),
            "type": error.get("type", "")
        })
    
    log_error("Validation error", extra={
        "path": request.url.path,
        "method": request.method,
        "errors": error_details
    }, request=request)
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Validation error",
            "errors": error_details,
            "request_id": request.state.request_id
        }
    )

@app.exception_handler(sqlite3.Error)
async def sqlite_exception_handler(request: Request, exc: sqlite3.Error):
    log_exception(f"Database error: {str(exc)}", extra={
        "path": request.url.path,
        "method": request.method,
        "error_code": getattr(exc, "args", ["Unknown"])[0] if hasattr(exc, "args") else "Unknown"
    }, request=request)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Database error occurred",
            "request_id": request.state.request_id
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    log_exception(f"Unhandled exception: {str(exc)}", extra={
        "path": request.url.path,
        "method": request.method,
        "traceback": traceback.format_exc()
    }, request=request)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error occurred",
            "request_id": request.state.request_id
        }
    )

# Serve static files
app.mount("/static", StaticFiles(directory=settings.STATIC_DIR), name="static")

# Include routers (legacy API only)
# Auth router
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

# Admin routers
app.include_router(admin_popular_products.router, prefix="/admin/popular-products", tags=["Admin - Popular Products"])
app.include_router(admin_new_arrivals.router, prefix="/admin/new-arrivals", tags=["Admin - New Arrivals"])
app.include_router(admin_news_events.router, prefix="/admin/news-events", tags=["Admin - News & Events"])
app.include_router(admin_contact.router, prefix="/admin/contact", tags=["Admin - Contact"])
app.include_router(admin_products.router, prefix="/admin/products", tags=["Admin - Products"])
app.include_router(admin_password.router, prefix="/admin/password", tags=["Admin - Password Management"])

# Public routers
app.include_router(public_popular_products.router, prefix="/api/popular-products", tags=["Popular Products"])
app.include_router(public_new_arrivals.router, prefix="/api/new-arrivals", tags=["New Arrivals"])
app.include_router(public_news_events.router, prefix="/api/news-events", tags=["News & Events"])
app.include_router(public_contact.router, prefix="/api/contact", tags=["Contact"])
app.include_router(public_products.router, prefix="/api/products", tags=["Products"])

# Root endpoint
@app.get("/", tags=["Root"])
def read_root():
    return {
        "message": "Welcome to the Paint Website API",
        "version": settings.PROJECT_VERSION,
        "current_api_version": "v1",
        "docs_url": "/docs",
        "environment": settings.ENV
    }

# Version info endpoint 
@app.get("/api/version", tags=["API Info"])
def api_version():
    return {
        "api_version": "v1",
        "app_version": settings.PROJECT_VERSION,
        "environment": settings.ENV,
        "deprecation_policy": "Legacy non-versioned endpoints will be removed in future releases"
    }

# Health check endpoint
@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "timestamp": time.time()}

# Database health check endpoint
@app.get("/health/db", tags=["Health"])
def db_health_check():
    """Check database connectivity"""
    try:
        with DatabaseConnection(transaction=False) as cursor:
            cursor.execute("SELECT 1 as test")
            result = cursor.fetchone()
            
            if result and result["test"] == 1:
                return {"status": "healthy", "message": "Database connection successful"}
            else:
                return {"status": "unhealthy", "message": "Database returned unexpected result"}
    except Exception as e:
        log_error(f"Database health check failed: {e}")
        return {
            "status": "unhealthy", 
            "message": "Database connection failed",
            "error": str(e)
        }

# Enhanced debug endpoint for production environment
@app.get("/debug/environment", tags=["Debug"])
async def debug_environment(current_user: AdminUser = Depends(get_current_admin)):
    """Debug endpoint to check production environment and permissions"""
    debug_info = {
        "environment": settings.ENV,
        "database_url_prefix": settings.DATABASE_URL[:50] + "..." if settings.DATABASE_URL else "None",
        "cors_origins": settings.CORS_ORIGINS,
        "static_directories": {},
        "filesystem_permissions": {},
        "system_info": {
            "cwd": os.getcwd(),
            "python_path": os.environ.get("PYTHONPATH", "Not set"),
            "user": os.environ.get("USER", "Unknown"),
        }
    }
    
    # Check directory permissions
    directories_to_check = [
        ("static_dir", settings.STATIC_DIR),
        ("upload_dir", settings.UPLOAD_DIR),
        ("products_dir", settings.PRODUCTS_DIR),
        ("popular_products_dir", settings.POPULAR_PRODUCTS_DIR),
        ("new_arrivals_dir", settings.NEW_ARRIVALS_DIR)
    ]
    
    for name, directory in directories_to_check:
        try:
            debug_info["static_directories"][name] = directory
            
            if os.path.exists(directory):
                stat_info = os.stat(directory)
                debug_info["filesystem_permissions"][name] = {
                    "path": directory,
                    "exists": True,
                    "readable": os.access(directory, os.R_OK),
                    "writable": os.access(directory, os.W_OK),
                    "executable": os.access(directory, os.X_OK),
                    "mode": oct(stat_info.st_mode),
                    "owner_uid": stat_info.st_uid,
                    "group_gid": stat_info.st_gid,
                    "size": stat_info.st_size
                }
                
                # List files in directory (max 10)
                try:
                    files = os.listdir(directory)[:10]
                    debug_info["filesystem_permissions"][name]["sample_files"] = files
                except Exception as e:
                    debug_info["filesystem_permissions"][name]["list_error"] = str(e)
                    
            else:
                debug_info["filesystem_permissions"][name] = {
                    "path": directory,
                    "exists": False,
                    "can_create": os.access(os.path.dirname(directory), os.W_OK) if os.path.exists(os.path.dirname(directory)) else False
                }
        except Exception as e:
            debug_info["filesystem_permissions"][name] = {
                "path": directory,
                "error": str(e)
            }
    
    return debug_info

# Debug endpoint for testing DELETE operations
@app.delete("/debug/test-delete", tags=["Debug"])
async def test_delete_operation(current_user: AdminUser = Depends(get_current_admin)):
    """Test endpoint to verify DELETE method works"""
    log_info(f"Test DELETE operation called by admin: {current_user.username}")
    return {
        "message": "DELETE operation successful",
        "user": current_user.username,
        "timestamp": time.time(),
        "method": "DELETE"
    }

# Debug endpoint for CORS testing
@app.options("/debug/cors-test", tags=["Debug"])
async def cors_test():
    """Test CORS preflight requests"""
    return {"message": "CORS preflight successful"}

@app.get("/debug/cors-test", tags=["Debug"])
async def cors_get_test():
    """Test CORS GET requests"""
    return {"message": "CORS GET successful"}

# Custom OpenAPI schema
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=settings.PROJECT_NAME,
        version=settings.PROJECT_VERSION,
        description="API for a paint website with admin panel functionality. Current API version: v1",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2PasswordBearer": {
            "type": "oauth2",
            "flows": {
                "password": {
                    "tokenUrl": "/auth/login",
                    "scopes": {}
                }
            }
        }
    }
    openapi_schema["security"] = [{"OAuth2PasswordBearer": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Rate limiting setup
app.include_router(
    auth_router, 
    prefix="/api/v1/auth", 
    tags=["Authentication"],
    dependencies=[Depends(rate_limit_auth)]
)

# Also apply to legacy auth endpoint
app.include_router(
    auth_router, 
    prefix="/auth", 
    tags=["Authentication (Legacy)"],
    dependencies=[Depends(rate_limit_auth)]
)

# Add rate limiting middleware for API endpoints
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # Only apply rate limiting to API endpoints that aren't auth endpoints
    path = request.url.path
    if path.startswith("/api/") and not path.startswith("/api/v1/auth/") and not path.startswith("/auth/"):
        await rate_limit_api(request)
    
    return await call_next(request)

# Add compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Debug endpoint to check product data
@app.get("/debug/products", tags=["Debug"])
async def debug_products(current_user: AdminUser = Depends(get_current_admin)):
    """Debug endpoint to check product data structure"""
    try:
        with DatabaseConnection() as cursor:
            cursor.execute("""
                SELECT 
                    id, name, category,
                    price1L, price4L, price5L, price10L, price20L, 
                    price500ml, price200ml, price1kg, 
                    price500g, price200g, price100g, price50g,
                    image_url, created_at
                FROM products 
                ORDER BY created_at DESC
                LIMIT 5
            """)
            products = cursor.fetchall()
            
            debug_info = []
            for product in products:
                product_dict = dict(product)
                
                # Show raw price data
                prices = {}
                price_fields = [
                    "price1L", "price4L", "price5L", "price10L", "price20L", 
                    "price500ml", "price200ml", "price1kg", 
                    "price500g", "price200g", "price100g", "price50g"
                ]
                
                for field in price_fields:
                    if product_dict.get(field):
                        key = field.replace("price", "")
                        prices[key] = product_dict[field]
                
                debug_info.append({
                    "id": product_dict["id"],
                    "name": product_dict["name"],
                    "category": product_dict["category"],
                    "image_url": product_dict.get("image_url"),
                    "created_at": str(product_dict.get("created_at")),
                    "raw_prices": {field: product_dict.get(field) for field in price_fields},
                    "processed_prices": prices
                })
            
            return {
                "status": "success",
                "total_products": len(products),
                "sample_products": debug_info,
                "admin_user": current_user.username
            }
            
    except Exception as e:
        log_error(f"Debug products endpoint failed: {e}", exc_info=True)
        return {
            "status": "error",
            "error": str(e),
            "admin_user": current_user.username
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)