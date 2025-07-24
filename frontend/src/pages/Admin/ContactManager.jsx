"use client";

import { useState, useEffect } from "react";
import {
  Trash2,
  Mail,
  Phone,
  User,
  MessageSquare,
  Check,
  X,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";

export default function ContactManager() {
  const [messages, setMessages] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    email: "contact@paintwebsite.com",
    phone: "+977 9849743401",
    address: "Itahari-6, Sunsari",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    email: contactInfo.email,
    phone: contactInfo.phone,
    corporateAddress: "", // Temporary field for editing
    factoryAddress: "", // Temporary field for editing
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const API_BASE_URL = "https://paintcompanybackend.onrender.com";

  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  const getHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const messagesRes = await axios.get(
          `${API_BASE_URL}/admin/contact/submissions`,
          getHeaders()
        );
        const infoRes = await axios.get(
          `${API_BASE_URL}/admin/contact/info`,
          getHeaders()
        );

        if (messagesRes.data && (messagesRes.data.items || Array.isArray(messagesRes.data))) {
          const receivedMessages = messagesRes.data.items || messagesRes.data;
          const formattedMessages = receivedMessages.map((msg) => ({
            id: msg.id,
            name: msg.full_name,
            email: msg.email,
            message: msg.message,
            date: msg.submission_date,
            read: msg.read_status || false,
          }));
          setMessages(formattedMessages);
        }

        if (infoRes.data) {
          const address = infoRes.data.address || contactInfo.address;
          const [corporateAddress = "", factoryAddress = ""] = address.split("\n");
          setContactInfo({
            email: infoRes.data.email || contactInfo.email,
            phone: infoRes.data.phone || contactInfo.phone,
            address: address,
          });
          setEditedInfo({
            email: infoRes.data.email || contactInfo.email,
            phone: infoRes.data.phone || contactInfo.phone,
            corporateAddress,
            factoryAddress,
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteMessage = async (id) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/admin/contact/submissions/${id}`,
        getHeaders()
      );
      setMessages(messages.filter((message) => message.id !== id));
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Failed to delete message. Please try again.");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(
        `${API_BASE_URL}/admin/contact/submissions/${id}`,
        { read_status: true },
        getHeaders()
      );
      setMessages(messages.map((message) =>
        message.id === id ? { ...message, read: true } : message
      ));
    } catch (err) {
      console.error("Error marking message as read:", err);
      alert("Failed to update message status. Please try again.");
    }
  };

  const handleSaveContactInfo = async () => {
    try {
      const combinedAddress = [editedInfo.corporateAddress, editedInfo.factoryAddress]
        .filter((addr) => addr.trim() !== "")
        .join("\n");
      await axios.put(
        `${API_BASE_URL}/admin/contact/info`,
        {
          email: editedInfo.email,
          phone: editedInfo.phone,
          address: combinedAddress,
        },
        getHeaders()
      );
      setContactInfo({
        email: editedInfo.email,
        phone: editedInfo.phone,
        address: combinedAddress,
      });
      setIsEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating contact info:", err);
      alert("Failed to update contact information. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/contact/submissions`,
        getHeaders()
      );
      if (response.data && (response.data.items || Array.isArray(response.data))) {
        const receivedMessages = response.data.items || response.data;
        const formattedMessages = receivedMessages.map((msg) => ({
          id: msg.id,
          name: msg.full_name,
          email: msg.email,
          message: msg.message,
          date: msg.submission_date,
          read: msg.read_status || false,
        }));
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError("Failed to refresh data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Contact Management</h1>
        {!isLoading && !error && (
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center"
          >
            <RefreshCw size={16} className="mr-2" /> Refresh
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {updateSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <Check className="h-5 w-5 mr-2" />
            <span>Contact information updated successfully!</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800">Contact Information</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-popPurple text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Edit Information
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSaveContactInfo}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <Check size={16} className="mr-1" /> Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedInfo({
                    email: contactInfo.email,
                    phone: contactInfo.phone,
                    corporateAddress: contactInfo.address.split("\n")[0] || "",
                    factoryAddress: contactInfo.address.split("\n")[1] || "",
                  });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center"
              >
                <X size={16} className="mr-1" /> Cancel
              </button>
            </div>
          )}
        </div>
        <div className="p-6">
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-popRed mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="text-base text-gray-800">{contactInfo.email}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-popRed mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="text-base text-gray-800">{contactInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#e61741"
                  stroke="none"
                  className="mt-0.5"
                >
                  <path d="M12 2C7.6 2 4 5.6 4 10c0 5.4 7 12 8 12s8-6.6 8-12c0-4.4-3.6-8-8-8zm0 11c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-500">Addresses</p>
                  {contactInfo.address.split("\n").map((addr, index) => (
                    <p key={index} className="text-base text-gray-800">
                      {addr || (index === 0 ? "Corporate Office: Not set" : "Factory: Not set")}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={editedInfo.email}
                    onChange={(e) => setEditedInfo((prev) => ({ ...prev, email: e.target.value }))}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="phone"
                    value={editedInfo.phone}
                    onChange={(e) => setEditedInfo((prev) => ({ ...prev, phone: e.target.value }))}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Addresses
                </label>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <path d="M12 2C7.6 2 4 5.6 4 10c0 5.4 7 12 8 12s8-6.6 8-12c0-4.4-3.6-8-8-8zm0 11c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={editedInfo.corporateAddress}
                      onChange={(e) =>
                        setEditedInfo((prev) => ({ ...prev, corporateAddress: e.target.value }))
                      }
                      placeholder="Corporate Office Address"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <path d="M12 2C7.6 2 4 5.6 4 10c0 5.4 7 12 8 12s8-6.6 8-12c0-4.4-3.6-8-8-8zm0 11c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={editedInfo.factoryAddress}
                      onChange={(e) =>
                        setEditedInfo((prev) => ({ ...prev, factoryAddress: e.target.value }))
                      }
                      placeholder="Factory Address"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Contact Messages</h2>
        </div>
        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 text-popPurple animate-spin" />
              <span className="ml-2 text-gray-600">Loading messages...</span>
            </div>
          ) : messages.length > 0 ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6"
                        >
                          Sender
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6"
                        >
                          Message
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6 hidden sm:table-cell"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {messages.map((message) => (
                        <tr key={message.id} className={message.read ? "" : "bg-blue-50"}>
                          <td className="px-3 py-4 whitespace-nowrap sm:px-6">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                              </div>
                              <div className="ml-3 sm:ml-4">
                                <div className="text-xs sm:text-sm font-medium text-gray-900">{message.name}</div>
                                <div className="text-xs sm:text-sm text-gray-500 hidden sm:block">{message.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4 sm:px-6">
                            <button
                              onClick={() => setSelectedMessage(message)}
                              className="text-xs sm:text-sm text-gray-900 max-w-[100px] sm:max-w-xs truncate hover:underline"
                              title="Click to view full message"
                            >
                              {message.message}
                            </button>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 sm:px-6 hidden sm:table-cell">
                            {formatDate(message.date)}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap sm:px-6">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                message.read ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {message.read ? "Read" : "Unread"}
                            </span>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-xs sm:text-sm font-medium sm:px-6">
                            <div className="flex space-x-2">
                              {!message.read && (
                                <button
                                  onClick={() => handleMarkAsRead(message.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Mark as read"
                                >
                                  <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteMessage(message.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete message"
                              >
                                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
              <p className="mt-1 text-sm text-gray-500">No contact messages have been received yet.</p>
            </div>
          )}
        </div>
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Full Message</h3>
            <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{selectedMessage.message}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}