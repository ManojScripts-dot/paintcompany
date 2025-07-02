"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export default function Navbar({ sectionRefs }) {
  const [activeItem, setActiveItem] = useState("Home")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const menuItems = ["Home", "About Us", "Products", "Find Store", "News and Events", "Contact Us"]

  useEffect(() => {
    if (location.pathname === "/products") {
      setActiveItem("Products")
    } else if (location.pathname === "/find-store") {
      setActiveItem("Find Store")
    } else {
      setActiveItem("Home")
    }
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest("nav")) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.addEventListener("resize", handleResize)
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const handleClick = (item) => {
    setActiveItem(item)
    setIsMenuOpen(false)

    if (item === "Find Store") {
      navigate("/find-store")
    } else if (item === "Products") {
      navigate("/products")
    } else {
      if (location.pathname !== "/") {
        navigate("/")
        setTimeout(() => {
          sectionRefs[item]?.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }, 100)
      } else {
        sectionRefs[item]?.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
  }

  const toggleMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="border-b border-gray-100 mt-[20px] font-lora text-black relative z-30">
      <div className="max-w-7xl mx-auto px-0 sm:px-2 lg:px-4">
        <div className="relative py-1">
          <button
            className={`lg:hidden absolute right-1 top-1/2 -translate-y-1/2 p-1 focus:outline-none z-40 ${
              isMenuOpen ? "hidden" : "block"
            }`}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            type="button"
          >
            <svg
              className="w-6 h-6 text-gray-800 transition-transform duration-300 ease-in-out"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
                className="transition-opacity duration-300 ease-in-out"
              />
            </svg>
          </button>

          <div className={`hidden lg:flex justify-end pr-2 space-x-3 xl:space-x-6 ${isMenuOpen ? 'lg:relative lg:z-30' : ''}`}>
            {menuItems.map((item) => (
              <button
                key={item}
                className={`relative inline-flex items-center px-1 pt-0.5 pb-1.5 text-base xl:text-xl font-medium ${
                  activeItem === item ? "text-black" : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => handleClick(item)}
                type="button"
              >
                {item}
                {activeItem === item && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>}
              </button>
            ))}
          </div>

          {isMenuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 z-40" onClick={toggleMenu} aria-hidden="true" />
          )}

          <div
            className={`${
              isMenuOpen ? "flex fixed top-0 right-0 bg-white z-50 w-64 h-auto max-h-[80vh]" : "hidden"
            } lg:hidden flex-col pt-12 pb-4 px-3 transition-all duration-300 ease-in-out shadow-lg overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 p-1 focus:outline-none z-50"
              onClick={toggleMenu}
              aria-label="Close menu"
              type="button"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {menuItems.map((item, index) => (
              <button
                key={item}
                className={`relative w-full text-left py-3 text-lg font-medium ${
                  activeItem === item ? "text-black" : "text-gray-700 hover:text-gray-900"
                } ${index > 0 ? "border-t border-gray-100" : ""}`}
                onClick={() => handleClick(item)}
                type="button"
              >
                {item}
                {activeItem === item && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}