"use client"

import { useEffect, useRef } from "react"

function ScrollToTop() {
  const scrolledRef = useRef(false)

  useEffect(() => {
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
  }, [])

  return null
}

export default ScrollToTop
