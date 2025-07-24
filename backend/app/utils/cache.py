# app/utils/cache.py
import time
import functools
import hashlib
import inspect
from typing import Dict, Any, Callable, Optional
from app.config import settings

# Simple in-memory cache
class Cache:
    def __init__(self):
        self.cache: Dict[str, Dict[str, Any]] = {}
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None):
        """
        Store a value in the cache with optional TTL
        """
        if ttl is None:
            ttl = 300  # Default 5 minutes
            
        expires_at = time.time() + ttl
        
        self.cache[key] = {
            "value": value,
            "expires_at": expires_at
        }
    
    def get(self, key: str) -> Optional[Any]:
        """
        Get a value from the cache if it exists and hasn't expired
        """
        item = self.cache.get(key)
        
        if not item:
            return None
            
        if time.time() > item["expires_at"]:
            # Expired
            del self.cache[key]
            return None
            
        return item["value"]
    
    def delete(self, key: str):
        """
        Remove a key from the cache
        """
        if key in self.cache:
            del self.cache[key]
    
    def clear(self):
        """
        Clear the entire cache
        """
        self.cache.clear()
    
    def cleanup(self):
        """
        Remove expired items
        """
        now = time.time()
        for key in list(self.cache.keys()):
            if now > self.cache[key]["expires_at"]:
                del self.cache[key]

# Create cache instance
cache = Cache()

# Run cleanup every hour
import threading
def cache_cleanup_task():
    while True:
        time.sleep(3600)  # 1 hour
        cache.cleanup()

threading.Thread(target=cache_cleanup_task, daemon=True).start()

def cached(ttl: Optional[int] = None):
    """
    Decorator for caching function results (works with both sync and async functions)
    """
    def decorator(func: Callable):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # Create cache key from function name and arguments
            key_parts = [func.__name__]
            
            # Add args and kwargs to key
            if args:
                for arg in args:
                    if isinstance(arg, (str, int, float, bool, type(None))):
                        key_parts.append(str(arg))
            
            if kwargs:
                for k, v in sorted(kwargs.items()):
                    if isinstance(v, (str, int, float, bool, type(None))):
                        key_parts.append(f"{k}={v}")
            
            cache_key = hashlib.md5(":".join(key_parts).encode()).hexdigest()
            
            # Check cache
            cached_result = cache.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            result = func(*args, **kwargs)
            cache.set(cache_key, result, ttl)
            
            return result
        
        # Add cache clear method
        def clear_cache():
            # Clear all cache entries for this function
            prefix = func.__name__
            for key in list(cache.cache.keys()):
                if key.startswith(prefix):
                    cache.delete(key)
        
        # Use setattr to avoid type checker issues
        setattr(wrapper, 'clear_cache', clear_cache)
        
        return wrapper
    
    return decorator