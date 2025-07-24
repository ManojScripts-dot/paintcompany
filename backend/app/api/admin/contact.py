# app/api/admin/contact.py
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Body, status
from pydantic import EmailStr
from app.auth.dependencies import get_current_admin
from app.auth.router import AdminUser
from app.database import DatabaseConnection
from app.models.schemas import ContactSubmission, ContactSubmissionUpdate, StaticContactInfo, StaticContactInfoUpdate

router = APIRouter()

@router.get("/submissions", response_model=List[ContactSubmission])
async def get_contact_submissions(
    current_user: AdminUser = Depends(get_current_admin),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    read_status: Optional[bool] = None
):
    with DatabaseConnection() as cursor:
        # Build query based on filters
        query = "SELECT * FROM contact_submissions"
        params = []
        
        # Add filter conditions
        if read_status is not None:
            query += " WHERE read_status = %s"
            params.append(read_status)
        
        # Add ordering and pagination
        query += " ORDER BY submission_date DESC LIMIT %s OFFSET %s"
        params.extend([limit, skip])
        
        cursor.execute(query, tuple(params))
        items = cursor.fetchall()
        return [dict(item) for item in items]

@router.put("/submissions/{submission_id}", response_model=ContactSubmission)
async def update_contact_submission(
    submission_id: int,
    submission_update: ContactSubmissionUpdate,
    current_user: AdminUser = Depends(get_current_admin)
):
    with DatabaseConnection() as cursor:
        # Check if submission exists
        cursor.execute("SELECT * FROM contact_submissions WHERE id = %s", (submission_id,))
        existing_submission = cursor.fetchone()
        
        if not existing_submission:
            raise HTTPException(status_code=404, detail="Contact submission not found")
        
        # Update read status
        cursor.execute(
            "UPDATE contact_submissions SET read_status = %s WHERE id = %s RETURNING *",
            (submission_update.read_status, submission_id)
        )
        
        # Get the updated submission
        updated_submission = cursor.fetchone()
        return dict(updated_submission)

@router.delete("/submissions/{submission_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact_submission(
    submission_id: int,
    current_user: AdminUser = Depends(get_current_admin)
):
    with DatabaseConnection() as cursor:
        # Check if submission exists
        cursor.execute("SELECT id FROM contact_submissions WHERE id = %s", (submission_id,))
        submission = cursor.fetchone()
        
        if not submission:
            raise HTTPException(status_code=404, detail="Contact submission not found")
        
        # Delete submission
        cursor.execute("DELETE FROM contact_submissions WHERE id = %s", (submission_id,))
        
        return None

@router.get("/info", response_model=StaticContactInfo)
async def get_static_contact_info(
    current_user: AdminUser = Depends(get_current_admin)
):
    with DatabaseConnection() as cursor:
        cursor.execute("SELECT * FROM static_contact_info WHERE id = 1")
        contact_info = cursor.fetchone()
        
        if not contact_info:
            # Create default contact info if not exists
            default_info = {
                "email": "contact@paintwebsite.com",
                "phone": "+1 (555) 123-4567",
                "address": "123 Paint Street, Colorful City, CP 12345"
            }
            
            cursor.execute(
                "INSERT INTO static_contact_info (id, email, phone, address) VALUES (1, %s, %s, %s) RETURNING *",
                (default_info["email"], default_info["phone"], default_info["address"])
            )
            
            contact_info = cursor.fetchone()
            
        return dict(contact_info)

@router.put("/info", response_model=StaticContactInfo)
async def update_static_contact_info(
    contact_info: StaticContactInfoUpdate,
    current_user: AdminUser = Depends(get_current_admin)
):
    with DatabaseConnection() as cursor:
        # Check if contact info exists
        cursor.execute("SELECT * FROM static_contact_info WHERE id = 1")
        existing_info = cursor.fetchone()
        
        if existing_info:
            # Update existing info
            cursor.execute(
                "UPDATE static_contact_info SET email = %s, phone = %s, address = %s WHERE id = 1 RETURNING *",
                (contact_info.email, contact_info.phone, contact_info.address)
            )
        else:
            # Create new info
            cursor.execute(
                "INSERT INTO static_contact_info (id, email, phone, address) VALUES (1, %s, %s, %s) RETURNING *",
                (contact_info.email, contact_info.phone, contact_info.address)
            )
        
        # Get the updated info
        updated_info = cursor.fetchone()
        return dict(updated_info)