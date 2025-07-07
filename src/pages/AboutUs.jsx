"use client"

import { useEffect, useState, useRef } from "react"
import brush from "../assets/AboutUs/brush.jpeg"
import icon from "../assets/AboutUs/icon.png"

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
    const duration = 1000 
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
          projects: Math.floor(targets.projects * start)
        })
      }
    }, updateInterval)

    return () => clearInterval(timer)
  }

  const paragraph = `Based in Itahari, Sunsari, Paint Company has been a trusted name in Nepal's paint industry for over 7 years, offering durable and eco-friendly paint solutions for homes, businesses, and industries. With a focus on innovation, sustainability, and customer satisfaction, we provide vibrant colors and quality finishes that protect and enhance every space. Backed by a strong local presence and a growing distribution network, Paint Company is committed to helping you transform your world with color and confidence.`

  return (
    <div className="relative h-[90%] w-full overflow-hidden">


      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          <div className="col-span-1 md:col-span-1 lg:col-span-2 w-full">
            <div className="relative rounded-3xl overflow-hidden h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px]">
              <img
                src={brush || "/placeholder.svg"}
                alt="Paint brush"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 flex items-center p-4 sm:p-6 md:p-8">
                <div className="text-left">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    <span className="text-popRed">" Paint Company:</span> <br />
                    <span className="text-white">
                      &nbsp;&nbsp;Bringing <br />
                      &nbsp;&nbsp;Your World to Life with Color"
                    </span>
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-popPurple/70 h-auto w-full mt-4 md:mt-0 rounded-3xl p-5 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6">
              About Our <span className="text-white decoration-popRed underline underline-offset-8">Company</span>
            </h2>
            <p className="text-white text-left text-xs sm:text-sm md:text-base transition-all duration-300">
              {showFullText ? (
                paragraph
              ) : (
                <>
                  {paragraph.slice(0, 320)}...
                </>
              )}
            </p>
            <div className="mt-4 sm:mt-6 md:mt-8 flex justify-center md:justify-end">
              <button
                onClick={() => setShowFullText(!showFullText)}
                className="bg-red-700 hover:bg-red-500 text-white font-medium py-1 px-3 sm:py-1.5 sm:px-4 rounded-full text-xs sm:text-sm transition-colors duration-200"
              >
                {showFullText ? "See Less" : "See More"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-4 sm:mt-6">
          <div
            className="sm:col-span-1 rounded-3xl p-4 flex items-center justify-center md:justify-start 
                      relative bg-popPurple/70 bg-cover bg-center h-[100px] sm:h-[120px] md:h-[140px] lg:h-[160px]"
          >
            <img
              src={icon || "/placeholder.svg"}
              alt="24-Hours Delivery"
              className="h-20 w-20 sm:h-12 sm:w-12 md:h-20 md:w-20 lg:h-20 lg:w-20 object-contain"
            />
            <div className="text-white ml-3 sm:ml-4">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold">ISO </h3>
              <p className="text-lg sm:text-xl md:text-2xl font-bold">Certified</p>
            </div>
          </div>

          <div
            ref={experienceRef}
            className="sm:col-span-1 md:col-span-3 bg-popPurple/70 rounded-3xl p-3 sm:p-4 md:p-5 
                      w-full h-auto sm:h-[120px] md:h-[140px] lg:h-[160px]"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black text-center mb-3 sm:mb-4">
              Our <span className="decoration-popRed underline underline-offset-8">Experiences</span>
            </h2>
            <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4">
              <div className="flex flex-col items-center">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {counts.years}+
                </h3>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg mt-0.5 sm:mt-1 text-black font-bold">Years</p>
              </div>
              <div className="flex flex-col items-center text-white">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {counts.customers}+
                </h3>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg mt-0.5 sm:mt-1 text-black font-bold">Customers</p>
              </div>
              <div className="flex flex-col items-center text-white">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {counts.projects}+
                </h3>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg mt-0.5 sm:mt-1 text-black font-bold">
                  Projects
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}