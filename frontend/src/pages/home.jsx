"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Home = () => {
  const carouselImages = [
    {
      src: "/src/assets/Home/Slider1.jpeg",
      alt: "Modern living room with vibrant colors",
    },
    {
      src: "/src/assets/Home/Slider2.jpeg",
      alt: "Cozy bedroom with pastel tones",
    },
    {
      src: "/src/assets/Home/Slider3.jpeg",
      alt: "Decorated home with paintings",
    },
    {
      src: "/src/assets/Home/Slider4.jpeg",
      alt: "Paint cans and supplies",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1))
  }

  const handleOrderNowClick = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-light text-gray-900 leading-tight">
                Transform Your
                <br />
                <span className="text-red-500 font-normal">Space With Colors</span>
              </h1>
              <p className="text-xl text-gray-600 font-light max-w-lg mx-auto lg:mx-0">
                Premium quality paints designed to bring your vision to life with exceptional durability and stunning
                finishes.
              </p>
            </div>

            <button
              onClick={handleOrderNowClick}
              className="bg-red-500 hover:bg-red-600 text-white px-10 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Order Now
            </button>
          </div>

          {/* Image Carousel */}
          <div className="relative">
            <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={carouselImages[currentIndex].src || "/placeholder.svg"}
                alt={carouselImages[currentIndex].alt}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out"
              />

              {/* Navigation */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full transition-all duration-300"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full transition-all duration-300"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 gap-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-red-500 w-8" : "bg-gray-300"
                  }`}
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
