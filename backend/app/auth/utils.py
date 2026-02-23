# app/auth/utils.py
from __future__ import annotations

from datetime import datetime, timedelta
from typing import Optional, Dict

from jose import jwt
from passlib.context import CryptContext

from app.config import settings
from app.database import DatabaseConnection
from app.models.schemas import AdminUserInDB

# ✅ Password hashing
# Use bcrypt_sha256 to safely support passwords longer than 72 bytes.
# Keep bcrypt in the list so existing bcrypt hashes still verify.
pwd_context = CryptContext(
    schemes=["bcrypt_sha256", "bcrypt"],
    deprecated="auto",
)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a stored hash (supports long passwords via bcrypt_sha256)."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate password hash (will use bcrypt_sha256 by default due to schemes order)."""
    return pwd_context.hash(password)


def create_access_token(data: Dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a new JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta
        if expires_delta is not None
        else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: Dict) -> str:
    """Create a new JWT refresh token with longer expiration."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)  # 7 days for refresh token
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def get_user(username: str) -> Optional[AdminUserInDB]:
    """
    Get user from database by username.
    Returns AdminUserInDB object or None if not found.
    """
    with DatabaseConnection() as cursor:
        cursor.execute(
            "SELECT id, username, email, password_hash FROM admin_users WHERE username = %s",
            (username,),
        )
        user_data = cursor.fetchone()

        if user_data:
            return AdminUserInDB(**dict(user_data))
    return None


def _update_password_hash_if_needed(user_id: int, plain_password: str, current_hash: str) -> None:
    """
    If the stored hash is using an older/weak scheme, upgrade it after a successful login.
    This helps migrate old 'bcrypt' hashes to 'bcrypt_sha256' automatically.
    """
    if not pwd_context.needs_update(current_hash):
        return

    new_hash = get_password_hash(plain_password)
    with DatabaseConnection() as cursor:
        cursor.execute(
            "UPDATE admin_users SET password_hash = %s WHERE id = %s",
            (new_hash, user_id),
        )


def authenticate_user(username: str, password: str) -> Optional[AdminUserInDB]:
    """
    Authenticate a user with username and password.
    Returns user object if authentication successful, otherwise None.
    """
    user = get_user(username)
    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    # ✅ Auto-migrate bcrypt -> bcrypt_sha256 (or other updates) on successful login
    try:
        _update_password_hash_if_needed(user.id, password, user.password_hash)
    except Exception:
        # Don't block login if migration fails; log it elsewhere if you want
        pass

    return user


def update_last_login(user_id: int) -> None:
    """Update user's last login timestamp."""
    with DatabaseConnection() as cursor:
        cursor.execute(
            "UPDATE admin_users SET last_login = %s WHERE id = %s",
            (datetime.utcnow(), user_id),
        )