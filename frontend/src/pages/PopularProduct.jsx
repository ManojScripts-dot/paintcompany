"use client"

import { useState, useEffect } from "react"
import { Star, Umbrella, Hammer, Leaf } from "lucide-react"
import axios from "axios"

const PopularProduct = () => {
  const [featuredProduct, setFeaturedProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = "https://paintcompanybackend.onrender.com"

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.svg?height=400&width=400&text=Featured+Product"

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl
    }

    if (imageUrl.startsWith("/static/")) {
      return `${API_BASE_URL}${imageUrl}`
    }

    if (!imageUrl.includes("/")) {
      return `${API_BASE_URL}/static/popular_products/${imageUrl}`
    }

    return imageUrl
  }

  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/popular-products/`)

        if (response.data) {
          let productsList = []

          if (Array.isArray(response.data)) {
            productsList = response.data
          } else if (response.data.items && Array.isArray(response.data.items)) {
            productsList = response.data.items
          } else {
            throw new Error("Unexpected API response format")
          }

          if (productsList.length === 0) {
            throw new Error("No products found")
          }

          const formattedProducts = productsList.map((product) => ({
            id: product.id,
            name: product.name,
            image: getImageUrl(product.image_url),
            type: product.type || "Premium Paint",
            description: product.description || "High quality paint product with exceptional performance",
            features: Array.isArray(product.features) ? product.features : [],
            rating: Number.parseFloat(product.rating) || 4.5,
          }))

          if (formattedProducts.length > 0) {
            const sortedProducts = [...formattedProducts].sort((a, b) => b.rating - a.rating)
            setFeaturedProduct(sortedProducts[0])
          }
        } else {
          throw new Error("Empty response from API")
        }
      } catch (err) {
        setError(err.message || "Failed to load products")

        setFeaturedProduct({
          name: "Premium Exterior Paint",
          type: "Exterior Paint",
          description: "Ultimate weather protection with a smooth, lasting finish that transforms any space.",
          features: ["Weather Resistance", "Durability", "Low VOC"],
          rating: 4.5,
          image: "/src/assets/paintcategory/primer.png",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProduct()
  }, [])

  const getFeatureIcon = (feature, index) => {
    if (!feature) return <Star className="w-5 h-5 text-red-500" />

    const featureText = feature.toLowerCase()

    if (featureText.includes("weather") || featureText.includes("water"))
      return <Umbrella className="w-5 h-5 text-red-500" />
    if (featureText.includes("durab") || featureText.includes("strong"))
      return <Hammer className="w-5 h-5 text-red-500" />
    if (featureText.includes("voc") || featureText.includes("eco")) return <Leaf className="w-5 h-5 text-red-500" />

    return <Star className="w-5 h-5 text-red-500" />
  }

  const displayFeatured = featuredProduct || {
    name: "Premium Exterior Paint",
    type: "Exterior Paint",
    description: "Ultimate weather protection with a smooth, lasting finish that transforms any space.",
    features: ["Weather Resistance", "Durability", "Low VOC"],
    rating: 4.5,
    image: "/placeholder.svg?height=400&width=400&text=Featured+Product",
  }

  const formatRating = (rating) => {
    const numRating = typeof rating === "number" ? rating : Number.parseFloat(rating) || 4.5
    return numRating.toFixed(1)
  }

  const renderStars = (rating) => {
    const stars = []
    const numRating = typeof rating === "number" ? rating : Number.parseFloat(rating) || 4.5

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} className={`w-5 h-5 ${i <= numRating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />,
      )
    }
    return stars
  }

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-6">
            <div className="w-4 h-4 bg-red-200 rounded animate-pulse"></div>
            <div className="h-4 bg-red-200 rounded animate-pulse w-28"></div>
          </div>
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-center gap-2">
              <div className="h-12 lg:h-16 bg-gray-200 rounded-lg animate-pulse w-32"></div>
              <div className="h-12 lg:h-16 bg-red-200 rounded-lg animate-pulse w-28"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-96 max-w-full mx-auto"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-80 max-w-full mx-auto"></div>
          </div>
        </div>

        {/* Product Showcase Skeleton */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Product Image Skeleton */}
            <div className="relative bg-gradient-to-br from-red-50 to-white p-12 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-red-200 rounded-full animate-pulse"></div>
                <div className="w-80 h-80 bg-gray-200 rounded-2xl animate-pulse"></div>
              </div>
            </div>

            {/* Product Details Skeleton */}
            <div className="p-12 flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                {/* Type and Name Skeleton */}
                <div className="space-y-2">
                  <div className="h-5 bg-red-200 rounded animate-pulse w-32"></div>
                  <div className="space-y-2">
                    <div className="h-8 lg:h-10 bg-gray-200 rounded animate-pulse w-4/5"></div>
                    <div className="h-8 lg:h-10 bg-gray-200 rounded animate-pulse w-3/5"></div>
                  </div>
                </div>

                {/* Description Skeleton */}
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-11/12"></div>
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-4/5"></div>
                </div>

                {/* Rating Skeleton */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-5 h-5 bg-yellow-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-12"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                </div>

                {/* Features Skeleton */}
                <div className="space-y-4">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-28"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-red-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  if (loading) {
    return <SkeletonLoader />
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            Customer Favorite
          </div>
          <h2 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6">
            Featured <span className="text-red-500 font-normal">Product</span>
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
            Discover our most popular paint solution, trusted by professionals and homeowners alike.
          </p>
        </div>

        {/* Product Showcase */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="relative bg-gradient-to-br from-red-50 to-white p-12 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-4 -right-4 bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  #{1}
                </div>
                <img
                  src={displayFeatured.image || "/placeholder.svg"}
                  alt={displayFeatured.name}
                  className="w-80 h-80 object-contain drop-shadow-2xl"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=400&width=400&text=Featured+Product"
                  }}
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="p-12 flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-red-500 font-medium text-lg">{displayFeatured.type}</p>
                  <h3 className="text-3xl lg:text-4xl font-light text-gray-900">{displayFeatured.name}</h3>
                </div>

                <p className="text-lg text-gray-600 font-light leading-relaxed">{displayFeatured.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">{renderStars(displayFeatured.rating)}</div>
                  <span className="text-2xl font-light text-gray-900">{formatRating(displayFeatured.rating)}/5</span>
                  <span className="text-gray-500 font-light">Customer Rating</span>
                </div>

                {/* Features */}
                {displayFeatured.features && displayFeatured.features.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Key Features</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {displayFeatured.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          {getFeatureIcon(feature, index)}
                          <span className="text-gray-700 font-light">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PopularProduct