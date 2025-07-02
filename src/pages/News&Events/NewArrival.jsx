"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function NewArrival() {
  const [arrival, setArrival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:8000";

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.svg";
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
    if (imageUrl.startsWith("/static/")) return `${API_BASE_URL}${imageUrl}`;
    if (!imageUrl.includes("/")) return `${API_BASE_URL}/static/new_arrivals/${imageUrl}`;
    return imageUrl;
  };

  useEffect(() => {
    const fetchNewArrival = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/new-arrivals`, {
          params: { limit: 1 },
        });
        console.log("New arrivals response:", response.data);
        let productsList = [];
        if (Array.isArray(response.data)) {
          productsList = response.data;
        } else if (response.data.items && Array.isArray(response.data.items)) {
          productsList = response.data.items;
        } else {
          throw new Error("Unexpected API response format");
        }
        if (productsList.length === 0) {
          throw new Error("No new arrivals found");
        }
        const formattedProducts = productsList.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description || "Discover our latest product!",
          release_date: product.release_date,
          image: getImageUrl(product.image_url),
        }));
        console.log("Formatted products:", formattedProducts);
        setArrival(formattedProducts[0]);
      } catch (error) {
        console.error("Error fetching new arrival:", error);
        setError(error.message || "Failed to load new arrival");
        setArrival({
          name: "New Arrival",
          description: "Discover our latest product!",
          release_date: new Date().toISOString(),
          image: "/placeholder.svg",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrival();
  }, []);

  const getIcon = () => {
    return <span className="text-xl sm:text-2xl">🌟</span>;
  };

  const displayArrival = arrival || {
    name: "New Arrival",
    description: "Discover our latest product!",
    release_date: new Date().toISOString(),
    image: "/placeholder.svg",
  };

  return (
    <div className="w-full md:pl-8 mb-8 ml-4 sm:ml-4">
      {loading ? (
        <div className="flex justify-start items-center py-4 sm:py-6">
          <svg
            className="animate-spin h-6 sm:h-8 w-6 sm:w-8 text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="ml-2 text-gray-600 text-sm sm:text-base">Loading new arrival...</span>
        </div>
      ) : error ? (
        <div className="text-red-600 text-left py-4 sm:py-6 text-sm sm:text-base">
          {error}
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center">
            <div className="relative mb-4 md:mb-0 ml-4 sm:ml-6 md:ml-8">
              <div className="text-red-500 font-bold text-3xl sm:text-3xl md:text-5xl leading-tight transform -rotate-12">
                New
                <br />
                Arrival!
              </div>
            </div>
            <div className="mr-4 sm:mr-6 md:mr-8">
              <img
                src={displayArrival.image}
                alt={displayArrival.name || "New Arrival"}
                className="w-40 sm:w-48 md:w-60 h-40 sm:h-48 md:h-60 object-contain"
                onError={(e) => {
                  console.error("Image load error:", displayArrival.image);
                  e.target.src = "/placeholder.svg";
                }}
                onLoad={() => console.log("Image loaded successfully:", displayArrival.image)}
              />
            </div>
          </div>
          <div className="text-left">
            <h3 className="text-xl sm:text-2xl font-bold">{displayArrival.name || "New Product"}</h3>
            <div className="flex items-start gap-2 justify-start">
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                {getIcon()}
              </div>
              <div>
                <p className="text-xs sm:text-sm md:text-base">{displayArrival.description}</p>
                <p className="text-xs text-gray-500">
                  Released on{" "}
                  {new Date(displayArrival.release_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}