"use client"

import { useState, useEffect } from "react"
import { Star, Loader2, Package } from "lucide-react"
import axios from "axios"

export default function NewArrival() {
  const [arrival, setArrival] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = "https://paintcompanybackend.onrender.com"

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.svg?height=300&width=300&text=New+Product"
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl
    if (imageUrl.startsWith("/static/")) return `${API_BASE_URL}${imageUrl}`
    if (!imageUrl.includes("/")) return `${API_BASE_URL}/static/new_arrivals/${imageUrl}`
    return imageUrl
  }

  useEffect(() => {
    const fetchNewArrival = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${API_BASE_URL}/api/new-arrivals`, {
          params: { limit: 1 },
        })

        let productsList = []
        if (Array.isArray(response.data)) {
          productsList = response.data
        } else if (response.data.items && Array.isArray(response.data.items)) {
          productsList = response.data.items
        } else {
          throw new Error("Unexpected API response format")
        }

        if (productsList.length === 0) {
          throw new Error("No new arrivals found")
        }

        const formattedProducts = productsList.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description || "Discover our latest product innovation!",
          release_date: product.release_date,
          image: getImageUrl(product.image_url),
        }))

        setArrival(formattedProducts[0])
      } catch (error) {
        console.error("Error fetching new arrival:", error)
        setError(error.message || "Failed to load new arrival")
        setArrival({
          name: "New Product Launch",
          description: "Discover our latest product innovation!",
          release_date: new Date().toISOString(),
          image: "/placeholder.svg?height=300&width=300&text=New+Product",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchNewArrival()
  }, [])

  const displayArrival = arrival || {
    name: "New Product Launch",
    description: "Discover our latest product innovation!",
    release_date: new Date().toISOString(),
    image: "/placeholder.svg?height=400&width=400&text=New+Product",
  }

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          <span className="ml-3 text-gray-600 font-light">Loading new arrival...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-red-600 font-light">{error}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900">
              New <span className="text-red-500 font-normal">Arrival</span>
            </h2>
            <p className="text-lg text-gray-600 font-light">Check out our latest product innovation</p>
          </div>

          {/* Product Showcase */}
          <div className="bg-gradient-to-br from-red-50 to-white rounded-3xl p-8 lg:p-12 shadow-lg">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Product Image */}
              <div className="relative">
                <div className="absolute -top-4 -left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  <Star className="w-4 h-4 inline mr-1" />
                  New
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <img
                    src={displayArrival.image || "/placeholder.svg"}
                    alt={displayArrival.name || "New Arrival"}
                    className="w-full h-64 object-contain"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=300&width=300&text=New+Product"
                    }}
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl lg:text-3xl font-medium text-gray-900">
                    {displayArrival.name || "New Product"}
                  </h3>
                  <p className="text-lg text-gray-600 font-light leading-relaxed">{displayArrival.description}</p>
                </div>

                <div className="flex items-center gap-3 text-gray-500">
                  <Package className="w-5 h-5" />
                  <span className="font-light">
                    Released on{" "}
                    {new Date(displayArrival.release_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
