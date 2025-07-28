"use client"

import { useState, useEffect } from "react"
import { Trash2, Mail, Phone, User, MessageSquare, Check, X, RefreshCw, AlertTriangle, MapPin } from "lucide-react"
import axios from "axios"

export default function ContactManager() {
  const [messages, setMessages] = useState([])
  const [contactInfo, setContactInfo] = useState({
    email: "contact@paintwebsite.com",
    phone: "+977 9849743401",
    address: "Itahari-6, Sunsari",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editedInfo, setEditedInfo] = useState({
    email: contactInfo.email,
    phone: contactInfo.phone,
    corporateAddress: "",
    factoryAddress: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)

  const API_BASE_URL = "https://paintcompanybackend.onrender.com"

  const getAuthToken = () => {
    return localStorage.getItem("authToken")
  }

  const getHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const messagesRes = await axios.get(`${API_BASE_URL}/admin/contact/submissions`, getHeaders())
      const infoRes = await axios.get(`${API_BASE_URL}/admin/contact/info`, getHeaders())

      if (messagesRes.data && (messagesRes.data.items || Array.isArray(messagesRes.data))) {
        const receivedMessages = messagesRes.data.items || messagesRes.data
        const formattedMessages = receivedMessages.map((msg) => ({
          id: msg.id,
          name: msg.full_name,
          email: msg.email,
          message: msg.message,
          date: msg.submission_date,
          read: msg.read_status || false,
        }))
        setMessages(formattedMessages)
      }

      if (infoRes.data) {
        const address = infoRes.data.address || contactInfo.address
        const [corporateAddress = "", factoryAddress = ""] = address.split("\n")
        setContactInfo({
          email: infoRes.data.email || contactInfo.email,
          phone: infoRes.data.phone || contactInfo.phone,
          address: address,
        })
        setEditedInfo({
          email: infoRes.data.email || contactInfo.email,
          phone: infoRes.data.phone || contactInfo.phone,
          corporateAddress,
          factoryAddress,
        })
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load data. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteMessage = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/admin/contact/submissions/${id}`, getHeaders())
      setMessages(messages.filter((message) => message.id !== id))
    } catch (err) {
      console.error("Error deleting message:", err)
      alert("Failed to delete message. Please try again.")
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/contact/submissions/${id}`, { read_status: true }, getHeaders())
      setMessages(messages.map((message) => (message.id === id ? { ...message, read: true } : message)))
    } catch (err) {
      console.error("Error marking message as read:", err)
      alert("Failed to update message status. Please try again.")
    }
  }

  const handleSaveContactInfo = async () => {
    try {
      const combinedAddress = [editedInfo.corporateAddress, editedInfo.factoryAddress]
        .filter((addr) => addr.trim() !== "")
        .join("\n")
      await axios.put(
        `${API_BASE_URL}/admin/contact/info`,
        {
          email: editedInfo.email,
          phone: editedInfo.phone,
          address: combinedAddress,
        },
        getHeaders(),
      )
      setContactInfo({
        email: editedInfo.email,
        phone: editedInfo.phone,
        address: combinedAddress,
      })
      setIsEditing(false)
      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 3000)
    } catch (err) {
      console.error("Error updating contact info:", err)
      alert("Failed to update contact information. Please try again.")
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const refreshData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/contact/submissions`, getHeaders())
      if (response.data && (response.data.items || Array.isArray(response.data))) {
        const receivedMessages = response.data.items || response.data
        const formattedMessages = receivedMessages.map((msg) => ({
          id: msg.id,
          name: msg.full_name,
          email: msg.email,
          message: msg.message,
          date: msg.submission_date,
          read: msg.read_status || false,
        }))
        setMessages(formattedMessages)
      }
    } catch (err) {
      console.error("Error refreshing data:", err)
      setError("Failed to refresh data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>
            <p className="text-gray-600 mt-1">Manage contact information and customer messages</p>
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
            <span>Contact information updated successfully!</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
              >
                Edit Information
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveContactInfo}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center font-medium"
                >
                  <Check size={16} className="mr-2" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditedInfo({
                      email: contactInfo.email,
                      phone: contactInfo.phone,
                      corporateAddress: contactInfo.address.split("\n")[0] || "",
                      factoryAddress: contactInfo.address.split("\n")[1] || "",
                    })
                  }}
                  className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors flex items-center font-medium"
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="p-8">
            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                    <p className="text-lg text-gray-900">{contactInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Phone Number</p>
                    <p className="text-lg text-gray-900">{contactInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Addresses</p>
                    {contactInfo.address.split("\n").map((addr, index) => (
                      <p key={index} className="text-lg text-gray-900">
                        {addr || (index === 0 ? "Corporate Office: Not set" : "Factory: Not set")}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={editedInfo.email}
                      onChange={(e) => setEditedInfo((prev) => ({ ...prev, email: e.target.value }))}
                      className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="phone"
                      value={editedInfo.phone}
                      onChange={(e) => setEditedInfo((prev) => ({ ...prev, phone: e.target.value }))}
                      className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Addresses</label>
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={editedInfo.corporateAddress}
                        onChange={(e) => setEditedInfo((prev) => ({ ...prev, corporateAddress: e.target.value }))}
                        placeholder="Corporate Office Address"
                        className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={editedInfo.factoryAddress}
                        onChange={(e) => setEditedInfo((prev) => ({ ...prev, factoryAddress: e.target.value }))}
                        placeholder="Factory Address"
                        className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Contact Messages</h2>
          </div>

          <div className="p-8">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mx-auto" />
                  <p className="text-gray-600 mt-4">Loading messages...</p>
                </div>
              </div>
            ) : messages.length > 0 ? (
              <div className="overflow-hidden">
                <div className="grid gap-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-6 rounded-xl border transition-colors cursor-pointer ${
                        message.read ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-200"
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-900">{message.name}</h4>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  message.read ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {message.read ? "Read" : "Unread"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{message.email}</p>
                            <p className="text-gray-800 line-clamp-2">{message.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{formatDate(message.date)}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {!message.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(message.id)
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteMessage(message.id)
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete message"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No messages</h3>
                <p className="text-gray-600">No contact messages have been received yet.</p>
              </div>
            )}
          </div>
        </div>

        {selectedMessage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Full Message</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">From:</p>
                  <p className="text-gray-900">
                    {selectedMessage.name} ({selectedMessage.email})
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date:</p>
                  <p className="text-gray-900">{formatDate(selectedMessage.date)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Message:</p>
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
