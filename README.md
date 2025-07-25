# Paint Company Website

A full-stack web application for a paint company featuring a modern frontend with React and a robust backend API with FastAPI. The application includes product catalog management, news & events, contact forms, and a comprehensive admin panel.

## 🎨 Features

### Frontend (React + Vite)
- **Modern React Application** with Vite for fast development
- **Responsive Design** with Tailwind CSS
- **Product Catalog** with category-based filtering and search
- **Admin Panel** for content management
- **News & Events** section with dynamic content
- **Contact Forms** with real-time submission
- **Image Gallery** with carousel functionality
- **Customer Testimonials** slider
- **Mobile-First Design** with responsive navigation

### Backend (FastAPI + PostgreSQL)
- **FastAPI REST API** with automatic documentation
- **PostgreSQL Database** with Supabase integration
- **JWT Authentication** for admin users
- **File Upload Support** with Cloudinary integration
- **CORS Configuration** for frontend integration
- **Comprehensive Logging** and error handling
- **Rate Limiting** for API protection
- **Database Migrations** with PostgreSQL

### Admin Features
- **Product Management** - Add, edit, delete products with images
- **Popular Products** - Manage featured products
- **New Arrivals** - Showcase latest products
- **News & Events** - Create and manage announcements
- **Contact Management** - View and manage customer inquiries
- **User Authentication** - Secure admin login system
- **Password Reset** - Admin password management

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucid React** - Icon library
- **React Hot Toast** - Toast notifications

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Relational database
- **Supabase** - Database hosting and management
- **Cloudinary** - Image storage and optimization
- **JWT** - JSON Web Tokens for authentication
- **Pydantic** - Data validation and serialization
- **Uvicorn** - ASGI server
- **Psycopg2** - PostgreSQL adapter

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **PostgreSQL** database (or Supabase account)
- **Cloudinary** account (for image storage)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd paint-company-website
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### Install dependencies
```bash
pip install -r requirements.txt
```

#### Environment Configuration
Create a `.env` file in the backend directory:
```env
# Environment
ENV=development

# Database - PostgreSQL (Supabase)
DATABASE_URL=postgresql://username:password@host:port/database
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_HOST=your_postgres_host
POSTGRES_PORT=6543
POSTGRES_DB=postgres

# JWT Configuration
SECRET_KEY=your-super-secret-key-for-jwt
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Admin Configuration
SUPERADMIN_RESET_KEY=your-super-admin-key

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
USE_CLOUDINARY=true

# Logging
LOG_LEVEL=INFO
```

#### Initialize Database
```bash
python init_db.py
```

#### Start Backend Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### 3. Frontend Setup

#### Navigate to frontend directory
```bash
cd frontend
```

#### Install dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=https://paintcompanybackend.onrender.com
```

#### Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
paint-company-website/
├── backend/                              # FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                      # FastAPI application entry point
│   │   ├── config.py                    # Configuration settings
│   │   ├── database.py                  # Database connection and utilities
│   │   ├── api/                         # API routes
│   │   │   ├── __init__.py
│   │   │   ├── admin/                   # Admin-only endpoints
│   │   │   │   ├── __init__.py
│   │   │   │   ├── contact.py           # Contact management
│   │   │   │   ├── news_events.py       # News & events management
│   │   │   │   ├── new_arrivals.py      # New arrivals management
│   │   │   │   ├── password.py          # Password management
│   │   │   │   ├── popular_products.py  # Popular products management
│   │   │   │   └── products.py          # Products management
│   │   │   └── public/                  # Public endpoints
│   │   │       ├── __init__.py
│   │   │       ├── contact.py           # Contact form submission
│   │   │       ├── news_events.py       # Public news & events
│   │   │       ├── new_arrivals.py      # Public new arrivals
│   │   │       ├── popular_products.py  # Public popular products
│   │   │       └── products.py          # Public products catalog
│   │   ├── auth/                        # Authentication system
│   │   │   ├── __init__.py
│   │   │   ├── dependencies.py          # Auth dependencies
│   │   │   ├── router.py                # Auth routes
│   │   │   └── utils.py                 # Auth utilities
│   │   ├── models/                      # Database models and schemas
│   │   │   ├── __init__.py
│   │   │   └── schemas.py               # Pydantic models
│   │   └── utils/                       # Utility functions
│   │       ├── __init__.py
│   │       ├── cache.py                 # Caching utilities
│   │       ├── cloudinary_handler.py    # Cloudinary integration
│   │       ├── exceptions.py            # Custom exceptions
│   │       ├── image_handler.py         # Image processing
│   │       ├── logging.py               # Logging configuration
│   │       ├── rate_limit.py            # Rate limiting
│   │       └── validation.py            # Input validation
│   ├── migrations/                      # Database migrations
│   │   └── postgres_init.sql            # Initial database schema
│   ├── static/                          # Static files and uploads
│   │   └── uploads/                     # Image uploads directory
│   │       ├── popular_products/        # Popular product images
│   │       ├── new_arrivals/            # New arrival images
│   │       └── products/                # Product images
│   ├── .env                            # Environment variables
│   ├── .gitignore                      # Git ignore rules
│   ├── init_db.py                      # Database initialization script
│   └── requirements.txt                # Python dependencies
├── frontend/                           # React Frontend
│   ├── public/                         # Public static files
│   ├── src/
│   │   ├── assets/                     # Static assets (images, icons)
│   │   │   ├── AboutUs/               # About us page assets
│   │   │   ├── footer/                # Footer assets
│   │   │   ├── Home/                  # Home page assets
│   │   │   ├── Images.jpeg            # General images
│   │   │   ├── logo.png               # Company logo
│   │   │   ├── paintcategory/         # Paint category images
│   │   │   └── Testo/                 # Testimonial images
│   │   ├── components/                # Reusable components
│   │   │   ├── ConfirmModal.jsx       # Confirmation modal
│   │   │   ├── DeleteModal.jsx        # Delete confirmation modal
│   │   │   ├── SaveModal.jsx          # Save success modal
│   │   │   └── global/                # Global components
│   │   │       ├── Header.jsx         # Site header
│   │   │       ├── Navbar.jsx         # Navigation bar
│   │   │       ├── ScrollToTop.jsx    # Scroll to top utility
│   │   │       └── footer.jsx         # Site footer
│   │   ├── pages/                     # Page components
│   │   │   ├── Admin/                # Admin panel pages
│   │   │   │   ├── AdminInstructions.jsx  # Admin help page
│   │   │   │   ├── AdminLayout.jsx         # Admin layout wrapper
│   │   │   │   ├── ContactManager.jsx     # Contact management
│   │   │   │   ├── Dashboard.jsx           # Admin dashboard
│   │   │   │   ├── Login.jsx              # Admin login
│   │   │   │   ├── NewArrivalsManager.jsx # New arrivals management
│   │   │   │   ├── NewsManager.jsx        # News & events management
│   │   │   │   ├── PopularProductManager.jsx # Popular products management
│   │   │   │   └── ProductsManager.jsx    # Products management
│   │   │   ├── News&Events/          # News and events pages
│   │   │   │   ├── NewArrival.jsx    # New arrival component
│   │   │   │   ├── NewsandEventsMain.jsx # Main news page
│   │   │   │   └── NnE.jsx           # News & events list
│   │   │   ├── AboutUs.jsx           # About us page
│   │   │   ├── ContactUs.jsx         # Contact us page
│   │   │   ├── FindStore.jsx         # Store location page
│   │   │   ├── home.jsx              # Home page
│   │   │   ├── PaintCategory.jsx     # Paint categories
│   │   │   ├── PopularProduct.jsx    # Popular products showcase
│   │   │   ├── Products_List.jsx     # Product catalog
│   │   │   └── Testo.jsx             # Testimonials
│   │   ├── App.jsx                   # Main app component
│   │   ├── index.css                 # Global styles
│   │   └── main.jsx                  # React entry point
│   ├── .env                          # Environment variables
│   ├── .gitignore                    # Git ignore rules
│   ├── index.html                    # HTML template
│   ├── package.json                  # Node.js dependencies
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   └── vite.config.js                # Vite configuration
├── .gitignore                        # Root git ignore
└── README.md                         # Project documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/login` - Admin login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - Logout user

### Public API
- `GET /api/products` - Get products with filtering
- `GET /api/popular-products` - Get popular products
- `GET /api/new-arrivals` - Get new arrivals
- `GET /api/news-events` - Get news and events
- `GET /api/contact/info` - Get contact information
- `POST /api/contact/submit` - Submit contact form

### Admin API
- `GET /admin/products` - Manage products
- `GET /admin/popular-products` - Manage popular products
- `GET /admin/new-arrivals` - Manage new arrivals
- `GET /admin/news-events` - Manage news and events
- `GET /admin/contact` - Manage contact submissions
- `POST /admin/password/reset-password` - Reset password

### Health Checks
- `GET /health` - Basic health check
- `GET /health/db` - Database health check

## 🔐 Admin Access

### Default Credentials
- **Username**: `admin`
- **Password**: `admin123`

### Admin Features
1. **Dashboard** - Overview of system status
2. **Products Management** - Add, edit, delete products
3. **Popular Products** - Manage featured products
4. **New Arrivals** - Showcase latest products
5. **News & Events** - Content management
6. **Contact Management** - View customer inquiries
7. **Password Management** - Change admin password

## 🚀 Deployment

### Backend Deployment
The backend is currently deployed on **Render** at: `https://paintcompanybackend.onrender.com`

For deploying to any cloud platform that supports Python applications:

1. Set up your production environment variables
2. Install dependencies: `pip install -r requirements.txt`
3. Initialize the database: `python init_db.py`
4. Start the application: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

### Frontend Deployment (Vercel)
The frontend is currently deployed on **Vercel** at: `https://paintcompany.vercel.app/`

For deploying to any static hosting service:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service

## 🔍 Development

### Running Tests
```bash
# Backend tests (if implemented)
cd backend
python -m pytest

# Frontend tests (if implemented)
cd frontend
npm test
```

### Code Formatting
```bash
# Backend formatting
cd backend
black . --line-length 100

# Frontend formatting
cd frontend
npm run format
```

### API Documentation
Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify DATABASE_URL in `.env` file
   - Ensure PostgreSQL/Supabase is accessible
   - Check firewall settings

2. **Image Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits (5MB default)
   - Ensure proper file permissions

3. **CORS Issues**
   - Check CORS_ORIGINS in backend configuration
   - Verify frontend URL is included in allowed origins

4. **Authentication Problems**
   - Verify JWT SECRET_KEY is set
   - Check token expiration settings
   - Clear browser local storage

### Logging
- Backend logs are available in the console when running with `--reload`
- Check browser developer tools for frontend errors
- Use the `/health` endpoint to verify backend status

## 📝 License

This project is proprietary software developed for Paint Company.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- **Email**: stha8841@gmail.com

---

**Developed by MARSSL** - [shresthamanoj.info.np](https://shresthamanoj.info.np/)