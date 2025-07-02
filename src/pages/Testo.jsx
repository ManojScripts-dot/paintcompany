"use client"

import { useState, useEffect } from "react"
import rameshImage from "../assets/Testo/ramesh.jpeg"
import sunitaImage from "../assets/Testo/sunita.jpeg"
import dipeshImage from "../assets/Testo/dipesh.jpg"
import shyamImage from "../assets/Testo/shyam.png"
import sabinaImage from "../assets/Testo/sabina.jpg"

const testimonials = [
  {
    id: 1,
    name: "Ramesh Tamang",
    image: rameshImage,
    text: "Lubro Paints completely transformed our home! The colors are rich, long-lasting, and exactly what we imagined.",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Sunita Karki",
    image: sunitaImage,
    text: "We've been using Lubro Paints for our projects for years. Reliable quality, great coverage, and eco-friendly too!",
    rating: 4.0,
  },
  {
    id: 3,
    name: "Dipesh Shrestha",
    image: dipeshImage,
    text: "Loved the smooth finish and wide color selection. Lubro Paints made our house feel like a home.",
    rating: 5.0,
  },
  {
    id: 4,
    name: "Shyam Bahadur",
    image: shyamImage,
    text: "Professional service and top-notch products. My walls still look freshly painted even after months!",
    rating: 4.2,
  },
  {
    id: 5,
    name: "Sabina Rai",
    image: sabinaImage,
    text: "Affordable, durable, and beautiful—Lubro Paints delivered beyond our expectations.",
    rating: 4.8,
  },
]

export default function TestimonialSliderExact() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const getVisibleTestimonials = () => {
    const result = []
    const visibleCount = windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 3
    for (let i = 0; i < visibleCount; i++) {
      const index = (activeIndex + i) % testimonials.length
      result.push(testimonials[index])
    }
    return result
  }

  const visibleTestimonials = getVisibleTestimonials()

  const renderStars = (rating) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        )
      } else if (i < rating && rating % 1 !== 0) {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
            viewBox="0 0 24 24"
          >
            <defs>
              <linearGradient id={`half-fill-${i}`}>
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="50%" stopColor="#9ca3af" />
              </linearGradient>
            </defs>
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              fill={`url(#half-fill-${i})`}
            />
          </svg>
        )
      } else {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        )
      }
    }
    return stars
  }

  return (
    <div className="w-full border-solid border-black">
      <div className="bg-[#f5f5f5] py-14 sm:py-14">
        <div className="container mx-auto px-4">
          <div className="text-center mb-2 sm:mb-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2">What Our Client Says</h2>
            <div className="w-32 sm:w-48 h-0.5 bg-red-500 mx-auto"></div>
          </div>
        </div>
      </div>

      <div className="bg-[#f5f5f5] pb-14 sm:pb-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="bg-white p-6 rounded-lg shadow-md text-center animate-slideIn"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: "0.5s",
                }}
              >
                <div className="flex justify-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-sm sm:text-base text-gray-800 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex justify-center items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm sm:text-base font-medium text-gray-900">
                    {testimonial.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideIn {
          animation-name: slideIn;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  )
}