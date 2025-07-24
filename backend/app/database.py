# app/database.py
import time
import psycopg2
import psycopg2.extras
from typing import Dict, Any, List, Optional
from app.config import settings
from app.utils.logging import log_info, log_error

def get_connection():
    """
    Get a PostgreSQL connection.
    Returns a psycopg2 connection object.
    """
    try:
        connection = psycopg2.connect(
            settings.DATABASE_URL,
            cursor_factory=psycopg2.extras.RealDictCursor
        )
        return connection
    except psycopg2.Error as e:
        log_error(f"Error getting PostgreSQL connection: {e}", exc_info=True)
        raise

class DatabaseConnection:
    """
    Context manager for database operations.
    Provides connection handling, transaction handling, and proper error handling.
    
    Example usage:
    
    with DatabaseConnection() as cursor:
        cursor.execute("SELECT * FROM table")
        results = cursor.fetchall()
    """
    def __init__(self, transaction=True):
        self.transaction = transaction
        self.conn = None
        self.cursor = None
    
    def __enter__(self):
        try:
            self.conn = get_connection()
            self.cursor = self.conn.cursor()
            return self.cursor
        except Exception as e:
            log_error(f"Error in DatabaseConnection.__enter__: {e}", exc_info=True)
            if self.conn:
                self.conn.close()
            raise
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            if self.conn and exc_type and self.transaction:
                # If an exception occurred, rollback the transaction
                self.conn.rollback()
                log_error(f"Transaction rolled back due to: {exc_val}", exc_info=True)
            elif self.conn and self.transaction:
                # If no exception, commit the transaction
                try:
                    self.conn.commit()
                except Exception as e:
                    self.conn.rollback()
                    log_error(f"Failed to commit transaction: {e}", exc_info=True)
                    # Re-raise the exception
                    raise
        finally:
            # Always close cursor and connection
            if hasattr(self, 'cursor') and self.cursor:
                self.cursor.close()
            
            if hasattr(self, 'conn') and self.conn:
                self.conn.close()
            
        # Don't suppress exceptions
        return False

def execute_query(query, params=None, fetch_one=False, retry_count=3):
    """
    Helper function to execute a query and fetch results.
    Includes retry logic for transient database errors.
    
    Args:
        query (str): SQL query to execute
        params (tuple, optional): Parameters for the query
        fetch_one (bool, optional): Whether to fetch one or all results
        retry_count (int, optional): Number of retry attempts for transient errors
        
    Returns:
        Query results from cursor.fetchone() or cursor.fetchall()
    """
    attempt = 0
    last_error = None
    
    while attempt < retry_count:
        try:
            with DatabaseConnection() as cursor:
                cursor.execute(query, params or ())
                
                if fetch_one:
                    return cursor.fetchone()
                else:
                    return cursor.fetchall()
        except psycopg2.OperationalError as e:
            # Handle transient errors like connection issues
            attempt += 1
            last_error = e
            log_error(f"Database operational error (attempt {attempt}/{retry_count}): {e}")
            if attempt < retry_count:
                # Wait before retrying (exponential backoff)
                time.sleep(0.5 * attempt)
            else:
                raise
        except Exception as e:
            # For other errors, don't retry
            log_error(f"Database error: {e}", exc_info=True)
            raise
    
    # If we get here, all retries failed
    if last_error:
        raise last_error
    else:
        raise Exception("Database operation failed after all retries")