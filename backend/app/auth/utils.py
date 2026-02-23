# app/auth/utils.py
from datetime import datetime, timedelta
from typing import Optional, Dict
from jose import jwt
from passlib.context import CryptContext
from app.config import settings
from app.database import DatabaseConnection
from app.models.schemas import AdminUserInDB

BCRYPT_MAX_BYTES = 72

# IMPORTANT:
# - "bcrypt" supports existing hashes in your DB.
# - "bcrypt_sha256" becomes the default for NEW hashes (safe for long passwords).
pwd_context = CryptContext(
    schemes=["bcrypt_sha256", "bcrypt"],
    deprecated="auto",
)


def _truncate_to_72_bytes(pw: str) -> str:
    """Truncate to 72 BYTES safely (utf-8) without splitting characters."""
    if pw is None:
        return ""
    pw = str(pw)

    b = pw.encode("utf-8")
    if len(b) <= BCRYPT_MAX_BYTES:
        return pw

    b = b[:BCRYPT_MAX_BYTES]
    while True:
        try:
            return b.decode("utf-8")
        except UnicodeDecodeError:
            b = b[:-1]
            if not b:
                return ""


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password against hash.

    Strategy:
    1) Try normal verify (works for normal length passwords + bcrypt_sha256 hashes)
    2) If bcrypt backend throws 72-byte error, retry with 72-byte truncation
       (matches bcrypt's real behavior: it uses only first 72 bytes anyway)
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except ValueError as e:
        # This is the Render crash you saw:
        # "password cannot be longer than 72 bytes"
        msg = str(e).lower()
        if "longer than 72" in msg or "72 bytes" in msg:
            safe_pw = _truncate_to_72_bytes(plain_password)
            return pwd_context.verify(safe_pw, hashed_password)
        raise


def get_password_hash(password: str) -> str:
    """
    Create password hash.

    Because bcrypt_sha256 is the first scheme, new hashes will be bcrypt_sha256,
    which never crashes due to length.
    """
    return pwd_context.hash(password)


def create_access_token(data: Dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: Dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def get_user(username: str) -> Optional[AdminUserInDB]:
    with DatabaseConnection() as cursor:
        cursor.execute(
            "SELECT id, username, email, password_hash FROM admin_users WHERE username = %s",
            (username,),
        )
        user_data = cursor.fetchone()
        if user_data:
            return AdminUserInDB(**dict(user_data))
    return None


def authenticate_user(username: str, password: str) -> Optional[AdminUserInDB]:
    user = get_user(username)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def update_last_login(user_id: int) -> None:
    with DatabaseConnection() as cursor:
        cursor.execute(
            "UPDATE admin_users SET last_login = %s WHERE id = %s",
            (datetime.utcnow(), user_id),
        )