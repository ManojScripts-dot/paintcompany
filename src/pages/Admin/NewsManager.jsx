"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Check,
  X,
  RefreshCw,
  AlertTriangle,
  Edit2,
  Trash2,
} from "lucide-react";
import axios from "axios";

// DeleteModal Component
function DeleteModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-30" onClick={onCancel}></div>
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10 w-80">
        <div className="flex justify-center mb-4">
          <svg
            className="text-popRed h-10 w-10"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <div className="flex items-center">
          <p className="text-gray-700">Are you sure you want to delete?</p>
        </div>
        <div className="flex items-center mb-4">
          <p className="text-gray-500">(This can't be undone!)</p>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 bg-popRed text-white rounded hover:bg-red-700"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

// NewsManager Component
export default function NewsManager() {
  const [newsEvents, setNewsEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);

  const API_BASE_URL = "http://localhost:8000";

  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  const getHeaders = () => {
    const token = getAuthToken();
    if (!token) {
      window.location.href = "/login";
      return {};
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    const fetchNewsEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const headers = getHeaders();
        if (!headers.headers) return;
        const response = await axios.get(`${API_BASE_URL}/admin/news-events`, {
          params: { limit: 100 },
          ...headers,
        });
        setNewsEvents(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Fetch News Error:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("adminAuth");
          window.location.href = "/login";
        }
        setError(err.response?.data?.detail || "Failed to load news/events");
        setNewsEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsEvents();
  }, []);

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
  };

  const handleSaveNew = async (item) => {
    const validationErrors = validateForm(item);
    if (validationErrors.length > 0) {
      return { errors: validationErrors };
    }
    try {
      console.log("Sending payload:", item);
      const formData = new FormData();
      formData.append("title", item.title);
      formData.append("type", item.type);
      formData.append("content", item.content);
      formData.append("date", item.date);
      if (item.end_date) formData.append("end_date", item.end_date);
      formData.append("highlighted", item.isHighlighted.toString());

      const response = await axios.post(
        `${API_BASE_URL}/admin/news-events`,
        formData,
        {
          ...getHeaders(),
          headers: {
            ...getHeaders().headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setNewsEvents([response.data, ...newsEvents]);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      setIsAddingNew(false);
      return { success: true };
    } catch (err) {
      console.error("News Error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      let errorMessage = "Failed to add news/event";
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("adminAuth");
        window.location.href = "/login";
        errorMessage = "Unauthorized: Please log in again.";
      } else if (err.response?.status === 404) {
        errorMessage = "API endpoint not found. Please check the backend configuration.";
      } else if (err.response?.status === 422) {
        errorMessage = err.response?.data?.detail || "Invalid input data.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }
      setError(errorMessage);
      return { errors: [errorMessage] };
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setIsAddingNew(false);
  };

  const handleSaveEdit = async (updatedItem) => {
    const validationErrors = validateForm(updatedItem);
    if (validationErrors.length > 0) {
      return { errors: validationErrors };
    }
    try {
      const formData = new FormData();
      if (updatedItem.title) formData.append("title", updatedItem.title);
      if (updatedItem.type) formData.append("type", updatedItem.type);
      if (updatedItem.content) formData.append("content", updatedItem.content);
      if (updatedItem.date) formData.append("date", updatedItem.date);
      if (updatedItem.end_date) formData.append("end_date", updatedItem.end_date);
      if (updatedItem.isHighlighted !== undefined)
        formData.append("highlighted", updatedItem.isHighlighted.toString());

      const response = await axios.put(
        `${API_BASE_URL}/admin/news-events/${editingId}`,
        formData,
        {
          ...getHeaders(),
          headers: {
            ...getHeaders().headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setNewsEvents(
        newsEvents.map((item) => (item.id === editingId ? response.data : item))
      );
      setEditingId(null);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      return { success: true };
    } catch (err) {
      console.error("Edit News Error:", err);
      const errorMessage = err.response?.data?.detail || "Failed to update news/event";
      setError(errorMessage);
      return { errors: [errorMessage] };
    }
  };

  const handleOpenDeleteModal = (id) => {
    setItemIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    if (itemIdToDelete) {
      try {
        await axios.delete(
          `${API_BASE_URL}/admin/news-events/${itemIdToDelete}`,
          getHeaders()
        );
        setNewsEvents(newsEvents.filter((item) => item.id !== itemIdToDelete));
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      } catch (err) {
        console.error("Delete News Error:", err);
        setError(err.response?.data?.detail || "Failed to delete news/event");
      } finally {
        setItemIdToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setItemIdToDelete(null);
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
  };

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/news-events`, {
        params: { limit: 100 },
        ...getHeaders(),
      });
      setNewsEvents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Refresh Error:", err);
      setError(err.response?.data?.detail || "Failed to refresh news/events");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Validation function
  const validateForm = (item) => {
    const errors = [];
    if (!item.title.trim()) errors.push("Title is required");
    if (!item.type) errors.push("Type is required");
    if (!item.content.trim()) errors.push("Content is required");
    if (!item.date) errors.push("Date is required");
    return errors;
  };

  const ItemForm = ({ initialItem, onSave, onCancel, isNew = false }) => {
    const [item, setItem] = useState({
      title: initialItem.title || "",
      type: initialItem.type || "news",
      content: initialItem.content || "",
      date: initialItem.date
        ? new Date(initialItem.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      end_date: initialItem.end_date
        ? new Date(initialItem.end_date).toISOString().split("T")[0]
        : "",
      isHighlighted: initialItem.highlighted || false,
    });
    const [errors, setErrors] = useState([]);

    const handleChange = (updatedFields) => {
      setItem({ ...item, ...updatedFields });
      setErrors([]); // Clear errors when user starts editing
    };

    const handleSubmit = async () => {
      const result = await onSave(item);
      if (result.errors) {
        setErrors(result.errors);
      } else if (result.success && isNew) {
        setItem({
          title: "",
          type: "news",
          content: "",
          date: new Date().toISOString().split("T")[0],
          end_date: "",
          isHighlighted: false,
        });
      }
    };

    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {isNew ? "Add New Item" : "Edit Item"}
        </h3>
        {errors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={item.title}
              onChange={(e) => handleChange({ title: e.target.value })}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2 ${
                errors.includes("Title is required") ? "border-red-500" : ""
              }`}
              required
              aria-invalid={errors.includes("Title is required") ? "true" : "false"}
              aria-describedby={errors.includes("Title is required") ? "title-error" : undefined}
            />
            {errors.includes("Title is required") && (
              <p id="title-error" className="text-red-500 text-xs mt-1">
                Title is required
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Type *
            </label>
            <select
              id="type"
              value={item.type}
              onChange={(e) => handleChange({ type: e.target.value })}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2 ${
                errors.includes("Type is required") ? "border-red-500" : ""
              }`}
              required
              aria-invalid={errors.includes("Type is required") ? "true" : "false"}
              aria-describedby={errors.includes("Type is required") ? "type-error" : undefined}
            >
              <option value="news">News</option>
              <option value="event">Event</option>
            </select>
            {errors.includes("Type is required") && (
              <p id="type-error" className="text-red-500 text-xs mt-1">
                Type is required
              </p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content *
          </label>
          <textarea
            id="content"
            value={item.content}
            onChange={(e) => handleChange({ content: e.target.value })}
            rows={3}
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2 ${
              errors.includes("Content is required") ? "border-red-500" : ""
            }`}
            required
            aria-invalid={errors.includes("Content is required") ? "true" : "false"}
            aria-describedby={errors.includes("Content is required") ? "content-error" : undefined}
          ></textarea>
          {errors.includes("Content is required") && (
            <p id="content-error" className="text-red-500 text-xs mt-1">
              Content is required
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {item.type === "event" ? "Event Date *" : "Publish Date *"}
            </label>
            <input
              type="date"
              id="date"
              value={item.date}
              onChange={(e) => handleChange({ date: e.target.value })}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2 ${
                errors.includes("Date is required") ? "border-red-500" : ""
              }`}
              required
              aria-invalid={errors.includes("Date is required") ? "true" : "false"}
              aria-describedby={errors.includes("Date is required") ? "date-error" : undefined}
            />
            {errors.includes("Date is required") && (
              <p id="date-error" className="text-red-500 text-xs mt-1">
                Date is required
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="end_date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              End Date (Optional)
            </label>
            <input
              type="date"
              id="end_date"
              value={item.end_date}
              onChange={(e) => handleChange({ end_date: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
            />
          </div>
        </div>
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="isHighlighted"
            checked={item.isHighlighted}
            onChange={(e) => handleChange({ isHighlighted: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isHighlighted"
            className="ml-2 block text-sm text-gray-700"
          >
            Highlight this item
          </label>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center"
          >
            <X size={16} className="mr-1" /> Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 flex items-center"
          >
            <Check size={16} className="mr-1" /> Save
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          News & Events Manager
        </h1>
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
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {updateSuccess && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <div className="flex items-center">
            <Check className="h-5 w-5 mr-2" />
            <span>Operation completed successfully!</span>
          </div>
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
        <div className="flex justify-center items-center py-8">
          <RefreshCw className="h-8 w-8 text-purple-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading news and events...</span>
        </div>
      ) : newsEvents.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">News & Events</h2>
            <button
              onClick={handleAddNew}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors inline-flex items-center"
            >
              <Plus size={16} className="mr-1" /> Add New Item
            </button>
          </div>
          <div className="p-4 sm:p-6">
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
                          Title
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6"
                        >
                          Content
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
                      {newsEvents.map((item) =>
                        editingId === item.id ? (
                          <tr key={item.id}>
                            <td colSpan="5">
                              <ItemForm
                                initialItem={item}
                                onSave={handleSaveEdit}
                                onCancel={handleCancel}
                              />
                            </td>
                          </tr>
                        ) : (
                          <tr
                            key={item.id}
                            className={item.highlighted ? "bg-yellow-50" : ""}
                          >
                            <td className="px-3 py-4 sm:px-6">
                              <div className="text-xs sm:text-sm font-medium text-gray-900">
                                {item.title}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500">
                                {item.type === "event" ? "Event" : "News"}
                              </div>
                            </td>
                            <td className="px-3 py-4 sm:px-6">
                              <div className="text-xs sm:text-sm text-gray-900 max-w-[100px] sm:max-w-xs truncate">
                                {item.content}
                              </div>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 sm:px-6 hidden sm:table-cell">
                              {formatDate(item.date)}
                              {item.end_date && <br />}
                              {item.end_date && formatDate(item.end_date)}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap sm:px-6">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  item.highlighted
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {item.highlighted ? "Highlighted" : "Normal"}
                              </span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-xs sm:text-sm font-medium sm:px-6">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEdit(item.id)}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="Edit"
                                  aria-label={`Edit ${item.title}`}
                                >
                                  <Edit2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                                <button
                                  onClick={() => handleOpenDeleteModal(item.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete"
                                  aria-label={`Delete ${item.title}`}
                                >
                                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No news or events
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new news item or event.
          </p>
          <div className="mt-6">
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors inline-flex items-center"
            >
              <Plus size={16} className="mr-1" /> Add New Item
            </button>
          </div>
        </div>
      )}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}