# app/api/public/new_arrivals.py
import math
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.database import DatabaseConnection
from app.models.schemas import NewArrival, PaginatedResponse

router = APIRouter()

@router.get("/", response_model=PaginatedResponse)
async def get_new_arrivals(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None
):
    with DatabaseConnection() as cursor:
        # Prepare query components
        query_conditions = []
        query_params = []
        
        # Add search condition if provided
        if search:
            query_conditions.append("(name ILIKE %s OR description ILIKE %s)")
            search_term = f"%{search}%"
            query_params.extend([search_term, search_term])
        
        # Construct WHERE clause if needed
        where_clause = ""
        if query_conditions:
            where_clause = "WHERE " + " AND ".join(query_conditions)
        
        # Count total matching records
        count_query = f"SELECT COUNT(*) as count FROM new_arrivals {where_clause}"
        cursor.execute(count_query, tuple(query_params))
        total = cursor.fetchone()['count']
        
        # Get paginated data
        data_query = f"""
            SELECT * FROM new_arrivals 
            {where_clause}
            ORDER BY release_date DESC, created_at DESC
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

@router.get("/featured", response_model=NewArrival)
async def get_featured_new_arrival():
    """Get the most recent new arrival as the featured item"""
    with DatabaseConnection() as cursor:
        cursor.execute(
            """
            SELECT * FROM new_arrivals 
            WHERE image_url IS NOT NULL
            ORDER BY release_date DESC, created_at DESC 
            LIMIT 1
            """
        )
        arrival = cursor.fetchone()
        
        if not arrival:
            raise HTTPException(status_code=404, detail="No featured new arrival found")
            
        return dict(arrival)