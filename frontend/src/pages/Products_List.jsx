"use client"

import { useState, useEffect, useCallback, memo, useRef } from "react"
import PropTypes from "prop-types"
import axios from "axios"
import { Search, Filter, SlidersHorizontal, X, Layers, ChevronDown, Loader2 } from "lucide-react"

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [hasIntersected, options])

  return [ref, isIntersecting, hasIntersected]
}

const ProductCard = memo(({ product, categoryName, index = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [cardRef, isIntersecting, hasIntersected] = useIntersectionObserver()

  // Show all prices in 2-column grid - no limiting
  const priceEntries = Object.entries(product.prices).filter(([size, price]) => price)

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full transform transition-all duration-700 ease-out ${
        hasIntersected ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
      } hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="aspect-square overflow-hidden bg-gray-50 relative group">
        {/* Loading state */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        )}

        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className={`h-full w-full object-cover object-center transition-all duration-700 ease-out transform ${
            imageLoaded && !imageError ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-110 blur-sm"
          } group-hover:scale-110`}
          loading="lazy"
          onLoad={() => {
            setTimeout(() => setImageLoaded(true), 100)
          }}
          onError={(e) => {
            setImageError(true)
            setImageLoaded(true)
            e.currentTarget.src = "/placeholder.svg"
            e.currentTarget.onerror = null
          }}
        />

        {/* Category Badge */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
          {categoryName}
        </div>
      </div>

      <div className="p-4 sm:p-6 flex-1 flex flex-col space-y-3 sm:space-y-4">
        <div className="space-y-1 sm:space-y-2">
          <h3 className="font-medium text-sm sm:text-lg text-gray-900 line-clamp-2">{product.name}</h3>

          {product.features && product.features.length > 0 && (
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
              <span className="font-medium">Features:</span> {product.features.join(", ")}
            </p>
          )}
        </div>

        <div className="mt-auto space-y-2 sm:space-y-3">
          <h4 className="text-xs sm:text-sm font-medium text-gray-900">Sizes & Prices:</h4>
          
          {priceEntries.length > 0 ? (
            <div className="space-y-1">
              {priceEntries.length >= 5 ? (
                // For 5+ prices: First row 3 items, second row remaining items
                <>
                  <div className="grid grid-cols-3 gap-1 sm:gap-2">
                    {priceEntries.slice(0, 3).map(([size, price]) => (
                      <div
                        key={size}
                        className="bg-gray-50 hover:bg-red-50 px-1 sm:px-1.5 py-1.5 sm:py-2 rounded-lg text-xs transition-colors cursor-pointer border border-gray-100 hover:border-red-200"
                      >
                        <div className="font-medium text-gray-700 truncate text-xs">{size.toUpperCase()}</div>
                        <div className="text-red-600 font-semibold truncate text-xs">{price}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1 sm:gap-2">
                    {priceEntries.slice(3).map(([size, price]) => (
                      <div
                        key={size}
                        className="bg-gray-50 hover:bg-red-50 px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-lg text-xs transition-colors cursor-pointer border border-gray-100 hover:border-red-200"
                      >
                        <div className="font-medium text-gray-700 truncate text-xs">{size.toUpperCase()}</div>
                        <div className="text-red-600 font-semibold truncate text-xs">{price}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                // For 4 or fewer prices: Standard 2-column grid
                <div className="grid grid-cols-2 gap-1 sm:gap-2">
                  {priceEntries.map(([size, price]) => (
                    <div
                      key={size}
                      className="bg-gray-50 hover:bg-red-50 px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-lg text-xs transition-colors cursor-pointer border border-gray-100 hover:border-red-200"
                    >
                      <div className="font-medium text-gray-700 truncate text-xs">{size.toUpperCase()}</div>
                      <div className="text-red-600 font-semibold truncate text-xs">{price}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 px-2 sm:px-3 py-2 rounded-lg text-center border border-gray-100">
              <span className="text-gray-500 text-xs sm:text-sm">Contact for pricing</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
    prices: PropTypes.objectOf(PropTypes.string).isRequired,
  }).isRequired,
  categoryName: PropTypes.string.isRequired,
  index: PropTypes.number,
}

const ProductCardSkeleton = memo(({ index = 0 }) => (
  <div
    className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full animate-pulse"
    style={{
      animationDelay: `${index * 100}ms`,
    }}
  >
    <div className="aspect-square bg-gray-200"></div>
    <div className="p-4 sm:p-6 flex-1 flex flex-col space-y-3 sm:space-y-4">
      <div className="space-y-1 sm:space-y-2">
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="mt-auto space-y-2 sm:space-y-3">
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="grid grid-cols-2 gap-1 sm:gap-2">
          <div className="h-10 sm:h-12 bg-gray-200 rounded"></div>
          <div className="h-10 sm:h-12 bg-gray-200 rounded"></div>
          <div className="h-10 sm:h-12 bg-gray-200 rounded"></div>
          <div className="h-10 sm:h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
))

ProductCardSkeleton.propTypes = {
  index: PropTypes.number,
}

export default function ProductCatalog() {
  const [allCategories, setAllCategories] = useState([])
  const [filteredCategories, setFilteredCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [visibleProducts, setVisibleProducts] = useState({})
  const [hasMore, setHasMore] = useState({})
  const [isLoadingMore, setIsLoadingMore] = useState({})
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("newest")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const API_BASE_URL = "https://paintcompanybackend.onrender.com"
  const PRODUCTS_PER_PAGE = 8
  const categoryOrder = [
    "Primer",
    "Emulsion",
    "Distemper",
    "Metal and Wood Primer",
    "Metal and Wood Enamel",
    "Aluminium Paints",
    "Silver/Copper/Gold",
  ]

  // Helper function to process prices from individual price fields
  const processPrices = (product, categoryName) => {
    const prices = {}

    const priceFieldsMap = {
      "Silver/Copper/Gold": [
        { display: "50g", field: "price50g" },
        { display: "100g", field: "price100g" },
        { display: "200g", field: "price200g" },
        { display: "500g", field: "price500g" },
        { display: "1kg", field: "price1kg" },
      ],
      "Metal and Wood Primer": [
        { display: "200ml", field: "price200ml" },
        { display: "500ml", field: "price500ml" },
        { display: "1L", field: "price1l" },
        { display: "4L", field: "price4l" },
        { display: "20L", field: "price20l" },
      ],
      "Metal and Wood Enamel": [
        { display: "200ml", field: "price200ml" },
        { display: "500ml", field: "price500ml" },
        { display: "1L", field: "price1l" },
        { display: "4L", field: "price4l" },
        { display: "20L", field: "price20l" },
      ],
      "Aluminium Paints": [
        { display: "200ml", field: "price200ml" },
        { display: "500ml", field: "price500ml" },
        { display: "1L", field: "price1l" },
        { display: "4L", field: "price4l" },
        { display: "20L", field: "price20l" },
      ],
      Distemper: [
        { display: "1L", field: "price1l" },
        { display: "5L", field: "price5l" },
        { display: "10L", field: "price10l" },
        { display: "20L", field: "price20l" },
      ],
      Primer: [
        { display: "1L", field: "price1l" },
        { display: "4L", field: "price4l" },
        { display: "10L", field: "price10l" },
        { display: "20L", field: "price20l" },
      ],
      Emulsion: [
        { display: "1L", field: "price1l" },
        { display: "4L", field: "price4l" },
        { display: "10L", field: "price10l" },
        { display: "20L", field: "price20l" },
      ],
      default: [
        { display: "1L", field: "price1l" },
        { display: "4L", field: "price4l" },
        { display: "10L", field: "price10l" },
        { display: "20L", field: "price20l" },
      ],
    }

    const priceFields = priceFieldsMap[categoryName] || priceFieldsMap.default

    priceFields.forEach(({ display, field }) => {
      const priceValue = product[field]
      
      // More robust checking for valid prices
      if (priceValue !== null && 
          priceValue !== undefined && 
          priceValue !== "" && 
          String(priceValue).trim() !== "" &&
          String(priceValue).trim() !== "0" &&
          String(priceValue).toLowerCase() !== "null") {
        prices[display] = String(priceValue).trim()
      }
    })

    return prices
  }

  const loadMoreProducts = useCallback(
    (categoryId) => {
      setIsLoadingMore((prev) => ({ ...prev, [categoryId]: true }))

      const category = filteredCategories.find((cat) => cat.id === categoryId)
      if (!category) {
        setIsLoadingMore((prev) => ({ ...prev, [categoryId]: false }))
        return
      }

      const currentlyVisible = visibleProducts[categoryId] || PRODUCTS_PER_PAGE
      const newVisibleCount = currentlyVisible + PRODUCTS_PER_PAGE

      setVisibleProducts((prev) => ({
        ...prev,
        [categoryId]: newVisibleCount,
      }))

      setHasMore((prev) => ({
        ...prev,
        [categoryId]: newVisibleCount < category.products.length,
      }))

      setIsLoadingMore((prev) => ({ ...prev, [categoryId]: false }))
    },
    [filteredCategories, visibleProducts],
  )

  const handleClearFilters = () => {
    setSelectedCategory("all")
    setSearchTerm("")
    setSortOption("newest")
  }

  const hasActiveFilters = selectedCategory !== "all" || searchTerm !== ""

  useEffect(() => {
    if (!allCategories.length) return

    let filtered = [...allCategories]

    if (selectedCategory !== "all") {
      filtered = filtered.filter((category) => category.id === selectedCategory)
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()

      filtered = filtered
        .map((category) => {
          const filteredProducts = category.products.filter(
            (product) =>
              product.name.toLowerCase().includes(searchLower) ||
              (product.features && product.features.some((feature) => feature.toLowerCase().includes(searchLower))),
          )

          return {
            ...category,
            products: filteredProducts,
          }
        })
        .filter((category) => category.products.length > 0)
    }

    filtered = filtered.map((category) => {
      const sortedProducts = [...category.products]

      switch (sortOption) {
        case "name-asc":
          sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
          break
        case "name-desc":
          sortedProducts.sort((a, b) => b.name.localeCompare(a.name))
          break
        case "newest":
        default:
          break
      }

      return {
        ...category,
        products: sortedProducts,
      }
    })

    setFilteredCategories(filtered)

    const initialVisibleProducts = {}
    const initialHasMore = {}

    filtered.forEach((category) => {
      initialVisibleProducts[category.id] = PRODUCTS_PER_PAGE
      initialHasMore[category.id] = category.products.length > PRODUCTS_PER_PAGE
    })

    setVisibleProducts(initialVisibleProducts)
    setHasMore(initialHasMore)
  }, [allCategories, selectedCategory, searchTerm, sortOption])

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      setError("")
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/?limit=100&t=${new Date().getTime()}`)

        if (response.status === 200) {
          const allProducts = Array.isArray(response.data)
            ? response.data
            : response.data.items || response.data.results || []

          const categoryMap = {}

          categoryOrder.forEach((categoryName) => {
            categoryMap[categoryName] = {
              id: categoryName,
              name: categoryName.toUpperCase(),
              products: [],
            }
          })

          allProducts.forEach((product) => {
            const categoryName = product.category || "Uncategorized"
            if (!categoryMap[categoryName]) {
              categoryMap[categoryName] = {
                id: categoryName,
                name: categoryName.toUpperCase(),
                products: [],
              }
            }

            const prices = processPrices(product, categoryName)

            const imageUrl = product.image_url
              ? product.image_url.startsWith("http")
                ? product.image_url
                : `${API_BASE_URL}${product.image_url}`
              : "/placeholder.svg"

            let features = []
            try {
              features = Array.isArray(product.features)
                ? product.features
                : typeof product.features === "string"
                  ? JSON.parse(product.features)
                  : []
              features = features.filter((feature) => typeof feature === "string" && feature.length > 0)
            } catch (e) {
              features = []
            }

            const processedProduct = {
              id: product.id,
              name: product.name,
              prices,
              image: imageUrl,
              features,
            }

            categoryMap[categoryName].products.unshift(processedProduct)
          })

          const categorizedData = categoryOrder
            .filter((category) => categoryMap[category] && categoryMap[category].products.length > 0)
            .map((category) => categoryMap[category])

          Object.values(categoryMap)
            .filter((category) => !categoryOrder.includes(category.id) && category.products.length > 0)
            .forEach((category) => categorizedData.push(category))

          setAllCategories(categorizedData)
          setFilteredCategories(categorizedData)

          const initialVisibleProducts = {}
          const initialHasMore = {}

          categorizedData.forEach((category) => {
            initialVisibleProducts[category.id] = PRODUCTS_PER_PAGE
            initialHasMore[category.id] = category.products.length > PRODUCTS_PER_PAGE
          })

          setVisibleProducts(initialVisibleProducts)
          setHasMore(initialHasMore)
        } else {
          setError("Failed to fetch products")
        }
      } catch (error) {
        setError("An error occurred while fetching products.")
        console.error("Fetch error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6">
            Product <span className="text-red-500 font-normal">Catalog</span>
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
            Explore our comprehensive range of premium paints and coatings, designed for lasting durability and stunning
            aesthetics.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center">
            {error}
            <button
              onClick={() => setError("")}
              className="ml-2 text-red-600 underline hover:text-red-800 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {!isLoading && allCategories.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex md:hidden justify-between items-center mb-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-gray-200"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {(selectedCategory !== "all" ? 1 : 0) + (searchTerm !== "" ? 1 : 0)}
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-red-600 flex items-center transition-all duration-200 hover:text-red-800"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear all
                </button>
              )}
            </div>

            <div className={`${isFilterOpen ? "block" : "hidden"} md:block`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value)
                        setIsFilterOpen(false)
                      }}
                      className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border p-3"
                    >
                      <option value="all">All Categories</option>
                      {allCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.products.length})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Filter className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border p-3 pl-10"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border p-3"
                  >
                    <option value="newest">Newest First</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                  </select>
                </div>
              </div>

              <div className="hidden md:flex mt-6 items-center">
                {hasActiveFilters && (
                  <>
                    <span className="text-sm text-gray-500 mr-3">Active filters:</span>
                    {selectedCategory !== "all" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                        {allCategories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                        <button
                          onClick={() => setSelectedCategory("all")}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {searchTerm && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                        Search: {searchTerm}
                        <button onClick={() => setSearchTerm("")} className="ml-2 text-red-600 hover:text-red-800">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    <button onClick={handleClearFilters} className="text-sm text-red-600 hover:text-red-800 ml-auto">
                      Clear all filters
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <ProductCardSkeleton key={index} index={index} />
              ))}
          </div>
        ) : filteredCategories.length > 0 ? (
          filteredCategories.map((category, categoryIndex) => (
            <div key={category.id} className="mb-16">
              {category.products.length > 0 && (
                <div className="mb-8">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-red-500 text-white px-4 sm:px-8 py-4 flex items-center justify-between">
                      <h3 className="text-lg sm:text-2xl font-medium">{category.name}</h3>
                      <span className="bg-white text-red-500 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                        {category.products.length} products
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {category.products.slice(0, visibleProducts[category.id] || PRODUCTS_PER_PAGE).map((product, index) => (
                  <ProductCard key={product.id} product={product} categoryName={category.name} index={index} />
                ))}
              </div>

              {hasMore[category.id] && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => loadMoreProducts(category.id)}
                    disabled={isLoadingMore[category.id]}
                    className="flex items-center px-6 py-3 bg-red-100 text-red-800 rounded-xl hover:bg-red-200 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingMore[category.id] ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Load More {category.name}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Please add products to the catalog."}
            </p>
            {(searchTerm || selectedCategory !== "all") && (
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 hover:scale-105"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}