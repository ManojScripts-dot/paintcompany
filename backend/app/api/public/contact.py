# app/api/public/contact.py
from fastapi import APIRouter, HTTPException, status
from app.database import DatabaseConnection
from app.models.schemas import ContactSubmissionCreate, ContactSubmission, StaticContactInfo

router = APIRouter()

@router.post("/submit", response_model=ContactSubmission, status_code=status.HTTP_201_CREATED)
async def submit_contact_form(submission: ContactSubmissionCreate):
    """Submit a contact form"""
    with DatabaseConnection() as cursor:
        cursor.execute(
            """
            INSERT INTO contact_submissions 
            (full_name, email, message)
            VALUES (%s, %s, %s)
            RETURNING *
            """,
            (submission.full_name, submission.email, submission.message)
        )
        
        # Get the created submission
        row = cursor.fetchone()
        return dict(row) if row else None

@router.get("/info", response_model=StaticContactInfo)
async def get_contact_info():
    """Get static contact information (email, phone, address)"""
    with DatabaseConnection() as cursor:
        cursor.execute("SELECT * FROM static_contact_info WHERE id = 1")
        contact_info = cursor.fetchone()
        
        if not contact_info:
            # Return default contact info if none exists in database
            return {
                "id": 1,
                "email": "contact@paintwebsite.com",
                "phone": "+1 (555) 123-4567",
                "address": "123 Paint Street, Colorful City, CP 12345",
                "updated_at": None
            }
        
        # Convert psycopg2.extras.RealDictRow to dict to ensure proper field mapping
        contact_dict = dict(contact_info)
        return contact_dict