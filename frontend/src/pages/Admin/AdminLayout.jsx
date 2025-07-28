"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { Home, Mail, Newspaper, Package, Star, LogOut, Menu, X, Bell } from "lucide-react"
import logo from "../../assets/logo.png"

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("adminAuth"))
    if (!auth || !auth.isAuthenticated) {
      navigate("/admin/login")
    }
  }, [navigate])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && window.innerWidth < 1024) {
        const sidebar = document.getElementById("sidebar")
        if (
          sidebar &&
          !sidebar.contains(event.target) &&
          !event.target.closest('button[aria-label="Toggle sidebar"]')
        ) {
          setIsSidebarOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSidebarOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    navigate("/admin/login")
  }

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/admin/products", label: "Products", icon: <Package size={20} /> },
    { path: "/admin/popular", label: "Popular Products", icon: <Star size={20} /> },
    { path: "/admin/new-arrivals", label: "New Arrivals", icon: <Package size={20} /> },
    { path: "/admin/news", label: "News & Events", icon: <Newspaper size={20} /> },
    { path: "/admin/contact", label: "Contact Us", icon: <Mail size={20} /> },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        id="sidebar"
        className={`bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 lg:static lg:inset-auto`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Link to="/admin/dashboard" className="flex items-center">
              <img src={logo} alt="Logo" className="h-16 w-16" />
              <span className="ml-3 font-bold text-lg text-gray-900">Admin Panel</span>
            </Link>         
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  isActive(item.path)
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              <span className="ml-3 font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-600 hover:text-gray-900 lg:hidden"
                aria-label="Toggle sidebar"
              >
                <Menu size={24} />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900 hidden sm:block">Paint Company Admin</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  className="flex items-center text-gray-700 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-medium">
                    A
                  </div>
                  <span className="ml-2 hidden md:block font-medium">Admin</span>
                </button>

                {isMobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
