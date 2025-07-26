"use client";

import { useState, useEffect, useCallback, memo, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { RefreshCw, Layers, ChevronDown, Search, Filter, SlidersHorizontal, X } from "lucide-react";

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasIntersected, options]);

  return [ref, isIntersecting, hasIntersected];
};

const ProductCard = memo(({ product, categoryName, index = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [cardRef, isIntersecting, hasIntersected] = useIntersectionObserver();

  return (
    <div 
      ref={cardRef}
      className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transform transition-all duration-700 ease-out ${
        hasIntersected 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      } hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="aspect-square overflow-hidden bg-gray-100 relative group">
        {/* Loading state */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-400 border-t-red-500 rounded-full animate-spin"></div>
            </div>
          </div>
        )}
        
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className={`h-full w-full object-cover object-center transition-all duration-700 ease-out transform ${
            imageLoaded && !imageError 
              ? 'opacity-100 scale-100 blur-0' 
              : 'opacity-0 scale-110 blur-sm'
          } group-hover:scale-110 group-hover:brightness-110`}
          loading="lazy"
          decoding="async"
          fetchpriority="low"
          onLoad={() => {
            setTimeout(() => setImageLoaded(true), 100);
          }}
          onError={(e) => {
            setImageError(true);
            setImageLoaded(true);
            e.currentTarget.src = "/placeholder.svg";
            e.currentTarget.onerror = null;
          }}
        />
        
        {/* Overlay effect on hover */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </div>

      <div className="p-2 flex-1 flex flex-col transition-all duration-300">
        <div className="mb-1">
          <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded transition-all duration-300 hover:bg-red-200 hover:scale-105 hover:shadow-sm">
            {categoryName}
          </span>
        </div>

        <h3 className="font-bold text-sm mb-1 line-clamp-2 transition-all duration-300 hover:text-red-600 group-hover:text-red-700">
          {product.name}
        </h3>

        {product.features && product.features.length > 0 && (
          <p className="text-xs text-gray-600 mb-2 overflow-hidden text-ellipsis transition-colors duration-300 group-hover:text-gray-700">
            <span className="font-medium">Features:</span> {product.features.join(", ")}
          </p>
        )}

        <div className="mt-auto">
          <h4 className="text-xs font-medium text-gray-700 mb-1 transition-colors duration-300 group-hover:text-gray-800">
            Prices:
          </h4>
          <div className="flex flex-wrap gap-1 text-xs">
            {Object.entries(product.prices).length > 0 ? (
              Object.entries(product.prices).map(
                ([size, price], priceIndex) =>
                  price && (
                    <div 
                      key={size} 
                      className="flex items-center space-x-1 bg-gray-100 px-1 py-0.5 rounded transition-all duration-300 hover:bg-red-50 hover:shadow-md transform hover:scale-110 hover:-translate-y-0.5"
                      style={{
                        transitionDelay: `${priceIndex * 50}ms`,
                      }}
                    >
                      <span className="font-semibold">
                        {size.includes("L") || size.includes("ml") ? `${size.toUpperCase()}:` : `${size.toUpperCase()}:`}
                      </span>
                      <span className="text-red-600 font-medium">{price}</span>
                    </div>
                  ),
              )
            ) : (
              <span className="text-gray-500 text-xs">No prices available</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

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
};

const ProductCardSkeleton = memo(({ index = 0 }) => (
  <div 
    className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full animate-pulse"
    style={{
      animationDelay: `${index * 100}ms`,
    }}
  >
    <div className="aspect-square bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
    <div className="p-2 flex-1 flex flex-col space-y-2">
      <div className="w-1/3 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer"></div>
      <div className="w-full h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer"></div>
      <div className="w-2/3 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer"></div>
      <div className="mt-auto space-y-2">
        <div className="w-1/4 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer"></div>
        <div className="flex flex-wrap gap-1">
          <div className="w-16 h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer"></div>
          <div className="w-16 h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer"></div>
        </div>
      </div>
    </div>
  </div>
));

ProductCardSkeleton.propTypes = {
  index: PropTypes.number,
};

export default function ProductCatalog() {
  const [allCategories, setAllCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleProducts, setVisibleProducts] = useState({});
  const [hasMore, setHasMore] = useState({});
  const [isLoadingMore, setIsLoadingMore] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const API_BASE_URL = "https://paintcompanybackend.onrender.com";
  const PRODUCTS_PER_PAGE = 8;
  const categoryOrder = [
    "Primer",
    "Emulsion",
    "Distemper",
    "Metal and Wood Primer",
    "Metal and Wood Enamel",
    "Aluminium Paints",
    "Silver/Copper/Gold",
  ];

  // Helper function to process prices from individual price fields
  const processPrices = (product, categoryName) => {
    const prices = {};
    
    // Define price fields based on category with correct database field names (lowercase)
    const priceFieldsMap = {
      "Silver/Copper/Gold": [
        { display: "50g", field: "price50g" },
        { display: "100g", field: "price100g" },
        { display: "200g", field: "price200g" },
        { display: "500g", field: "price500g" },
        { display: "1kg", field: "price1kg" }
      ],
      "Metal and Wood Primer": [
        { display: "200ml", field: "price200ml" },
        { display: "500ml", field: "price500ml" },
        { display: "1L", field: "price1l" },
        { display: "4L", field: "price4l" },
         { display: "20L", field: "price20l" }
      ],
      "Metal and Wood Enamel": [
        { display: "200ml", field: "price200ml" },
        { display: "500ml", field: "price500ml" },
        { display: "1L", field: "price1l" },
        { display: "4L", field: "price4l" },
        { display: "20L", field: "price20l" }
      ],
      "Aluminium Paints": [
        { display: "200ml", field: "price200ml" },
        { display: "500ml", field: "price500ml" },
        { display: "1L", field: "price1l" },
        { display: "4L", field: "price4l" },
        { display: "20L", field: "price20l" }

      ],
      "Distemper": [
        { display: "1L", field: "price1l" },
        { display: "5L", field: "price5l" },
        { display: "10L", field: "price10l" },
        { display: "20L", field: "price20l" },
      ],
      "Primer": [
        { display: "1L", field: "price1l" },
        { display: "4L", field: "price4l" },
        { display: "10L", field: "price10l" },
        { display: "20L", field: "price20l" }
      ],
      "Emulsion": [
        { display: "1L", field: "price1l" },
        { display: "4L", field: "price4l" },
        { display: "10L", field: "price10l" },
        { display: "20L", field: "price20l" }
      ],
      default: [
        { display: "1L", field: "price1l" },
        { display: "4L", field: "price4l" },
        { display: "10L", field: "price10l" },
        { display: "20L", field: "price20l" }
      ],
    };

    const priceFields = priceFieldsMap[categoryName] || priceFieldsMap.default;
    
    // Map price fields to the prices object using correct database field names
    priceFields.forEach(({ display, field }) => {
      if (product[field] && product[field].toString().trim() !== "") {
        prices[display] = product[field];
      }
    });

    console.log(`Processing prices for ${product.name} (${categoryName}):`, {
      originalProduct: product,
      priceFields,
      processedPrices: prices,
      availableFields: Object.keys(product).filter(key => key.startsWith('price'))
    });

    return prices;
  };

  const loadMoreProducts = useCallback(
    (categoryId) => {
      setIsLoadingMore((prev) => ({ ...prev, [categoryId]: true }));

      const category = filteredCategories.find((cat) => cat.id === categoryId);
      if (!category) {
        setIsLoadingMore((prev) => ({ ...prev, [categoryId]: false }));
        return;
      }

      const currentlyVisible = visibleProducts[categoryId] || PRODUCTS_PER_PAGE;
      const newVisibleCount = currentlyVisible + PRODUCTS_PER_PAGE;

      setVisibleProducts((prev) => ({
        ...prev,
        [categoryId]: newVisibleCount,
      }));

      setHasMore((prev) => ({
        ...prev,
        [categoryId]: newVisibleCount < category.products.length,
      }));

      setIsLoadingMore((prev) => ({ ...prev, [categoryId]: false }));
    },
    [filteredCategories, visibleProducts],
  );

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setSortOption("newest");
  };

  const hasActiveFilters = selectedCategory !== "all" || searchTerm !== "";

  useEffect(() => {
    if (!allCategories.length) return;

    let filtered = [...allCategories];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((category) => category.id === selectedCategory);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();

      filtered = filtered
        .map((category) => {
          const filteredProducts = category.products.filter(
            (product) =>
              product.name.toLowerCase().includes(searchLower) ||
              (product.features && product.features.some((feature) => feature.toLowerCase().includes(searchLower))),
          );

          return {
            ...category,
            products: filteredProducts,
          };
        })
        .filter((category) => category.products.length > 0);
    }

    filtered = filtered.map((category) => {
      const sortedProducts = [...category.products];

      switch (sortOption) {
        case "name-asc":
          sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "newest":
        default:
          break;
      }

      return {
        ...category,
        products: sortedProducts,
      };
    });

    setFilteredCategories(filtered);

    const initialVisibleProducts = {};
    const initialHasMore = {};

    filtered.forEach((category) => {
      initialVisibleProducts[category.id] = PRODUCTS_PER_PAGE;
      initialHasMore[category.id] = category.products.length > PRODUCTS_PER_PAGE;
    });

    setVisibleProducts(initialVisibleProducts);
    setHasMore(initialHasMore);
  }, [allCategories, selectedCategory, searchTerm, sortOption]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/?limit=100&t=${new Date().getTime()}`);

        if (response.status === 200) {
          const allProducts = Array.isArray(response.data)
            ? response.data
            : response.data.items || response.data.results || [];

          console.log("Raw products from API:", allProducts);

          const categoryMap = {};

          categoryOrder.forEach((categoryName) => {
            categoryMap[categoryName] = {
              id: categoryName,
              name: categoryName.toUpperCase(),
              products: [],
            };
          });

          allProducts.forEach((product) => {
            const categoryName = product.category || "Uncategorized";
            if (!categoryMap[categoryName]) {
              categoryMap[categoryName] = {
                id: categoryName,
                name: categoryName.toUpperCase(),
                products: [],
              };
            }

            // Process prices using the helper function
            const prices = processPrices(product, categoryName);

            const imageUrl = product.image_url
              ? product.image_url.startsWith("http")
                ? product.image_url
                : `${API_BASE_URL}${product.image_url}`
              : "/placeholder.svg";

            let features = [];
            try {
              features = Array.isArray(product.features)
                ? product.features
                : typeof product.features === "string"
                  ? JSON.parse(product.features)
                  : [];
              features = features.filter((feature) => typeof feature === "string" && feature.length > 0);
            } catch (e) {
              features = [];
            }

            const processedProduct = {
              id: product.id,
              name: product.name,
              prices, // Use processed prices
              image: imageUrl,
              features,
            };

            console.log(`Processed product ${product.name}:`, processedProduct);

            categoryMap[categoryName].products.unshift(processedProduct);
          });

          const categorizedData = categoryOrder
            .filter((category) => categoryMap[category] && categoryMap[category].products.length > 0)
            .map((category) => categoryMap[category]);

          Object.values(categoryMap)
            .filter((category) => !categoryOrder.includes(category.id) && category.products.length > 0)
            .forEach((category) => categorizedData.push(category));

          console.log("Final categorized data:", categorizedData);

          setAllCategories(categorizedData);
          setFilteredCategories(categorizedData);

          const initialVisibleProducts = {};
          const initialHasMore = {};

          categorizedData.forEach((category) => {
            initialVisibleProducts[category.id] = PRODUCTS_PER_PAGE;
            initialHasMore[category.id] = category.products.length > PRODUCTS_PER_PAGE;
          });

          setVisibleProducts(initialVisibleProducts);
          setHasMore(initialHasMore);
        } else {
          setError("Failed to fetch products");
        }
      } catch (error) {
        setError("An error occurred while fetching products.");
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      {/* CSS Styles */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }

        html {
          scroll-behavior: smooth;
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Utility classes for line clamping */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="bg-gray-50 min-h-screen">
        <div className="text-black p-4 text-center">
          <h1 className="text-2xl font-bold text-center transition-all duration-300 hover:text-red-600">
            LUBROPAINT PRODUCT CATALOG
          </h1>
        </div>

        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center transition-all duration-300 animate-in slide-in-from-top">
              {error}
              <button onClick={() => setError("")} className="ml-2 text-red-600 underline hover:text-red-800 transition-colors">
                Dismiss
              </button>
            </div>
          )}

          {!isLoading && allCategories.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex md:hidden justify-between items-center mb-4">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center px-3 py-2 bg-gray-100 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-200 hover:scale-105"
                  aria-expanded={isFilterOpen}
                  aria-label="Toggle filters"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs animate-pulse">
                      {(selectedCategory !== "all" ? 1 : 0) + (searchTerm !== "" ? 1 : 0)}
                    </span>
                  )}
                </button>

                {hasActiveFilters && (
                  <button onClick={handleClearFilters} className="text-sm text-red-600 flex items-center transition-all duration-200 hover:text-red-800 hover:scale-105">
                    <X className="h-3 w-3 mr-1" />
                    Clear all
                  </button>
                )}
              </div>

              <div className={`${isFilterOpen ? "block" : "hidden"} md:block transition-all duration-300`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setIsFilterOpen(false);
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border p-2 pr-8 transition-all duration-200 hover:border-red-300"
                      >
                        <option value="all">All Categories</option>
                        {allCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name} ({category.products.length})
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <Filter className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border p-2 pl-8 transition-all duration-200 hover:border-red-300"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="absolute inset-y-0 right-0 flex items-center pr-2 transition-all duration-200 hover:scale-110"
                        >
                          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border p-2 transition-all duration-200 hover:border-red-300"
                    >
                      <option value="newest">Newest First</option>
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                    </select>
                  </div>
                </div>

                <div className="hidden md:flex mt-4 items-center">
                  {hasActiveFilters && (
                    <>
                      <span className="text-sm text-gray-500 mr-2">Active filters:</span>
                      {selectedCategory !== "all" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2 transition-all duration-200 hover:bg-red-200">
                          {allCategories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                          <button
                            onClick={() => setSelectedCategory("all")}
                            className="ml-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {searchTerm && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2 transition-all duration-200 hover:bg-red-200">
                          Search: {searchTerm}
                          <button onClick={() => setSearchTerm("")} className="ml-1 text-red-600 hover:text-red-800 transition-colors duration-200">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      <button onClick={handleClearFilters} className="text-sm text-red-600 hover:text-red-800 ml-auto transition-all duration-200 hover:scale-105">
                        Clear all filters
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array(8)
                .fill(0)
                .map((_, index) => (
                  <ProductCardSkeleton key={index} index={index} />
                ))}
            </div>
          ) : filteredCategories.length > 0 ? (
            filteredCategories.map((category, categoryIndex) => (
              <div 
                key={category.id} 
                className="mb-8 transition-all duration-500 ease-out"
                style={{
                  animationDelay: `${categoryIndex * 200}ms`,
                }}
              >
                {category.products.length > 0 && (
                  <div className="flex mb-4 bg-white shadow-md rounded-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="flex-1 bg-red-600 text-white flex items-center justify-center font-bold text-xl px-4 py-2 transition-all duration-300 hover:bg-red-700">
                      {category.name}
                      <span className="ml-2 text-sm bg-white text-red-600 rounded-full px-2 py-0.5 transition-all duration-300 hover:scale-110">
                        {category.products.length}
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {category.products.slice(0, visibleProducts[category.id] || PRODUCTS_PER_PAGE).map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      categoryName={category.name} 
                      index={index}
                    />
                  ))}
                </div>

                {hasMore[category.id] && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => loadMoreProducts(category.id)}
                      disabled={isLoadingMore[category.id]}
                      className="flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-all duration-300 hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {isLoadingMore[category.id] ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:translate-y-1" />
                          Load More {category.name}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center transition-all duration-500 hover:shadow-lg">
              <Layers className="h-12 w-12 text-gray-400 mx-auto transition-all duration-300 hover:text-red-400 hover:scale-110" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 transition-colors duration-300">No products found</h3>
              <p className="mt-1 text-gray-500 transition-colors duration-300">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Please add products to the catalog."}
              </p>
              {(searchTerm || selectedCategory !== "all") && (
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

ProductCatalog.propTypes = {};