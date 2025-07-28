"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  Upload,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import DeleteModal from "../../components/DeleteModal";
import SaveModal from "../../components/SaveModal";
import ConfirmModal from "../../components/ConfirmModal";
import React from "react";

const ProductForm = React.memo(
  ({ product, onFieldChange, onImageChange, onSave, onCancel, isNew = false, preview, error }) => {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          {isNew ? "Add New Product" : "Edit Product"}
        </h3>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
            <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                value={product.name}
                onChange={(e) => onFieldChange("name", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter product name"
                required
                autoComplete="off"
                aria-required="true"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={product.description}
                onChange={(e) => onFieldChange("description", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                placeholder="Enter product description"
                required
                autoComplete="off"
                aria-required="true"
              />
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Release Date *
              </label>
              <input
                type="date"
                id="date"
                value={product.date}
                onChange={(e) => onFieldChange("date", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                required
                aria-required="true"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image {isNew ? "*" : ""}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-400 transition-colors">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Product preview"
                    className="mx-auto h-64 w-auto object-cover rounded-lg"
                    onError={(e) => {
                      console.error("Preview image load error:", preview);
                      e.currentTarget.src = "/placeholder.svg?height=200&width=200&text=Product";
                      e.currentTarget.onerror = null;
                    }}
                    onLoad={() => console.log("Preview image loaded:", preview)}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onFieldChange("image", null);
                      onImageChange({ target: { files: [] } });
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <label className="cursor-pointer bg-red-500 text-white rounded-lg px-6 py-3 font-medium hover:bg-red-600 transition-colors inline-block">
                      Upload Image {isNew ? "*" : ""}
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/png,image/jpeg,image/jpg,image/gif"
                        onChange={onImageChange}
                        required={isNew}
                        aria-required={isNew ? "true" : "false"}
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
          >
            Save Product
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

  const API_BASE_URL = "https://paintcompanybackend.onrender.com";

  // Normalize image URLs
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.svg?height=200&width=300&text=Product";
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">New Arrivals</h1>
            <p className="text-gray-600 mt-1">Showcase your latest paint products</p>
          </div>
          <div className="flex space-x-3">
            {!isLoading && !error && (
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center"
              >
                <RefreshCw size={16} className="mr-2" /> Refresh
              </button>
            )}
            <button
              onClick={handleAddNew}
              disabled={isAddingNew || editingId !== null}
              className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Plus size={16} className="mr-2" />
              Add Product
            </button>
          </div>
        </div>

        {error && !isAddingNew && !editingId && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center">
            <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
            <span>{error}</span>
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
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 text-red-500 animate-spin mx-auto" />
              <p className="text-gray-600 mt-4">Loading products...</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Product image load error:", product.imageUrl);
                      e.currentTarget.src = "/placeholder.svg?height=200&width=300&text=Product";
                      e.currentTarget.onerror = null;
                    }}
                    onLoad={() =>
                      console.log("Product image loaded:", product.imageUrl)
                    }
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Released on {formatDate(product.date)}</span>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {product.description}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first new arrival.</p>
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors inline-flex items-center font-medium"
            >
              <Plus size={16} className="mr-2" />
              Add Product
            </button>
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
          message="Product saved successfully! ✅"
        />
        <ConfirmModal
          isOpen={modalState.confirm}
          onConfirm={handleConfirmSave}
          onCancel={() =>
            setModalState((prev) => ({ ...prev, confirm: false }))
          }
        />
      </div>
    </div>
  );
}