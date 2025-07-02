"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  Image as ImageIcon,
} from "lucide-react";
import axios from "axios";
import DeleteModal from "../../components/DeleteModal";
import SaveModal from "../../components/SaveModal";
import ConfirmModal from "../../components/ConfirmModal";
import React from "react";

// ProductForm Component (Moved outside and memoized)
const ProductForm = React.memo(
  ({ product, onFieldChange, onImageChange, onSave, onCancel, isNew = false, preview, error }) => {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {isNew ? "Add New Product" : "Edit Product"}
        </h3>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                value={product.name}
                onChange={(e) => onFieldChange("name", e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
                required
                autoComplete="off"
                aria-required="true"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                value={product.description}
                onChange={(e) => onFieldChange("description", e.target.value)}
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
                required
                autoComplete="off"
                aria-required="true"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Release Date *
              </label>
              <input
                type="date"
                id="date"
                value={product.date}
                onChange={(e) => onFieldChange("date", e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
                required
                aria-required="true"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image {isNew ? "*" : ""}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Product preview"
                      className="mx-auto h-64 w-auto object-cover rounded-md"
                      onError={(e) =>
                        console.error("Preview image load error:", preview)
                      }
                      onLoad={() => console.log("Preview image loaded:", preview)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        onFieldChange("image", null);
                        onImageChange({ target: { files: [] } });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-700"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/png,image/jpeg,image/jpg,image/gif"
                          onChange={onImageChange}
                          required={isNew}
                          aria-required={isNew ? "true" : "false"}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600"
          >
            Save
          </button>
        </div>
      </div>
    );
  }
);

export default function NewArrivalsManager() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({
    confirm: false,
    save: false,
    delete: false,
    deleteId: null,
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    image: null,
    date: new Date().toISOString().split("T")[0],
  });

  const API_BASE_URL = "http://localhost:8000";

  // Normalize image URLs
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.svg";
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))
      return imageUrl;
    if (imageUrl.startsWith("/static/")) return `${API_BASE_URL}${imageUrl}`;
    if (!imageUrl.includes("/"))
      return `${API_BASE_URL}/static/new_arrivals/${imageUrl}`;
    return imageUrl;
  };

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("No authToken found, redirecting to login");
        window.location.href = "/login";
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/admin/new-arrivals`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 100 },
      });
      const fetchedProducts = Array.isArray(response.data)
        ? response.data.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            date: product.release_date.split("T")[0],
            image: null,
            imageUrl: getImageUrl(product.image_url),
          }))
        : [];
      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Fetch Products Error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("adminAuth");
        window.location.href = "/login";
      }
      setError(err.response?.data?.detail || "Failed to load products");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle add new product
  const handleAddNew = useCallback(() => {
    setIsAddingNew(true);
    setEditingId(null);
    setNewProduct({
      name: "",
      description: "",
      image: null,
      date: new Date().toISOString().split("T")[0],
    });
    setImagePreview(null);
    setError(null);
  }, []);

  // Handle image change
  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", {
        name: file.name,
        size: file.size / 1024 / 1024, // MB
        type: file.type,
      });
      if (
        !["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(file.type)
      ) {
        setError("Please upload a PNG, JPG, or GIF image");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size must be less than 10MB");
        return;
      }
      setNewProduct((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("Image preview generated:", reader.result?.slice(0, 50) + "...");
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setNewProduct((prev) => ({ ...prev, image: null }));
      setImagePreview(null);
    }
  }, []);

  // Handle field change
  const handleFieldChange = useCallback((field, value) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  // Validate form
  const validateForm = () => {
    const errors = [];
    if (!newProduct.name) errors.push("Product Name is required");
    if (!newProduct.description) errors.push("Description is required");
    if (!newProduct.date) errors.push("Release Date is required");
    if (isAddingNew && !newProduct.image) errors.push("Product Image is required");
    return errors.length > 0 ? errors.join(", ") : null;
  };

  // Handle save (add or edit)
  const handleSaveNew = useCallback(async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setModalState((prev) => ({ ...prev, confirm: true }));
  }, [newProduct, isAddingNew]);

  const handleSaveEdit = useCallback(async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setModalState((prev) => ({ ...prev, confirm: true }));
  }, [newProduct, editingId]);

  // Confirm save action
  const handleConfirmSave = useCallback(async () => {
    setModalState((prev) => ({ ...prev, confirm: false }));
    setIsLoading(true);
    setError(null);

    const isEditing = !!editingId;
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("release_date", newProduct.date);
    if (newProduct.image) {
      formData.append("image", newProduct.image);
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authToken found");
      }

      const formDataEntries = {};
      for (let [key, value] of formData.entries()) {
        formDataEntries[key] = value instanceof File ? value.name : value;
      }
      console.log(
        `Sending ${isEditing ? "Edit" : "New"} Arrival FormData:`,
        formDataEntries
      );

      const url = isEditing
        ? `${API_BASE_URL}/admin/new-arrivals/${editingId}`
        : `${API_BASE_URL}/admin/new-arrivals`;
      const method = isEditing ? axios.put : axios.post;

      const response = await method(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      const updatedProduct = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        date: response.data.release_date.split("T")[0],
        image: null,
        imageUrl: getImageUrl(response.data.image_url),
      };

      setProducts((prev) =>
        isEditing
          ? prev.map((item) =>
              item.id === editingId ? updatedProduct : item
            )
          : [updatedProduct, ...prev]
      );
      setNewProduct({
        name: "",
        description: "",
        image: null,
        date: new Date().toISOString().split("T")[0],
      });
      setImagePreview(null);
      setIsAddingNew(false);
      setEditingId(null);
      setModalState((prev) => ({ ...prev, save: true }));
    } catch (err) {
      console.error(`Error ${isEditing ? "updating" : "creating"} product:`, {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        headers: err.response?.headers,
      });

      let errorMessage = `Failed to ${isEditing ? "update" : "add"} product`;
      if (err.response?.status === 401) {
        errorMessage = "Session expired. Please log in again.";
        localStorage.removeItem("authToken");
        localStorage.removeItem("adminAuth");
        window.location.href = "/login";
      } else if (err.response?.status === 422) {
        const details = err.response?.data?.detail;
        errorMessage =
          details && Array.isArray(details)
            ? details.map((d) => `${d.loc.join(".")}: ${d.msg}`).join("; ")
            : "Invalid input data. Check all fields.";
      } else if (err.response?.status === 413) {
        errorMessage = "Image size too large. Please use a smaller image.";
      } else if (err.response?.status === 500) {
        errorMessage =
          err.response?.data?.detail || "Server error. Please try again.";
      } else if (err.message === "Network Error") {
        errorMessage =
          "Cannot connect to server. Check your connection or server status.";
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Your image may be too large.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [newProduct, editingId]);

  // Handle edit
  const handleEdit = useCallback((id) => {
    const productToEdit = products.find((item) => item.id === id);
    if (productToEdit) {
      setEditingId(id);
      setNewProduct({
        name: productToEdit.name,
        description: productToEdit.description,
        image: null,
        date: productToEdit.date,
      });
      setImagePreview(productToEdit.imageUrl || null);
      setIsAddingNew(false);
      setError(null);
      console.log("Editing product, imageUrl:", productToEdit.imageUrl);
    }
  }, [products]);

  // Handle delete
  const handleDelete = useCallback((id) => {
    setModalState((prev) => ({ ...prev, delete: true, deleteId: id }));
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    const id = modalState.deleteId;
    setModalState((prev) => ({ ...prev, delete: false, deleteId: null }));
    if (id) {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authToken found");
        }

        await axios.delete(`${API_BASE_URL}/admin/new-arrivals/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Delete Product Error:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });

        let errorMessage = "Failed to delete product";
        if (err.response?.status === 401) {
          errorMessage = "Session expired. Please log in again.";
          localStorage.removeItem("authToken");
          localStorage.removeItem("adminAuth");
          window.location.href = "/login";
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  }, [modalState.deleteId]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setIsAddingNew(false);
    setEditingId(null);
    setNewProduct({
      name: "",
      description: "",
      image: null,
      date: new Date().toISOString().split("T")[0],
    });
    setImagePreview(null);
    setError(null);
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Render
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          New Arrivals Manager
        </h1>
        <div className="flex space-x-3">
          {!isLoading && !error && (
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center"
            >
              <RefreshCw size={16} className="mr-1" /> Refresh
            </button>
          )}
          <button
            onClick={handleAddNew}
            disabled={isAddingNew || editingId !== null}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} className="mr-1" /> Add New Product
          </button>
        </div>
      </div>

      {error && !isAddingNew && !editingId && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {(isAddingNew || editingId !== null) && (
        <ProductForm
          key={editingId || "new"} // Ensure stable key
          product={newProduct}
          onFieldChange={handleFieldChange}
          onImageChange={handleImageChange}
          onSave={isAddingNew ? handleSaveNew : handleSaveEdit}
          onCancel={handleCancel}
          isNew={isAddingNew}
          preview={imagePreview}
          error={error}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 text-purple-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) =>
            editingId === product.id ? (
              <ProductForm
                key={product.id}
                product={newProduct}
                onFieldChange={handleFieldChange}
                onImageChange={handleImageChange}
                onSave={handleSaveEdit}
                onCancel={handleCancel}
                preview={imagePreview}
                error={error}
              />
            ) : (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Product image load error:", product.imageUrl);
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                    onLoad={() =>
                      console.log("Product image loaded:", product.imageUrl)
                    }
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-2">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Released on {formatDate(product.date)}
                  </p>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {product.description}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Edit"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No products</h3>
          <p className="mt-1 text-gray-500">
            Get started by adding a new product.
          </p>
          <div className="mt-6">
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors inline-flex items-center"
            >
              <Plus size={16} className="mr-1" /> Add New Product
            </button>
          </div>
        </div>
      )}
      <DeleteModal
        isOpen={modalState.delete}
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setModalState((prev) => ({ ...prev, delete: false, deleteId: null }))
        }
      />
      <SaveModal
        isOpen={modalState.save}
        onClose={() => setModalState((prev) => ({ ...prev, save: false }))}
      />
      <ConfirmModal
        isOpen={modalState.confirm}
        onConfirm={handleConfirmSave}
        onCancel={() =>
          setModalState((prev) => ({ ...prev, confirm: false }))
        }
      />
    </div>
  );
}