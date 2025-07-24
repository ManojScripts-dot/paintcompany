-- PostgreSQL database initialization for Paint Website API

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Popular products table
CREATE TABLE IF NOT EXISTS popular_products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,  -- Interior/Exterior
    description TEXT NOT NULL,
    features JSONB NULL,         -- Stored as JSONB array
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    image_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- New arrivals table
CREATE TABLE IF NOT EXISTS new_arrivals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255) NULL,
    release_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News and events table
CREATE TABLE IF NOT EXISTS news_events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('news', 'event')),
    content TEXT NOT NULL,
    date DATE NOT NULL,
    end_date DATE NULL,
    highlighted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_status BOOLEAN DEFAULT FALSE
);

-- Static contact info table
CREATE TABLE IF NOT EXISTS static_contact_info (
    id INTEGER PRIMARY KEY DEFAULT 1,  -- Always use ID 1
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    address TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table with all needed fields
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    features JSONB NULL,         -- Stored as JSONB array of features
    price1L VARCHAR(50),
    price4L VARCHAR(50),
    price5L VARCHAR(50),         -- Price for 5 Liters
    price10L VARCHAR(50),        -- Price for 10 Liters
    price20L VARCHAR(50),        -- Price for 20 Liters
    price500ml VARCHAR(50),      -- Price for 500ml
    price200ml VARCHAR(50),      -- Price for 200ml
    price1kg VARCHAR(50), 
    price500g VARCHAR(50),       -- Price for 500g
    price200g VARCHAR(50),       -- Price for 200g
    price100g VARCHAR(50),       -- Price for 100g
    price50g VARCHAR(50),        -- Price for 50g
    stock VARCHAR(50) DEFAULT 'In Stock',
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Revoked tokens table
CREATE TABLE IF NOT EXISTS revoked_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(512) NOT NULL,
    user_id INTEGER,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_popular_products_type ON popular_products(type);
CREATE INDEX IF NOT EXISTS idx_popular_products_rating ON popular_products(rating);
CREATE INDEX IF NOT EXISTS idx_new_arrivals_release_date ON new_arrivals(release_date);
CREATE INDEX IF NOT EXISTS idx_news_events_type ON news_events(type);
CREATE INDEX IF NOT EXISTS idx_news_events_date ON news_events(date);
CREATE INDEX IF NOT EXISTS idx_news_events_highlighted ON news_events(highlighted);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_revoked_tokens_token ON revoked_tokens(token);
CREATE INDEX IF NOT EXISTS idx_revoked_tokens_expires_at ON revoked_tokens(expires_at);

-- Create triggers to automatically update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_popular_products_updated_at BEFORE UPDATE ON popular_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_new_arrivals_updated_at BEFORE UPDATE ON new_arrivals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_events_updated_at BEFORE UPDATE ON news_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_static_contact_info_updated_at BEFORE UPDATE ON static_contact_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
