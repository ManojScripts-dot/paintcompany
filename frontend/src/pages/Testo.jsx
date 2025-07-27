"use client"

import { useState, useEffect } from "react"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Ramesh Tamang",
    image: "/placeholder.svg?height=80&width=80&text=RT",
    text: "Paint Company completely transformed our home! The colors are rich, long-lasting, and exactly what we imagined.",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Sunita Karki",
    image: "/placeholder.svg?height=80&width=80&text=SK",
    text: "We've been using Paint Company for our projects for years. Reliable quality, great coverage, and eco-friendly too!",
    rating: 4.0,
  },
  {
    id: 3,
    name: "Dipesh Shrestha",
    image: "/placeholder.svg?height=80&width=80&text=DS",
    text: "Loved the smooth finish and wide color selection. Paint Company made our house feel like a home.",
    rating: 5.0,
  },
  {
    id: 4,
    name: "Shyam Bahadur",
    image: "/placeholder.svg?height=80&width=80&text=SB",
    text: "Professional service and top-notch products. My walls still look freshly painted even after months!",
    rating: 4.2,
  },
  {
    id: 5,
    name: "Sabina Rai",
    image: "/placeholder.svg?height=80&width=80&text=SR",
    text: "Affordable, durable, and beautiful—Paint Company delivered beyond our expectations.",
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
        stars.push(<Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)
      } else if (i < rating && rating % 1 !== 0) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-current">
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
          </Star>,
        )
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300 fill-current" />)
      }
    }
    return stars
  }

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6">
            What Our <span className="text-red-500 font-normal">Client Says</span>
          </h2>
          <div className="w-24 h-1 bg-red-500 mx-auto"></div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {visibleTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="flex items-center mb-6">
                <Quote className="w-8 h-8 text-red-200 mr-4" />
                <div className="flex">{renderStars(testimonial.rating)}</div>
              </div>

              <p className="text-gray-700 font-light leading-relaxed mb-6 text-lg italic">"{testimonial.text}"</p>

              <div className="flex items-center">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">Verified Customer</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-12 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex ? "bg-red-500 w-8" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
