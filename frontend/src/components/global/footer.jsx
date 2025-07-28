"use client"

import { useState, useEffect } from "react"
import { ArrowUp, Facebook, MessageCircle} from "lucide-react"
import { SiTiktok } from "react-icons/si";
import logo from "../../assets/logo.png"

const Footer = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNavigation = (section) => {
    // Check if we're on the main page (home page)
    if (window.location.pathname === '/') {
      // Navigate to section on the same page
      if (section === 'home') {
        // For home section, scroll to top but leave space for navbar
        window.scrollTo({ 
          top: 0, 
          behavior: "smooth" 
        })
      } else {
        const element = document.getElementById(section)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    } else {
      // Navigate to home page with hash
      if (section === 'home') {
        window.location.href = '/'
      } else {
        window.location.href = `/#${section}`
      }
    }
  }

  const handlePageNavigation = (path) => {
    window.location.href = path
  }

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      const currentScroll = window.scrollY
      if (totalScroll) {
        const percentage = (currentScroll / totalScroll) * 100
        setScrollProgress(percentage)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const radius = 20
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (scrollProgress / 100) * circumference

  const getProgressColor = (progress) => {
    if (progress <= 33) return "#22c55e"
    if (progress <= 66) return "#eab308"
    return "#ef4444"
  }

  return (
    <>
      {/* Scroll to Top Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative h-12 w-12 cursor-pointer group" onClick={scrollToTop}>
          <svg className="h-full w-full transform -rotate-90" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="3" />
            <circle
              cx="25"
              cy="25"
              r={radius}
              fill="none"
              stroke={getProgressColor(scrollProgress)}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
            <ArrowUp className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition-colors duration-300" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-600 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div>
                <img
                  src={logo}
                  alt="Paint Company Logo"
                  className="h-28 w-auto mb-4"
                />
                <p className="text-gray-300 font-light leading-relaxed">
                  Transforming spaces with premium quality paints and exceptional service for over 7 years.
                </p>
              </div>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/+9779800000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors duration-300"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a
                  href="https://www.tiktok.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors duration-300"
                  aria-label="TikTok"
                >
                  <SiTiktok className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-white">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { id: "home", label: "Home", type: "section" },
                  { id: "about", label: "About Us", type: "section" },
                  { id: "news", label: "News & Events", type: "section" },
                  { id: "contact", label: "Contact Us", type: "section" },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigation(item.id)}
                      className="text-gray-300 hover:text-white font-light transition-all duration-200 hover:translate-x-1 transform cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-white">Products</h3>
              <ul className="space-y-3">
                {[
                  { id: "products", label: "Paint Categories", type: "section" },
                  { path: "/products", label: "Product Catalog", type: "page" },
                  { path: "/find-store", label: "Find Our Store", type: "page" },
                ].map((item, index) => (
                  <li key={item.id || index}>
                    <button
                      onClick={() => item.type === "section" ? handleNavigation(item.id) : handlePageNavigation(item.path)}
                      className="text-gray-300 hover:text-white font-light transition-all duration-200 hover:translate-x-1 transform cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-white">Contact Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-300 font-light">Corporate Office:</p>
                  <p className="text-white">Itahari, Sunsari, Nepal</p>
                </div>
                <div>
                  <p className="text-gray-300 font-light">Phone:</p>
                  <a href="tel:+9779800000000" className="text-white hover:text-red-400 transition-colors duration-200">
                    +977 9800000000
                  </a>
                </div>
                <div>
                  <p className="text-gray-300 font-light">Email:</p>
                  <a
                    href="mailto:paintcompany@gmail.com"
                    className="text-white hover:text-red-400 transition-colors duration-200"
                  >
                    paintcompany@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 font-light text-sm">© 2025 Paint Company. All rights reserved.</p>
              <p className="text-gray-400 font-light text-sm">
                Designed by{" "}
                <span className="text-red-400">
                  MARSSL
                </span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer