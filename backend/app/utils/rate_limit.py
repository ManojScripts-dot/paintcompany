# app/utils/rate_limit.py
import time
from fastapi import Request, HTTPException, status
from typing import Dict, List, Tuple, Optional
from app.config import settings
from app.utils.logging import log_warning

# Simple in-memory store for rate limiting
class RateLimiter:
    def __init__(self, max_requests: int, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, List[float]] = {}
    
    def is_rate_limited(self, key: str) -> Tuple[bool, Optional[int]]:
        """
        Check if a key is rate limited.
        Returns (is_limited, reset_time_seconds)
        """
        now = time.time()
        
        # Initialize if key doesn't exist
        if key not in self.requests:
            self.requests[key] = []
        
        # Remove timestamps outside the window
        self.requests[key] = [t for t in self.requests[key] if now - t < self.window_seconds]
        
        # Check if rate limited
        if len(self.requests[key]) >= self.max_requests:
            # Calculate reset time
            oldest = min(self.requests[key])
            reset_seconds = int(self.window_seconds - (now - oldest))
            return True, reset_seconds
        
        # Add current request
        self.requests[key].append(now)
        return False, None
    
    def cleanup(self):
        """Remove expired entries to prevent memory leaks"""
        now = time.time()
        for key in list(self.requests.keys()):
            # Remove timestamps outside the window
            self.requests[key] = [t for t in self.requests[key] if now - t < self.window_seconds]
            
            # Remove empty keys
            if not self.requests[key]:
                del self.requests[key]

# Create limiter instances
auth_limiter = RateLimiter(5, 60)  # 5 requests per minute for auth endpoints
api_limiter = RateLimiter(60, 60)  # 60 requests per minute for general API endpoints

# Cleanup old entries every hour
import threading
def cleanup_task():
    while True:
        time.sleep(3600)  # 1 hour
        auth_limiter.cleanup()
        api_limiter.cleanup()

threading.Thread(target=cleanup_task, daemon=True).start()

async def rate_limit_auth(request: Request):
    """Middleware for rate limiting auth endpoints"""
    key = f"{request.client.host}_auth"  # Use IP as key for auth endpoints
    limited, reset = auth_limiter.is_rate_limited(key)
    
    if limited:
        log_warning(f"Rate limit exceeded for auth endpoint: {request.url.path}", 
                   extra={"client_ip": request.client.host}, request=request)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Try again in {reset} seconds.",
            headers={"Retry-After": str(reset)}
        )

async def rate_limit_api(request: Request):
    """Middleware for rate limiting general API endpoints"""
    # For authenticated requests, use user ID as key if available
    if hasattr(request.state, "user") and request.state.user:
        key = f"user_{request.state.user.id}"
    else:
        # Fall back to IP address
        key = f"{request.client.host}_api"
    
    limited, reset = api_limiter.is_rate_limited(key)
    
    if limited:
        log_warning(f"Rate limit exceeded for API endpoint: {request.url.path}", 
                   extra={"client_ip": request.client.host}, request=request)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Try again in {reset} seconds.",
            headers={"Retry-After": str(reset)}
        )