"use client"

import { useState, useEffect } from "react"
import { Calendar, Newspaper, Loader2 } from "lucide-react"
import axios from "axios" // Import axios here

export default function NewsAndEvents() {
  const [newsEvents, setNewsEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_BASE_URL = "https://paintcompanybackend.onrender.com"

  useEffect(() => {
    const fetchNewsEvents = async () => {
      setLoading(true)
      try {
        let response = await axios.get(`${API_BASE_URL}/api/news-events`, {
          params: {
            limit: 3,
            highlighted: true,
            current_only: true,
          },
        })

        let items = Array.isArray(response.data.items) ? response.data.items : []

        if (items.length === 0) {
          response = await axios.get(`${API_BASE_URL}/api/news-events`, {
            params: {
              limit: 3,
              current_only: true,
            },
          })
          items = Array.isArray(response.data.items) ? response.data.items : []
        }

        setNewsEvents(items)
      } catch (error) {
        console.error("Error fetching news/events:", error)
        setError(error.response?.data?.detail || error.message || "Failed to load news and events.")
      } finally {
        setLoading(false)
      }
    }

    fetchNewsEvents()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getIcon = (type) => {
    return type === "event" ? (
      <Calendar className="w-6 h-6 text-red-500" />
    ) : (
      <Newspaper className="w-6 h-6 text-red-500" />
    )
  }

  return (
    <div className="w-full">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900">
            News & <span className="text-red-500 font-normal">Events</span>
          </h2>
          <p className="text-lg text-gray-600 font-light">Stay updated with our latest announcements and events.</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            <span className="ml-3 text-gray-600 font-light">Loading news and events...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <p className="text-red-600 font-light">{typeof error === "string" ? error : JSON.stringify(error)}</p>
          </div>
        ) : newsEvents.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-light">No news or events available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {newsEvents.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-medium text-gray-900 leading-tight">{item.title}</h3>
                    <p className="text-gray-600 font-light leading-relaxed">{item.content}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(item.date)}
                        {item.end_date && ` - ${formatDate(item.end_date)}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
