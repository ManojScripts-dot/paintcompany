# app/api/admin/news_events.py
from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, Form, HTTPException, Query, status
from app.auth.dependencies import get_current_admin
from app.auth.router import AdminUser
from app.database import DatabaseConnection
from app.models.schemas import NewsEvent, NewsEventCreate, NewsEventUpdate, NewsEventType
from app.utils.logging import log_info, log_error, log_warning

router = APIRouter()

@router.get("/", response_model=List[NewsEvent])
async def get_all_news_events(
    current_user: AdminUser = Depends(get_current_admin),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    type: Optional[NewsEventType] = None,
    highlighted: Optional[bool] = None
):
    log_info(f"Admin {current_user.username} requesting news events list")
    
    with DatabaseConnection() as cursor:
        # Build query based on filters
        query = "SELECT * FROM news_events"
        params = []
        
        # Add filter conditions
        filters = []
        if type:
            filters.append("type = %s")
            params.append(type)
        if highlighted is not None:
            filters.append("highlighted = %s")
            params.append(highlighted)
        
        if filters:
            query += " WHERE " + " AND ".join(filters)
        
        # Add ordering and pagination
        query += " ORDER BY date DESC, created_at DESC LIMIT %s OFFSET %s"
        params.extend([limit, skip])
        
        cursor.execute(query, tuple(params))
        items = cursor.fetchall()
        
        log_info(f"Retrieved {len(items)} news events for admin")
        return [dict(item) for item in items]

@router.post("/", response_model=NewsEvent, status_code=status.HTTP_201_CREATED)
async def create_news_event(
    title: str = Form(...),
    type: NewsEventType = Form(...),
    content: str = Form(...),
    date: date = Form(...),
    end_date: Optional[date] = Form(None),
    highlighted: bool = Form(False),
    current_user: AdminUser = Depends(get_current_admin)
):
    log_info(f"Admin {current_user.username} creating news event: {title}")
    
    # Validate dates if end_date is provided
    if end_date and end_date < date:
        raise HTTPException(status_code=400, detail="End date cannot be before start date")
    
    with DatabaseConnection() as cursor:
        cursor.execute(
            """
            INSERT INTO news_events 
            (title, type, content, date, end_date, highlighted)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING *
            """,
            (title, type, content, date, end_date, highlighted)
        )
        
        # Get the created news/event
        news_event = cursor.fetchone()
        
        log_info(f"Successfully created news event with ID: {news_event['id']}")
        return dict(news_event)

@router.put("/{news_event_id}", response_model=NewsEvent)
async def update_news_event(
    news_event_id: int,
    title: Optional[str] = Form(None),
    type: Optional[NewsEventType] = Form(None),
    content: Optional[str] = Form(None),
    date: Optional[date] = Form(None),
    end_date: Optional[date] = Form(None),
    highlighted: Optional[bool] = Form(None),
    current_user: AdminUser = Depends(get_current_admin)
):
    log_info(f"Admin {current_user.username} updating news event ID: {news_event_id}")
    
    # Check if news/event exists
    with DatabaseConnection() as cursor:
        cursor.execute("SELECT * FROM news_events WHERE id = %s", (news_event_id,))
        existing_news_event = cursor.fetchone()
        
        if not existing_news_event:
            log_warning(f"News event not found for update: ID {news_event_id}")
            raise HTTPException(status_code=404, detail="News/event not found")
        
        # Convert to dict for easier access
        existing_dict = dict(existing_news_event)
        
        # Validate dates if both are provided
        check_date = date if date is not None else existing_dict["date"]
        check_end_date = end_date if end_date is not None else existing_dict["end_date"]
        
        if check_end_date and check_date and check_end_date < check_date:
            raise HTTPException(status_code=400, detail="End date cannot be before start date")
        
        # Build update query dynamically based on provided fields
        update_fields = []
        params = []
        
        if title:
            update_fields.append("title = %s")
            params.append(title)
        if type:
            update_fields.append("type = %s")
            params.append(type)
        if content:
            update_fields.append("content = %s")
            params.append(content)
        if date:
            update_fields.append("date = %s")
            params.append(date)
        
        # Handle end_date differently as it could be None deliberately
        if end_date is not None:
            update_fields.append("end_date = %s")
            params.append(end_date)
        
        if highlighted is not None:
            update_fields.append("highlighted = %s")
            params.append(highlighted)
        
        if not update_fields:
            # No fields to update
            return existing_dict
        
        # Add news_event_id to params for WHERE clause
        params.append(news_event_id)
        
        # Execute update query
        cursor.execute(
            f"""
            UPDATE news_events 
            SET {', '.join(update_fields)}
            WHERE id = %s
            RETURNING *
            """,
            tuple(params)
        )
        
        # Get updated news/event
        updated_news_event = cursor.fetchone()
        
        log_info(f"Successfully updated news event ID: {news_event_id}")
        return dict(updated_news_event)

@router.delete("/{news_event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_news_event(
    news_event_id: int,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Delete a news event with enhanced error handling and logging"""
    log_info(f"Admin {current_user.username} attempting to delete news event ID: {news_event_id}")
    
    try:
        with DatabaseConnection() as cursor:
            # First, get the news event to check if it exists and get its details
            cursor.execute("SELECT * FROM news_events WHERE id = %s", (news_event_id,))
            news_event = cursor.fetchone()
            
            if not news_event:
                log_warning(f"News event not found for deletion: ID {news_event_id}")
                raise HTTPException(status_code=404, detail="News/event not found")
            
            # Convert to dict for easier access
            news_event_dict = dict(news_event)
            event_title = news_event_dict.get('title', 'Unknown')
            event_type = news_event_dict.get('type', 'unknown')
            log_info(f"Found news event for deletion: '{event_title}' ({event_type}) - ID: {news_event_id}")
            
            # Delete from database
            log_info(f"Executing database deletion for news event ID: {news_event_id}")
            
            # Use a transaction to ensure atomicity
            cursor.execute("BEGIN")
            
            try:
                # Execute the delete
                cursor.execute("DELETE FROM news_events WHERE id = %s", (news_event_id,))
                
                # Verify deletion by checking if the news event still exists
                cursor.execute("SELECT id FROM news_events WHERE id = %s", (news_event_id,))
                still_exists = cursor.fetchone()
                
                if still_exists:
                    cursor.execute("ROLLBACK")
                    log_error(f"News event still exists after deletion attempt: ID {news_event_id}")
                    raise HTTPException(
                        status_code=500, 
                        detail="Failed to delete news/event from database"
                    )
                
                # Commit the transaction
                cursor.execute("COMMIT")
                log_info(f"Successfully deleted news event from database: ID {news_event_id}")
                
                # Log the final result
                result_msg = f"News event '{event_title}' ({event_type}) - ID: {news_event_id} deleted successfully"
                log_info(result_msg)
                return None
                
            except Exception as db_error:
                cursor.execute("ROLLBACK")
                log_error(f"Database deletion failed for news event ID {news_event_id}: {db_error}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Database deletion failed: {str(db_error)}"
                )
                
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        log_error(f"Unexpected error during news event deletion: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, 
            detail=f"Unexpected error during deletion: {str(e)}"
        )

# Add a debug endpoint for checking news event deletion
@router.get("/debug/{news_event_id}", tags=["Debug"])
async def debug_news_event(
    news_event_id: int,
    current_user: AdminUser = Depends(get_current_admin)
):
    """Debug endpoint to check news event status"""
    debug_info = {
        "news_event_id": news_event_id,
        "database_status": {},
        "admin_user": current_user.username
    }
    
    # Check database
    try:
        with DatabaseConnection() as cursor:
            cursor.execute("SELECT * FROM news_events WHERE id = %s", (news_event_id,))
            news_event = cursor.fetchone()
            
            if news_event:
                news_event_dict = dict(news_event)
                debug_info["database_status"] = {
                    "exists": True,
                    "title": news_event_dict.get("title"),
                    "type": news_event_dict.get("type"),
                    "date": str(news_event_dict.get("date")),
                    "end_date": str(news_event_dict.get("end_date")) if news_event_dict.get("end_date") else None,
                    "highlighted": news_event_dict.get("highlighted"),
                    "created_at": str(news_event_dict.get("created_at"))
                }
            else:
                debug_info["database_status"] = {"exists": False}
                
    except Exception as e:
        debug_info["database_status"] = {"error": str(e)}
    
    return debug_info