import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar } from "lucide-react";

export default function NewsAndEvents() {
  const [newsEvents, setNewsEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    const fetchNewsEvents = async () => {
      setLoading(true);
      try {
        let response = await axios.get(`${API_BASE_URL}/api/news-events`, {
          params: {
            limit: 3,
            highlighted: true,
            current_only: true,
          },
        });
        console.log("Highlighted news/events response:", response.data);
        let items = Array.isArray(response.data.items) ? response.data.items : [];

        if (items.length === 0) {
          console.log("No highlighted items found, fetching all active news/events");
          response = await axios.get(`${API_BASE_URL}/api/news-events`, {
            params: {
              limit: 3,
              current_only: true,
            },
          });
          console.log("All active news/events response:", response.data);
          items = Array.isArray(response.data.items) ? response.data.items : [];
        }

        console.log("Setting newsEvents:", items);
        setNewsEvents(items);
      } catch (error) {
        console.error("Error fetching news/events:", error);
        setError(
          error.response?.data?.detail || 
          error.message || 
          "Failed to load news and events."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNewsEvents();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getIcon = (type) => {
    return type === "event" ? <Calendar className="w-7 h-7 text-red-600" /> : <span className="text-3xl">🔥</span>;
  };

  return (
    <div className="relative overflow-hidden ml-4 sm:ml-24">
      <div className="container mx-auto px-2 sm:px-4 relative z-10 sm:ml-0">
        <div className="flex flex-col gap-6 sm:gap-8 lg:gap-12">
          <div className="w-full md:pl-8">
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-black">
                News & <span className="underline decoration-red-500 underline-offset-4 decoration-2">Events</span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold mt-4 md:mt-6">
                Stay updated with our latest announcements and events.
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-6 sm:py-8">
                <svg className="animate-spin h-6 sm:h-8 w-6 sm:w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-2 text-gray-600 text-sm sm:text-base">Loading news and events...</span>
              </div>
            ) : error ? (
              <p className="text-red-600 text-sm sm:text-base mt-6">
                {typeof error === "string" ? error : JSON.stringify(error)}
              </p>
            ) : newsEvents.length === 0 ? (
              <p className="text-gray-600 text-sm sm:text-base mt-6">
                No news or events available at the moment.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:gap-8 mt-6">
                {newsEvents.map((item) => (
                  <div key={item.id} className="flex flex-col space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 flex items-center justify-center text-red-500 flex-shrink-0">
                        {getIcon(item.type)}
                      </div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold truncate">{item.title}</h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 line-clamp-2">{item.content}</p>
                    <p className="text-sm sm:text-base text-gray-500">
                      {formatDate(item.date)}
                      {item.end_date && ` - ${formatDate(item.end_date)}`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}