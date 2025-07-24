# app/auth/router.py
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from app.database import DatabaseConnection
from app.config import settings
from app.models.schemas import Token, AdminUser
from app.auth.utils import authenticate_user, create_access_token, create_refresh_token
from app.auth.dependencies import get_current_user
from app.utils.logging import log_error

router = APIRouter()

@router.post("/login", response_model=Token, operation_id="login_for_access_token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticate user and provide JWT token
    """
    print(f"🔐 Login attempt for username: {form_data.username}")
    
    # Check if user exists
    from app.auth.utils import get_user
    user_check = get_user(form_data.username)
    if user_check:
        print(f"✅ User found: {user_check.username}")
        print(f"🔑 Password hash: {user_check.password_hash[:20]}...")
    else:
        print(f"❌ User not found: {form_data.username}")
    
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        print(f"❌ Authentication failed for: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"✅ Authentication successful for: {user.username}")
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, 
        expires_delta=access_token_expires
    )
    
    # Create refresh token
    refresh_token = create_refresh_token(data={"sub": user.username})
    
    return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token}

@router.post("/refresh", response_model=Token, operation_id="refresh_access_token")
async def refresh_access_token(refresh_token: str):
    """
    Create a new access token using a refresh token
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode the refresh token
        payload = jwt.decode(
            refresh_token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        
        username = payload.get("sub")
        if not username or not isinstance(username, str):
            print("JWT payload missing 'sub' or 'sub' is not a string.")
            raise credentials_exception
        
        # Create new access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": username}, 
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "refresh_token": refresh_token  # Return the same refresh token
        }
    except JWTError:
        raise credentials_exception

@router.get("/me", response_model=AdminUser, operation_id="read_users_me")
async def read_users_me(current_user: AdminUser = Depends(get_current_user)):
    """
    Get current user information
    """
    return current_user

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT, operation_id="logout")
async def logout(
    token: str,
    refresh_token: Optional[str] = None,
    current_user: AdminUser = Depends(get_current_user)
):
    """
    Logout by revoking tokens
    """
    with DatabaseConnection() as cursor:
        # Revoke access token
        try:
            # Decode token to get expiration time
            payload = jwt.decode(
                token, 
                settings.SECRET_KEY, 
                algorithms=[settings.ALGORITHM],
                options={"verify_signature": True}
            )
            print("Decoded JWT payload (logout):", payload)
            exp_timestamp = payload.get("exp", 0)
            expires_at = datetime.fromtimestamp(exp_timestamp)
            
            # Store in revoked tokens table
            cursor.execute(
                """
                INSERT INTO revoked_tokens (token, user_id, expires_at)
                VALUES (%s, %s, %s)
                """,
                (token, current_user.id, expires_at)
            )
        except Exception as e:
            log_error(f"Error processing token revocation: {e}")
        
        # Also revoke refresh token if provided
        if refresh_token:
            try:
                payload = jwt.decode(
                    refresh_token, 
                    settings.SECRET_KEY, 
                    algorithms=[settings.ALGORITHM],
                    options={"verify_signature": True}
                )
                print("Decoded JWT payload (refresh logout):", payload)
                exp_timestamp = payload.get("exp", 0)
                expires_at = datetime.fromtimestamp(exp_timestamp)
                
                cursor.execute(
                    """
                    INSERT INTO revoked_tokens (token, user_id, expires_at)
                    VALUES (%s, %s, %s)
                    """,
                    (refresh_token, current_user.id, expires_at)
                )
            except Exception as e:
                log_error(f"Error processing refresh token revocation: {e}")
    
    return None