"use client"

import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const scrolledRef = useRef(false)

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1))
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
        return
      }
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      })
      scrolledRef.current = true
    }

    scrolledRef.current = false

    if (!scrolledRef.current) {
      window.requestAnimationFrame(scrollToTop)
    }
  }, [pathname, hash])

  return null
}

export default ScrollToTop
