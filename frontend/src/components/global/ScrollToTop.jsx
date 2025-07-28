"use client"

import { useState, useEffect } from "react"
import { FaArrowUp } from "react-icons/fa"

function ScrollToTop() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    let animationId

    const handleScroll = () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }

      animationId = requestAnimationFrame(() => {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight
        const currentScroll = window.scrollY
        
        // Show button when scrolled more than 100px
        setIsVisible(currentScroll > 100)
        
        if (totalScroll > 0) {
          const percentage = Math.min(Math.max((currentScroll / totalScroll) * 100, 0), 100)
          setScrollProgress(percentage)
        } else {
          setScrollProgress(0)
        }
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (scrollProgress / 100) * circumference

  const getProgressColor = (progress) => {
    if (progress <= 33) return "#22c55e"
    if (progress <= 66) return "#eab308"
    return "#ef4444"
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
      <div 
        className="relative h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] cursor-pointer group" 
        onClick={scrollToTop}
        role="button"
        tabIndex={0}
        aria-label="Scroll to top"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            scrollToTop()
          }
        }}
      >
        <svg 
          className="h-full w-full transform -rotate-90" 
          viewBox="0 0 100 100"
          style={{ willChange: 'auto' }}
        >
          {/* Background Circle */}
          <circle 
            cx="50" 
            cy="50" 
            r={radius} 
            fill="none" 
            stroke="#e5e7eb" 
            strokeWidth="8"
            opacity="0.3"
          />
          {/* Progress Circle - No CSS transitions, pure JavaScript animation */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={getProgressColor(scrollProgress)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            style={{
              willChange: 'stroke-dashoffset',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
          <FaArrowUp className="text-gray-800 text-base sm:text-xl group-hover:text-red-500 transition-colors duration-300" />
        </div>
      </div>
    </div>
  )
}

export default ScrollToTop