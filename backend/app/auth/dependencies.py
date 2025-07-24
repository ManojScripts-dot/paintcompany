# app/auth/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime
from app.config import settings
from app.database import DatabaseConnection
from app.models.schemas import TokenData, AdminUser
from app.auth.utils import get_user

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Dependency to get the current authenticated user from the JWT token.
    This is used to protect routes that require authentication.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Check if token is revoked
        with DatabaseConnection() as cursor:
            cursor.execute(
                "SELECT id FROM revoked_tokens WHERE token = %s",
                (token,)
            )
            if cursor.fetchone():
                raise credentials_exception
        
        # Decode the JWT token
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        # Debug: print payload for troubleshooting
        print("Decoded JWT payload:", payload)
        # Extract username from token
        username = payload.get("sub")
        if not username or not isinstance(username, str):
            print("JWT payload missing 'sub' or 'sub' is not a string.")
            raise credentials_exception
        token_data = TokenData(username=username, exp=payload.get("exp"))
    except JWTError:
        raise credentials_exception
    
    # Get user data from database
    with DatabaseConnection() as cursor:
        cursor.execute(
            "SELECT id, username, email FROM admin_users WHERE username = %s",
            (token_data.username,)
        )
        user_data = cursor.fetchone()
        
        if user_data is None:
            raise credentials_exception
    
    return AdminUser(**dict(user_data))

async def get_current_admin(current_user: AdminUser = Depends(get_current_user)):
    """
    Dependency to ensure the user is an admin.
    Currently just passes through the current user, but could be extended
    to check for specific admin roles or permissions in the future.
    """
    return current_user