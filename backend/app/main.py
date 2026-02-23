# app/main.py
import os
import time
import traceback
import sqlite3

from fastapi import FastAPI, Request, status, Depends
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.gzip import GZipMiddleware

from app.config import settings
from app.database import DatabaseConnection

from app.api.admin import popular_products as admin_popular_products
from app.api.admin import new_arrivals as admin_new_arrivals
from app.api.admin import news_events as admin_news_events
from app.api.admin import contact as admin_contact
from app.api.admin import password as admin_password
from app.api.admin import products as admin_products

from app.api.public import popular_products as public_popular_products
from app.api.public import new_arrivals as public_new_arrivals
from app.api.public import news_events as public_news_events
from app.api.public import contact as public_contact
from app.api.public import products as public_products

from app.auth.router import router as auth_router
from app.auth.dependencies import get_current_admin
from app.models.schemas import AdminUser

from app.utils.logging import log_error, log_info, log_exception, get_request_id
from app.utils.rate_limit import rate_limit_auth, rate_limit_api

# Create directories for uploads if they don't exist
os.makedirs(settings.POPULAR_PRODUCTS_DIR, exist_ok=True)
os.makedirs(settings.NEW_ARRIVALS_DIR, exist_ok=True)
os.makedirs(settings.PRODUCTS_DIR, exist_ok=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# -------------------------
# Middleware (CORS early)
# -------------------------
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
        "X-Request-ID",
    ],
    expose_headers=["X-Request-ID", "X-Process-Time"],
    max_age=3600,
)

# Request ID middleware
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = get_request_id()
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()

    if request.method == "DELETE":
        log_info(f"🗑️  DELETE request received: {request.url.path}", extra={
            "method": request.method,
            "path": request.url.path,
            "query_params": str(request.query_params),
            "client_host": request.client.host if request.client else "unknown",
            "user_agent": request.headers.get("user-agent", "unknown"),
            "authorization_header_present": "authorization" in request.headers,
            "content_type": request.headers.get("content-type", "unknown"),
        }, request=request)
    else:
        log_info(f"{request.method} {request.url.path}", extra={
            "query_params": str(request.query_params),
            "client_host": request.client.host if request.client else "unknown",
        }, request=request)

    response = await call_next(request)

    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)

    if request.method == "DELETE":
        log_info(f"🗑️  DELETE response: {response.status_code}", extra={
            "path": request.url.path,
            "status_code": response.status_code,
            "process_time_ms": round(process_time * 1000, 2),
        }, request=request)
    else:
        log_info(f"Response {response.status_code}", extra={
            "path": request.url.path,
            "status_code": response.status_code,
            "process_time_ms": round(process_time * 1000, 2),
        }, request=request)

    return response

# Rate limiting middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    path = request.url.path

    # Rate limit auth endpoints
    if path.startswith("/auth/") or path == "/auth/login":
        await rate_limit_auth(request)

    # Rate limit other API endpoints
    if (path.startswith("/api/") or path.startswith("/admin/")) and not (path.startswith("/auth/") or path.startswith("/api/v1/auth/")):
        await rate_limit_api(request)

    return await call_next(request)

# Compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# -------------------------
# Exception handlers
# -------------------------
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    log_error(f"HTTP exception: {exc.detail}", extra={
        "status_code": exc.status_code,
        "path": request.url.path,
        "method": request.method,
    }, request=request)

    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "request_id": getattr(request.state, "request_id", None)},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    error_details = [{"loc": e.get("loc", []), "msg": e.get("msg", ""), "type": e.get("type", "")} for e in exc.errors()]
    log_error("Validation error", extra={
        "path": request.url.path,
        "method": request.method,
        "errors": error_details,
    }, request=request)

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Validation error", "errors": error_details, "request_id": getattr(request.state, "request_id", None)},
    )

@app.exception_handler(sqlite3.Error)
async def sqlite_exception_handler(request: Request, exc: sqlite3.Error):
    log_exception(f"Database error: {str(exc)}", extra={
        "path": request.url.path,
        "method": request.method,
    }, request=request)
    return JSONResponse(
        status_code=500,
        content={"detail": "Database error occurred", "request_id": getattr(request.state, "request_id", None)},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    log_exception(f"Unhandled exception: {str(exc)}", extra={
        "path": request.url.path,
        "method": request.method,
        "traceback": traceback.format_exc(),
    }, request=request)

    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error occurred", "request_id": getattr(request.state, "request_id", None)},
    )

# -------------------------
# Static + Routers
# -------------------------
app.mount("/static", StaticFiles(directory=settings.STATIC_DIR), name="static")

# Auth router (ONLY ONCE)
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

# -------------------------
# Basic endpoints
# -------------------------
@app.get("/", tags=["Root"])
def read_root():
    return {
        "message": "Welcome to the Paint Website API",
        "version": settings.PROJECT_VERSION,
        "docs_url": "/docs",
        "environment": settings.ENV,
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "timestamp": time.time()}

@app.get("/health/db", tags=["Health"])
def db_health_check():
    try:
        with DatabaseConnection(transaction=False) as cursor:
            cursor.execute("SELECT 1 as test")
            result = cursor.fetchone()
        if result and result["test"] == 1:
            return {"status": "healthy", "message": "Database connection successful"}
        return {"status": "unhealthy", "message": "Database returned unexpected result"}
    except Exception as e:
        log_error(f"Database health check failed: {e}")
        return {"status": "unhealthy", "message": "Database connection failed", "error": str(e)}

# -------------------------
# Debug endpoints
# -------------------------
@app.delete("/debug/test-delete", tags=["Debug"])
async def test_delete_operation(current_user: AdminUser = Depends(get_current_admin)):
    log_info(f"Test DELETE operation called by admin: {current_user.username}")
    return {"message": "DELETE operation successful", "user": current_user.username, "timestamp": time.time()}

@app.options("/debug/cors-test", tags=["Debug"])
async def cors_test():
    return {"message": "CORS preflight successful"}

@app.get("/debug/cors-test", tags=["Debug"])
async def cors_get_test():
    return {"message": "CORS GET successful"}

# -------------------------
# Custom OpenAPI schema
# -------------------------
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=settings.PROJECT_NAME,
        version=settings.PROJECT_VERSION,
        description="API for a paint website with admin panel functionality.",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)