"use client"

import { useRef } from "react"
import "./index.css"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import Navbar from "./components/global/Navbar"
import Footer from "./components/global/footer"

import Home from "./pages/home"
import AboutUs from "./pages/AboutUs"
import PaintCategory from "./pages/PaintCategory"
import ContactPage from "./pages/ContactUs"
import TestimonialSlider from "./pages/Testo"
import NewsAndEventsMain from "./pages/News&Events/NewsandEventsMain"
import LocationPage from "./pages/FindStore"
import PopularProduct from "./pages/PopularProduct"
import ProductCatalog from "./pages/Products_List"

import Login from "./pages/Admin/Login"
import AdminLayout from "./pages/Admin/AdminLayout"
import Dashboard from "./pages/Admin/Dashboard"
import ContactManager from "./pages/Admin/ContactManager"
import NewsManager from "./pages/Admin/NewsManager"
import NewArrivalsManager from "./pages/Admin/NewArrivalsManager"
import PopularProductManager from "./pages/Admin/PopularProductManager"
import ProductsManager from "./pages/Admin/ProductsManager"
import AdminInstructions from "./pages/Admin/AdminInstructions"

const ProtectedRoute = ({ children }) => {
  const auth = JSON.parse(localStorage.getItem("adminAuth"))

  if (!auth || !auth.isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

function App() {
  const sectionRefs = {
    Home: useRef(null),
    "About Us": useRef(null),
    Products: useRef(null),
    "Our Products": useRef(null),
    Testimonials: useRef(null),
    "News and Events": useRef(null),
    "Contact Us": useRef(null),
    "Find Store": useRef(null),
  }

  const MainContent = () => (
    <main className="flex-grow">
      <div ref={sectionRefs.Home} id="home">
        <Home />
      </div>
      <div ref={sectionRefs["About Us"]} id="about">
        <AboutUs />
      </div>
      <div ref={sectionRefs.Products} id="products">
        <PaintCategory />
      </div>
      <div ref={sectionRefs["Our Products"]} id="our-products">
        <PopularProduct />
      </div>
      <div ref={sectionRefs.Testimonials} id="testimonials">
        <TestimonialSlider />
      </div>
      <div ref={sectionRefs["News and Events"]} id="news">
        <NewsAndEventsMain />
      </div>
      <div ref={sectionRefs["Contact Us"]} id="contact">
        <ContactPage />
      </div>
    </main>
  )

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/docs" element={< AdminInstructions/>} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contact"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ContactManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <NewsManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/new-arrivals"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <NewArrivalsManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/popular"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <PopularProductManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ProductsManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar sectionRefs={sectionRefs} />
              <MainContent />
              <Footer />
            </div>
          }
        />
        <Route
          path="/find-store"
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar sectionRefs={sectionRefs} />
              <LocationPage />
              <Footer />
            </div>
          }
        />
        <Route
          path="/products"
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar sectionRefs={sectionRefs} />
              <ProductCatalog />
              <Footer />
            </div>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App