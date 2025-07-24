"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import paint from "../assets/paintcategory/primer.png"
import { Star, Umbrella, Hammer, Leaf } from "lucide-react"
import photo from "../assets/Images.jpeg"

const PopularProduct = () => {
  const [featuredProduct, setFeaturedProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = "https://paintcompanybackend.onrender.com"

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return paint

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
            type: product.type || "Exterior / Interior",
            description: product.description || "High quality paint product",
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
          name: "Exterior Primer",
          type: "Primer",
          description: "Ultimate weather protection with a smooth, lasting finish.",
          features: ["Weather Resistance", "Durability", "Low VOC"],
          rating: 4.5,
          image: paint,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProduct()
  }, [])

  const getFeatureIcon = (feature) => {
    if (!feature) return <Star className="w-4 h-4" />

    const featureText = feature.toLowerCase()

    if (featureText.includes("weather") || featureText.includes("water"))
      return <Umbrella className="w-5 h-5 text-red-500" />
    if (featureText.includes("durab") || featureText.includes("strong"))
      return <Hammer className="w-5 h-5 text-red-500" />
    if (featureText.includes("voc") || featureText.includes("eco")) return <Leaf className="w-5 h-5 text-red-500" />

    return <Star className="w-4 h-4" />
  }

  const displayFeatured = featuredProduct || {
    name: "Exterior Primer",
    type: "Primer",
    description: "Ultimate weather protection with a smooth, lasting finish.",
    features: ["Weather Resistance", "Durability", "Low VOC"],
    rating: 4.5,
    image: paint,
  }

  const formatRating = (rating) => {
    const numRating = typeof rating === "number" ? rating : Number.parseFloat(rating) || 4.5
    return numRating.toFixed(1)
  }

  return (
    <div className="w-full min-h-screen md:h-screen relative bg-gray-50 overflow-hidden flex flex-col border-r-2">
      <div className="w-full px-4 py-6 md:py-8 text-center flex-shrink-0">
        <h2 className="text-xl md:text-2xl font-normal text-gray-500 mb-2 md:mb-4">Our #1 Customer Favourite</h2>

        <div className="flex flex-col md:flex-row items-center justify-center mb-4 md:mb-6">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl md:text-5xl font-bold text-purple-800 mb-1 md:mb-2">{displayFeatured.name}</h1>
            <p className="text-sm md:text-base text-gray-600">{displayFeatured.type}</p>
          </div>

          <div className="mt-4 md:mt-0 md:ml-8 md:border-l md:pl-8 h-16 md:h-24 flex items-center">
            <Star className="w-5 h-5 md:w-6 md:h-6 fill-orange-500 text-orange-500" />
            <span className="text-lg md:text-xl font-medium ml-2">{formatRating(displayFeatured.rating)}/5</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-10 mt-4 md:mt-8 px-2">
          {(displayFeatured.features || []).slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center justify-center">
                {index === 0 && <Umbrella className="w-5 h-5 md:w-6 md:h-6 text-red-500" />}
                {index === 1 && <Hammer className="w-5 h-5 md:w-6 md:h-6 text-red-500" />}
                {index === 2 && <Leaf className="w-5 h-5 md:w-6 md:h-6 text-red-500" />}
              </div>
              <span className="text-sm md:text-base font-medium text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-5 relative">
        <div className="md:col-span-3 h-64 sm:h-80 md:h-full overflow-hidden">
          <img
            src={photo || "/placeholder.svg"}
            alt="Room with painted walls"
            className="w-full h-full object-cover rounded-tr-[30px] md:rounded-tr-[30px] rounded-tl-0 rounded-bl-0 rounded-br-0 border-tr-4 border-r-4 border-l-0 border-b-0 border-purple-600"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            }}
          />
        </div>

        <div className="md:col-span-2 flex flex-col items-center justify-start p-4 md:p-20 h-full">
          <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 max-w-full max-h-full mb-2 md:mb-4 flex items-center justify-center">
            <img
              src={displayFeatured.image || paint}
              alt={displayFeatured.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = paint
              }}
            />
          </div>

          <p className="text-center text-lg md:text-xl font-medium text-gray-700 max-w-xs italic overflow-hidden text-ellipsis line-clamp-3">
            "{displayFeatured.description}"
          </p>
        </div>
      </div>
    </div>
  )
}

export default PopularProduct