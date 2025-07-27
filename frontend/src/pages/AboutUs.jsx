"use client"

import { useEffect, useState, useRef } from "react"
import { Award, Users, Briefcase } from "lucide-react"

export default function AboutUs() {
  const [startCount, setStartCount] = useState(false)
  const [showFullText, setShowFullText] = useState(false)
  const experienceRef = useRef(null)
  const hasCountedRef = useRef(false)
  const [counts, setCounts] = useState({ years: 0, customers: 0, projects: 0 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasCountedRef.current) {
          startCounting()
          hasCountedRef.current = true
        }
      },
      { threshold: 0.5 },
    )

    if (experienceRef.current) {
      observer.observe(experienceRef.current)
    }

    return () => {
      if (experienceRef.current) {
        observer.unobserve(experienceRef.current)
      }
    }
  }, [])

  const startCounting = () => {
    const targets = { years: 7, customers: 100, projects: 300 }
    const duration = 2000
    const updateInterval = 16

    let start = 0
    const increment = 1 / (duration / updateInterval)

    const timer = setInterval(() => {
      start += increment
      if (start >= 1) {
        setCounts({ years: targets.years, customers: targets.customers, projects: targets.projects })
        clearInterval(timer)
      } else {
        setCounts({
          years: Math.floor(targets.years * start),
          customers: Math.floor(targets.customers * start),
          projects: Math.floor(targets.projects * start),
        })
      }
    }, updateInterval)

    return () => clearInterval(timer)
  }

  const paragraph = `Based in Itahari, Sunsari, Paint Company has been a trusted name in Nepal's paint industry for over 7 years, offering durable and eco-friendly paint solutions for homes, businesses, and industries. With a focus on innovation, sustainability, and customer satisfaction, we provide vibrant colors and quality finishes that protect and enhance every space. Backed by a strong local presence and a growing distribution network, Paint Company is committed to helping you transform your world with color and confidence.`

  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/src/assets/AboutUs/brush.jpeg"
                alt="Paint brush"
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h2 className="text-2xl lg:text-3xl font-light mb-2">
                    <span className="text-red-400">"Paint Company:</span>
                    <br />
                    <span className="text-white">Bringing Your World to Life with Color"</span>
                  </h2>
                </div>
              </div>
            </div>

            {/* Floating ISO Badge */}
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">ISO Certified</div>
                  <div className="text-sm text-gray-600">Quality Assured</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-6xl font-light text-gray-900">
                About Our <span className="text-red-500 font-normal">Company</span>
              </h2>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                {showFullText ? paragraph : `${paragraph.slice(0, 320)}...`}
              </p>
              <button
                onClick={() => setShowFullText(!showFullText)}
                className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200"
              >
                {showFullText ? "See Less" : "See More"}
              </button>
            </div>

            {/* Stats */}
            <div ref={experienceRef} className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 mx-auto">
                  <Award className="w-8 h-8 text-red-500" />
                </div>
                <div className="text-3xl font-light text-gray-900 mb-2">{counts.years}+</div>
                <div className="text-sm text-gray-600 font-medium">Years</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 mx-auto">
                  <Users className="w-8 h-8 text-red-500" />
                </div>
                <div className="text-3xl font-light text-gray-900 mb-2">{counts.customers}+</div>
                <div className="text-sm text-gray-600 font-medium">Customers</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 mx-auto">
                  <Briefcase className="w-8 h-8 text-red-500" />
                </div>
                <div className="text-3xl font-light text-gray-900 mb-2">{counts.projects}+</div>
                <div className="text-sm text-gray-600 font-medium">Projects</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
