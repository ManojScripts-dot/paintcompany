"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"

export default function Navbar({ sectionRefs }) {
  const [activeItem, setActiveItem] = useState("Home")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { id: "Home", label: "Home", path: "/", section: "Home" },
    { id: "About Us", label: "About", path: "/", section: "About Us" },
    { id: "Products", label: "Products", path: "/products", section: null },
    { id: "News and Events", label: "News", path: "/", section: "News and Events" },
    { id: "Contact Us", label: "Contact", path: "/", section: "Contact Us" },
    { id: "Find Store", label: "Location", path: "/find-store", section: null },
  ]

  // Update active item based on current route
  useEffect(() => {
    const currentPath = location.pathname
    const activeMenuItem = menuItems.find(
      (item) => item.path === currentPath || (currentPath === "/" && item.id === "Home")
    )
    setActiveItem(activeMenuItem?.id || "Home")
  }, [location.pathname])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest("nav")) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMenuOpen])

  // Handle body overflow for mobile menu
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const handleClick = (item) => {
    setActiveItem(item.id)
    setIsMenuOpen(false)

    if (item.id === "Home") {
      // Special handling for Home: always navigate to / and scroll to top
      navigate("/")
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }, 100)
    } else if (item.path && item.path !== "/") {
      // Navigate to multi-page routes (Products, Find Store)
      navigate(item.path)
    } else if (item.path === "/" && item.section && sectionRefs[item.section]?.current) {
      // Scroll to section on homepage
      if (location.pathname !== "/") {
        navigate("/")
        setTimeout(() => {
          sectionRefs[item.section]?.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }, 100)
      } else {
        sectionRefs[item.section]?.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white"
      } border-b border-gray-100`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="group">
              <img
                src="/assets/logo.png"
                alt="Paint Company"
                className="h-8 w-auto transition-transform duration-200 group-hover:scale-105"
              />
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleClick(item)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeItem === item.id ? "text-red-500" : "text-gray-700 hover:text-red-500"
                } group`}
                aria-current={activeItem === item.id ? "page" : undefined}
              >
                {item.label}
                {activeItem === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full"></div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleMenu} />
            <div className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 z-50 lg:hidden">
              <div className="px-6 py-4 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleClick(item)}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeItem === item.id
                        ? "text-red-500 bg-red-50"
                        : "text-gray-700 hover:text-red-500 hover:bg-gray-50"
                    }`}
                    aria-current={activeItem === item.id ? "page" : undefined}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}