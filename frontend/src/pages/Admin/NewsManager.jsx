"use client"

import { useState, useEffect } from "react"
import { Calendar, Plus, Check, RefreshCw, AlertTriangle, Edit2, Trash2, Newspaper } from "lucide-react"
import axios from "axios"

// DeleteModal Component
function DeleteModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Delete Item</h3>
          <p className="text-gray-600 mb-2">Are you sure you want to delete this item?</p>
          <p className="text-sm text-gray-500 mb-8">This action cannot be undone.</p>
          <div className="flex space-x-4">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// NewsManager Component
export default function NewsManager() {
  const [newsEvents, setNewsEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemIdToDelete, setItemIdToDelete] = useState(null)

  const API_BASE_URL = "https://paintcompanybackend.onrender.com"

  const getAuthToken = () => {
    return localStorage.getItem("authToken")
  }

  const getHeaders = () => {
    const token = getAuthToken()
    if (!token) {
      window.location.href = "/login"
      return {}
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  }

  useEffect(() => {
    const fetchNewsEvents = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const headers = getHeaders()
        if (!headers.headers) return
        const response = await axios.get(`${API_BASE_URL}/admin/news-events`, {
          params: { limit: 100 },
          ...headers,
        })
        setNewsEvents(Array.isArray(response.data) ? response.data : [])
      } catch (err) {
        console.error("Fetch News Error:", err)
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken")
          localStorage.removeItem("adminAuth")
          window.location.href = "/login"
        }
        setError(err.response?.data?.detail || "Failed to load news/events")
        setNewsEvents([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchNewsEvents()
  }, [])

  const handleAddNew = () => {
    setIsAddingNew(true)
    setEditingId(null)
  }

  const handleSaveNew = async (item) => {
    const validationErrors = validateForm(item)
    if (validationErrors.length > 0) {
      return { errors: validationErrors }
    }
    try {
      console.log("Sending payload:", item)
      const formData = new FormData()
      formData.append("title", item.title)
      formData.append("type", item.type)
      formData.append("content", item.content)
      formData.append("date", item.date)
      if (item.end_date) formData.append("end_date", item.end_date)
      formData.append("highlighted", item.isHighlighted.toString())

      const response = await axios.post(`${API_BASE_URL}/admin/news-events`, formData, {
        ...getHeaders(),
        headers: {
          ...getHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      })
      setNewsEvents([response.data, ...newsEvents])
      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 3000)
      setIsAddingNew(false)
      return { success: true }
    } catch (err) {
      console.error("News Error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      })
      let errorMessage = "Failed to add news/event"
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken")
        localStorage.removeItem("adminAuth")
        window.location.href = "/login"
        errorMessage = "Unauthorized: Please log in again."
      } else if (err.response?.status === 404) {
        errorMessage = "API endpoint not found. Please check the backend configuration."
      } else if (err.response?.status === 422) {
        errorMessage = err.response?.data?.detail || "Invalid input data."
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later."
      }
      setError(errorMessage)
      return { errors: [errorMessage] }
    }
  }

  const handleEdit = (id) => {
    setEditingId(id)
    setIsAddingNew(false)
  }

  const handleSaveEdit = async (updatedItem) => {
    const validationErrors = validateForm(updatedItem)
    if (validationErrors.length > 0) {
      return { errors: validationErrors }
    }
    try {
      const formData = new FormData()
      if (updatedItem.title) formData.append("title", updatedItem.title)
      if (updatedItem.type) formData.append("type", updatedItem.type)
      if (updatedItem.content) formData.append("content", updatedItem.content)
      if (updatedItem.date) formData.append("date", updatedItem.date)
      if (updatedItem.end_date) formData.append("end_date", updatedItem.end_date)
      if (updatedItem.isHighlighted !== undefined) formData.append("highlighted", updatedItem.isHighlighted.toString())

      const response = await axios.put(`${API_BASE_URL}/admin/news-events/${editingId}`, formData, {
        ...getHeaders(),
        headers: {
          ...getHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      })
      setNewsEvents(newsEvents.map((item) => (item.id === editingId ? response.data : item)))
      setEditingId(null)
      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 3000)
      return { success: true }
    } catch (err) {
      console.error("Edit News Error:", err)
      const errorMessage = err.response?.data?.detail || "Failed to update news/event"
      setError(errorMessage)
      return { errors: [errorMessage] }
    }
  }

  const handleOpenDeleteModal = (id) => {
    setItemIdToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false)
    if (itemIdToDelete) {
      try {
        await axios.delete(`${API_BASE_URL}/admin/news-events/${itemIdToDelete}`, getHeaders())
        setNewsEvents(newsEvents.filter((item) => item.id !== itemIdToDelete))
        setUpdateSuccess(true)
        setTimeout(() => setUpdateSuccess(false), 3000)
      } catch (err) {
        console.error("Delete News Error:", err)
        setError(err.response?.data?.detail || "Failed to delete news/event")
      } finally {
        setItemIdToDelete(null)
      }
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setItemIdToDelete(null)
  }

  const handleCancel = () => {
    setIsAddingNew(false)
    setEditingId(null)
  }

  const refreshData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/news-events`, {
        params: { limit: 100 },
        ...getHeaders(),
      })
      setNewsEvents(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      console.error("Refresh Error:", err)
      setError(err.response?.data?.detail || "Failed to refresh news/events")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Validation function
  const validateForm = (item) => {
    const errors = []
    if (!item.title.trim()) errors.push("Title is required")
    if (!item.type) errors.push("Type is required")
    if (!item.content.trim()) errors.push("Content is required")
    if (!item.date) errors.push("Date is required")
    return errors
  }

  const ItemForm = ({ initialItem, onSave, onCancel, isNew = false }) => {
    const [item, setItem] = useState({
      title: initialItem.title || "",
      type: initialItem.type || "news",
      content: initialItem.content || "",
      date: initialItem.date
        ? new Date(initialItem.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      end_date: initialItem.end_date ? new Date(initialItem.end_date).toISOString().split("T")[0] : "",
      isHighlighted: initialItem.highlighted || false,
    })
    const [errors, setErrors] = useState([])

    const handleChange = (updatedFields) => {
      setItem({ ...item, ...updatedFields })
      setErrors([]) // Clear errors when user starts editing
    }

    const handleSubmit = async () => {
      const result = await onSave(item)
      if (result.errors) {
        setErrors(result.errors)
      } else if (result.success && isNew) {
        setItem({
          title: "",
          type: "news",
          content: "",
          date: new Date().toISOString().split("T")[0],
          end_date: "",
          isHighlighted: false,
        })
      }
    }

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">{isNew ? "Add New Item" : "Edit Item"}</h3>
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={item.title}
              onChange={(e) => handleChange({ title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter title"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              id="type"
              value={item.type}
              onChange={(e) => handleChange({ type: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="news">News</option>
              <option value="event">Event</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            value={item.content}
            onChange={(e) => handleChange({ content: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Enter content"
            required
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              {item.type === "event" ? "Event Date *" : "Publish Date *"}
            </label>
            <input
              type="date"
              id="date"
              value={item.date}
              onChange={(e) => handleChange({ date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
              End Date (Optional)
            </label>
            <input
              type="date"
              id="end_date"
              value={item.end_date}
              onChange={(e) => handleChange({ end_date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center mb-8">
          <input
            type="checkbox"
            id="isHighlighted"
            checked={item.isHighlighted}
            onChange={(e) => handleChange({ isHighlighted: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isHighlighted" className="ml-3 text-sm text-gray-700">
            Highlight this item
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">News & Events</h1>
            <p className="text-gray-600 mt-1">Manage company news and upcoming events</p>
          </div>
          {!isLoading && !error && (
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center">
            <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {updateSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center">
            <Check className="h-5 w-5 mr-3 flex-shrink-0" />
            <span>Operation completed successfully!</span>
          </div>
        )}

        {isAddingNew && (
          <ItemForm
            initialItem={{
              title: "",
              type: "news",
              content: "",
              date: new Date().toISOString().split("T")[0],
              end_date: "",
              highlighted: false,
            }}
            onSave={handleSaveNew}
            onCancel={handleCancel}
            isNew={true}
          />
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mx-auto" />
              <p className="text-gray-600 mt-4">Loading news and events...</p>
            </div>
          </div>
        ) : newsEvents.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">News & Events</h2>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors inline-flex items-center font-medium"
              >
                <Plus size={16} className="mr-2" />
                Add New Item
              </button>
            </div>

            <div className="p-8">
              <div className="grid gap-6">
                {newsEvents.map((item) =>
                  editingId === item.id ? (
                    <ItemForm key={item.id} initialItem={item} onSave={handleSaveEdit} onCancel={handleCancel} />
                  ) : (
                    <div
                      key={item.id}
                      className={`p-6 rounded-xl border transition-colors ${
                        item.highlighted ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                item.type === "event" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                              }`}
                            >
                              {item.type === "event" ? "Event" : "News"}
                            </span>
                            {item.highlighted && (
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                Highlighted
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-3 line-clamp-2">{item.content}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(item.date)}</span>
                            </div>
                            {item.end_date && <span>to {formatDate(item.end_date)}</span>}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(item.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No news or events</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first news item or event.</p>
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors inline-flex items-center font-medium"
            >
              <Plus size={16} className="mr-2" />
              Add New Item
            </button>
          </div>
        )}
        <DeleteModal isOpen={isDeleteModalOpen} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
      </div>
    </div>
  )
}
