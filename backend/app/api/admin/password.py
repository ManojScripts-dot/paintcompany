# app/api/admin/password.py
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.auth.dependencies import get_current_admin
from app.auth.utils import get_password_hash
from app.models.schemas import AdminUser
from app.database import DatabaseConnection
from app.config import settings
from app.auth.utils import verify_password

router = APIRouter()

class PasswordResetRequest(BaseModel):
    old_password: str
    new_password: str

@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_admin_password(
    password_data: PasswordResetRequest,
    current_user: AdminUser = Depends(get_current_admin)
):
    """
    Reset admin password with verification of the old password.
    Requires the admin to be logged in and know their current password.
    """
    with DatabaseConnection() as cursor:
        # Get the current password hash
        cursor.execute(
            "SELECT password_hash FROM admin_users WHERE id = %s",
            (current_user.id,)
        )
        user_data = cursor.fetchone()
        
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Verify the old password using the utility function
        if not verify_password(password_data.old_password, user_data['password_hash']):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        
        # Generate new password hash using bcrypt
        new_password_hash = get_password_hash(password_data.new_password)
        
        # Update the password
        cursor.execute(
            """
            UPDATE admin_users
            SET password_hash = %s
            WHERE id = %s
            """,
            (new_password_hash, current_user.id)
        )
        
        return {"message": "Password updated successfully"}

# Emergency password reset for forgotten passwords
class AdminForgotPasswordRequest(BaseModel):
    admin_username: str
    new_password: str
    superadmin_key: str  # A pre-shared secure key for emergency resets

@router.post("/admin-reset", status_code=status.HTTP_200_OK)
async def admin_reset_password(reset_data: AdminForgotPasswordRequest):
    """
    Emergency password reset that can be used when an admin forgets their password.
    Requires a secure pre-shared key (superadmin_key) defined in environment variables.
    Does not require the admin to be logged in.
    """
    # Check if the provided superadmin key matches the configured key
    superadmin_key = settings.SUPERADMIN_RESET_KEY
    
    if reset_data.superadmin_key != superadmin_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid superadmin key"
        )
    
    with DatabaseConnection() as cursor:
        # Find the admin user by username
        cursor.execute(
            "SELECT id FROM admin_users WHERE username = %s",
            (reset_data.admin_username,)
        )
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Admin user not found"
            )
        
        # Generate new password hash using bcrypt
        new_password_hash = get_password_hash(reset_data.new_password)
        
        # Reset the password
        cursor.execute(
            """
            UPDATE admin_users
            SET password_hash = %s
            WHERE id = %s
            """,
            (new_password_hash, user['id'])
        )
        
        return {"message": f"Password for {reset_data.admin_username} has been reset successfully"}