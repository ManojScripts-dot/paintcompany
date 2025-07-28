"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import slider1 from "../assets/Home/Slider1.jpeg"
import slider2 from "../assets/Home/Slider2.jpeg"
import slider3 from "../assets/Home/Slider3.jpeg"
import slider4 from "../assets/Home/Slider4.jpeg"

const Home = () => {
  const carouselImages = [
    {
      src: slider1,
      alt: "Beautifully painted wall with vibrant colors",
    },
    {
      src: slider2,
      alt: "Interior with modern paint design",
    },
    {
      src: slider3,
      alt: "Exterior of a house with fresh paint",
    },
    {
      src: slider4,
      alt: "Colorful paint cans arranged artistically",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1))
    }, 4000)
    return () => clearInterval(interval)
  }, [carouselImages.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1))
  }

  const handleOrderNowClick = () => {
    // Scroll to the contact section using the ID from your App.jsx
    const contactSection = document.getElementById('contact');
    
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback: scroll to bottom of page
      window.scrollTo({ 
        top: document.documentElement.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 leading-tight">
                Transform Your
                <br />
                <span className="text-red-500 font-normal">Space With Colors</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 font-light max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Premium quality paints designed to bring your vision to life with exceptional durability and stunning
                finishes.
              </p>
            </div>

            <button
              onClick={handleOrderNowClick}
              className="bg-red-500 hover:bg-red-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Order Now
            </button>
          </div>

          {/* Image Carousel */}
          <div className="relative w-full">
            {/* Main Image Container */}
            <div className="relative h-80 sm:h-96 lg:h-[420px] xl:h-[480px] w-full rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={carouselImages[currentIndex].src}
                alt={carouselImages[currentIndex].alt}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out"
              />
            </div>

            {/* Dots Indicator - Fixed positioning and spacing */}
            <div className="flex justify-center mt-6 mb-2 gap-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-red-500 w-8" : "bg-gray-300 w-2"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home