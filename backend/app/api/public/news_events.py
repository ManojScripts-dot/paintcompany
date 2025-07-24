# app/api/public/news_events.py
import math
from datetime import date
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.database import DatabaseConnection
from app.models.schemas import NewsEvent, NewsEventType, PaginatedResponse

router = APIRouter()

@router.get("/", response_model=PaginatedResponse)
async def get_news_events(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    type: Optional[NewsEventType] = None,
    highlighted: Optional[bool] = None,
    search: Optional[str] = None,
    current_only: bool = Query(True)
):
    with DatabaseConnection() as cursor:
        today = date.today()
        
        # Prepare query components
        query_conditions = []
        query_params = []
        
        # Add filter for current events only (no end date or end date >= today)
        if current_only:
            query_conditions.append("(end_date IS NULL OR end_date >= %s)")
            query_params.append(today)
        
        # Add filter for type
        if type:
            query_conditions.append("type = %s")
            query_params.append(type)
        
        # Add filter for highlighted
        if highlighted is not None:
            query_conditions.append("highlighted = %s")
            query_params.append(highlighted)
        
        # Add search condition
        if search:
            query_conditions.append("(title ILIKE %s OR content ILIKE %s)")
            search_term = f"%{search}%"
            query_params.extend([search_term, search_term])
        
        # Construct WHERE clause
        where_clause = ""
        if query_conditions:
            where_clause = "WHERE " + " AND ".join(query_conditions)
        
        # Count total matching records
        count_query = f"SELECT COUNT(*) as count FROM news_events {where_clause}"
        cursor.execute(count_query, tuple(query_params))
        total = cursor.fetchone()['count']
        
        # Get paginated data with highlighted items first
        data_query = f"""
            SELECT * FROM news_events 
            {where_clause}
            ORDER BY highlighted DESC, date DESC, created_at DESC
            LIMIT %s OFFSET %s
        """
        query_params.extend([limit, skip])
        cursor.execute(data_query, tuple(query_params))
        items = cursor.fetchall()
        
        # Convert psycopg2.extras.RealDictRow objects to dictionaries
        items = [dict(item) for item in items]
        
        # Calculate pagination info
        total_pages = math.ceil(total / limit) if total > 0 else 0
        current_page = skip // limit + 1 if total > 0 else 0
        
        return {
            "items": items,
            "total": total,
            "page": current_page,
            "size": limit,
            "pages": total_pages
        }

@router.get("/highlighted", response_model=List[NewsEvent])
async def get_highlighted_news_events(
    limit: int = Query(3, ge=1, le=10)
):
    """Get highlighted news and events that are currently active"""
    today = date.today()
    
    with DatabaseConnection() as cursor:
        cursor.execute(
            """
            SELECT * FROM news_events 
            WHERE highlighted = TRUE
            AND (end_date IS NULL OR end_date >= %s)
            ORDER BY date DESC
            LIMIT %s
            """,
            (today, limit)
        )
        items = cursor.fetchall()
        return [dict(item) for item in items]