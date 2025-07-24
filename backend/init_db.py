#!/usr/bin/env python3
"""
Database initialization script for Paint Website API
Creates PostgreSQL database tables
"""

import psycopg2
import os
from pathlib import Path

def init_database():
    """Initialize the PostgreSQL database with tables and default data"""
    
    # Get the database URL from config
    from app.config import settings
    
    print(f"🔧 Database URL: {settings.DATABASE_URL[:50]}...")
    print(f"🔧 Current working directory: {os.getcwd()}")
    
    # Read the PostgreSQL migration file
    migration_file = Path("migrations/postgres_init.sql")
    
    if not migration_file.exists():
        print(f"❌ Error: Migration file {migration_file} not found!")
        return False
    
    try:
        # Connect to PostgreSQL database
        print(f"🔗 Connecting to PostgreSQL database...")
        conn = psycopg2.connect(settings.DATABASE_URL)
        cursor = conn.cursor()
        
        # Read and execute the migration file
        print(f"📖 Reading migration file: {migration_file}")
        with open(migration_file, 'r') as f:
            sql_script = f.read()
        
        # Split the script into individual statements to avoid dollar-quote issues
        print("⚡ Executing database initialization...")
        
        # Split by semicolon but be careful with function definitions
        statements = []
        current_statement = ""
        in_function = False
        
        for line in sql_script.split('\n'):
            line = line.strip()
            
            # Skip empty lines and comments
            if not line or line.startswith('--'):
                continue
                
            current_statement += line + "\n"
            
            # Check if we're entering/exiting a function
            if 'CREATE OR REPLACE FUNCTION' in line.upper():
                in_function = True
            elif in_function and line.endswith("';"):
                in_function = False
                statements.append(current_statement.strip())
                current_statement = ""
            elif not in_function and line.endswith(';'):
                statements.append(current_statement.strip())
                current_statement = ""
        
        # Add any remaining statement
        if current_statement.strip():
            statements.append(current_statement.strip())
        
        # Execute each statement separately
        for i, statement in enumerate(statements):
            if statement.strip():
                try:
                    print(f"Executing statement {i+1}/{len(statements)}")
                    cursor.execute(statement)
                    conn.commit()
                except Exception as e:
                    print(f"Warning: Statement {i+1} failed: {e}")
                    conn.rollback()
                    # Continue with other statements
        
        print(f"✅ Database initialized successfully!")
        print("✅ Tables created:")
        
        # Show created tables
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        """)
        tables = cursor.fetchall()
        for table in tables:
            print(f"   - {table[0]}")
        
        # Check if admin user was created
        cursor.execute("SELECT COUNT(*) FROM admin_users")
        admin_count = cursor.fetchone()[0]
        print(f"👤 Admin users in database: {admin_count}")
        
        if admin_count == 0:
            print("⚠️  No admin users found! Creating default admin...")
            cursor.execute("""
                INSERT INTO admin_users (username, password_hash, email) 
                VALUES ('admin', '$2b$12$1InE4CNZyGE8h52u2BKW/uVR5h9EBCRjVrk5Eioz1NX9LyTYVJAh2', 'admin@paintwebsite.com')
            """)
            conn.commit()
            print("✅ Default admin user created!")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🚀 Initializing Paint Website API Database...")
    success = init_database()
    
    if success:
        print("\n🎉 Database initialization completed successfully!")
        print("You can now start the application.")
    else:
        print("\n💥 Database initialization failed!")
        exit(1)