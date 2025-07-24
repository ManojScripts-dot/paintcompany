# app/utils/logging.py
import logging
import uuid
import sys
from typing import Dict, Any, Optional
from fastapi import Request
from app.config import settings

# Configure root logger
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL, "INFO"),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

# Create logger
logger = logging.getLogger("paint_website")

class RequestIdFilter(logging.Filter):
    """Add request_id to log records if available in context"""
    
    def filter(self, record):
        if not hasattr(record, 'request_id'):
            record.request_id = 'no_req_id'
        return True

# Add filter to logger
logger.addFilter(RequestIdFilter())

def get_request_id(request: Optional[Request] = None) -> str:
    """Generate or extract request ID"""
    if request:
        if hasattr(request.state, 'request_id'):
            return request.state.request_id
    return str(uuid.uuid4())

def log_info(message: str, extra: Dict[str, Any] = None, request: Request = None):
    """Log info level message with structured data"""
    req_id = get_request_id(request)
    extra_data = extra or {}
    extra_data.update({"request_id": req_id})
    logger.info(message, extra=extra_data)

def log_warning(message: str, extra: Dict[str, Any] = None, request: Request = None):
    """Log warning level message with structured data"""
    req_id = get_request_id(request)
    extra_data = extra or {}
    extra_data.update({"request_id": req_id})
    logger.warning(message, extra=extra_data)

def log_error(message: str, exc_info=None, extra: Dict[str, Any] = None, request: Request = None):
    """Log error level message with structured data and optional exception info"""
    req_id = get_request_id(request)
    extra_data = extra or {}
    extra_data.update({"request_id": req_id})
    logger.error(message, exc_info=exc_info, extra=extra_data)

def log_exception(message: str, exc_info=True, extra: Dict[str, Any] = None, request: Request = None):
    """Log critical level message with structured data and exception info"""
    req_id = get_request_id(request)
    extra_data = extra or {}
    extra_data.update({"request_id": req_id})
    logger.exception(message, exc_info=exc_info, extra=extra_data)