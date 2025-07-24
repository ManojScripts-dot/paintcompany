# app/auth/utils.py
from datetime import datetime, timedelta
from typing import Optional, Dict
from jose import jwt
from passlib.context import CryptContext
from app.config import settings
from app.database import DatabaseConnection
from app.models.schemas import AdminUserInDB

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate password hash"""
    return pwd_context.hash(password)

def create_access_token(data: Dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a new JWT access token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: Dict) -> str:
    """
    Create a new JWT refresh token with longer expiration
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)  # 7 days for refresh token
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_user(username: str) -> Optional[AdminUserInDB]:
    """
    Get user from database by username
    Returns AdminUserInDB object or None if not found
    """
    with DatabaseConnection() as cursor:
        cursor.execute(
            "SELECT id, username, email, password_hash FROM admin_users WHERE username = %s",
            (username,)
        )
        user_data = cursor.fetchone()
        
        if user_data:
            return AdminUserInDB(**dict(user_data))
    return None

def authenticate_user(username: str, password: str) -> Optional[AdminUserInDB]:
    """
    Authenticate a user with username and password
    Returns user object if authentication successful, otherwise None
    """
    user = get_user(username)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user

def update_last_login(user_id: int) -> None:
    """
    Update user's last login timestamp
    """
    with DatabaseConnection() as cursor:
        cursor.execute(
            "UPDATE admin_users SET last_login = %s WHERE id = %s",
            (datetime.utcnow(), user_id)
        )