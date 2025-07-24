"use client";

import { useState, useEffect } from "react";
import { Star, Plus, Edit2, Trash2, RefreshCw, AlertTriangle } from "lucide-react";
import axios from "axios";
import DeleteModal from "../../components/DeleteModal";
import SaveModal from "../../components/SaveModal";
import ConfirmModal from "../../components/ConfirmModal";

function ProductForm({
  product,
  onInputChange,
  onImageChange,
  onFeatureInputChange,
  onSave,
  onCancel,
  isNew = false,
  preview,
  error,
  setImagePreview,
  featuresInput,
  setFeaturesInput,
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        {isNew ? "Add New Popular Product" : "Edit Popular Product"}
      </h3>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              value={product.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Product Type *
            </label>
            <select
              id="type"
              value={product.type}
              onChange={(e) => onInputChange("type", e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
              required
            >
              <option value="" disabled>
                Select a type
              </option>
              <option value="Interior">Interior</option>
              <option value="Exterior">Exterior</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={product.description}
              onChange={(e) => onInputChange("description", e.target.value)}
              rows="3"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">
              Features * (comma or newline separated)
            </label>
            <input
              type="text"
              id="features"
              value={featuresInput}
              onChange={(e) => {
                setFeaturesInput(e.target.value);
                onFeatureInputChange(e);
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
              placeholder="e.g. Weather Resistance, Low VOC, Durable"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
              Rating (1-5) *
            </label>
            <div className="flex items-center">
              <input
                type="range"
                id="rating"
                min="1"
                max="5"
                step="0.1"
                value={product.rating}
                onChange={(e) => onInputChange("rating", Number.parseFloat(e.target.value))}
                className="block w-full"
              />
              <span className="ml-2 flex items-center">
                <span className="text-lg font-medium">{product.rating.toFixed(1)}</span>
                <Star className="h-5 w-5 text-yellow-400 ml-1" />
              </span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Image *</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-purple-500 transition-colors">
            <div className="space-y-1 text-center">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Product preview"
                    className="mx-auto h-64 w-auto object-cover rounded-md"
                  />
                  <div className="absolute bottom-2 right-2 flex space-x-2">
                    <label
                      htmlFor="file-upload-replace"
                      className="cursor-pointer bg-blue-500 text-white rounded-md px-2 py-1 text-xs hover:bg-blue-600 transition-colors"
                    >
                      Replace
                      <input
                        id="file-upload-replace"
                        name="file-upload-replace"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => onImageChange(e)}
                        required
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        onInputChange("image", null);
                        setImagePreview(null);
                      }}
                      className="bg-red-500 text-white rounded-md px-2 py-1 text-xs hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
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
                  <div className="flex flex-col items-center mt-4">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer bg-popPurple text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-purple-700 transition-colors"
                    >
                      Upload Image *
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => onImageChange(e)}
                        required
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                    <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
                  </div>
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
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-popRed hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default function PopularProductManager() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [pendingSaveAction, setPendingSaveAction] = useState(null);
  const [featuresInput, setFeaturesInput] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: "",
    type: "",
    description: "",
    features: [],
    rating: 4.0,
    image: null,
  });
  const API_BASE_URL = "https://paintcompanybackend.onrender.com";

  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  const getHeaders = (isFormData = false) => {
    const token = getAuthToken();
    console.log("Auth token:", token); // Log token for debugging
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    return { headers };
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.svg";

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    if (imageUrl.startsWith("/static/")) {
      return `${API_BASE_URL}${imageUrl}`;
    }

    if (!imageUrl.includes("/")) {
      return `${API_BASE_URL}/static/popular_products/${imageUrl}`;
    }

    return imageUrl;
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/popular-products`, getHeaders());
      let fetchedProducts = [];
      if (response.data && Array.isArray(response.data)) {
        fetchedProducts = response.data.map((product) => ({
          id: product.id,
          name: product.name,
          type: product.type,
          description: product.description,
          features: Array.isArray(product.features) ? product.features : [],
          rating: product.rating || 4.0,
          image: getImageUrl(product.image_url),
        }));
      } else if (response.data && response.data.items) {
        fetchedProducts = response.data.items.map((product) => ({
          id: product.id,
          name: product.name,
          type: product.type,
          description: product.description,
          features: Array.isArray(product.features) ? product.features : [],
          rating: product.rating || 4.0,
          image: getImageUrl(product.image_url),
        }));
      }
      console.log("Fetched products:", fetchedProducts); // Log products for debugging
      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Error fetching products:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      setError("Failed to load products. Please check if the server is running and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewProduct({
      name: "",
      type: "",
      description: "",
      features: [],
      rating: 4.0,
      image: null,
    });
    setFeaturesInput("");
    setImagePreview(null);
    setError(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProduct((prevState) => ({ ...prevState, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setNewProduct((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleFeatureInputChange = (e) => {
    const input = e.target.value;
    console.log("Features input:", input);
    const features = input
      .split(/[,\n]/)
      .map((feature) => feature.trim())
      .filter((feature) => feature.length > 0);
    console.log("Processed features:", features);
    setNewProduct((prevState) => ({ ...prevState, features }));
  };

  const handleOpenConfirmModal = (action) => {
    setPendingSaveAction(() => action);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSave = () => {
    setIsConfirmModalOpen(false);
    if (pendingSaveAction) {
      pendingSaveAction();
    }
    setPendingSaveAction(null);
  };

  const handleCancelConfirm = () => {
    setIsConfirmModalOpen(false);
    setPendingSaveAction(null);
  };

  const handleSaveNew = async () => {
    if (!newProduct.name || newProduct.features.length === 0 || !newProduct.image || !newProduct.type) {
      setError("Please fill in all required fields (Name, Type, Features, Image).");
      return;
    }

    handleOpenConfirmModal(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("type", newProduct.type);
        formData.append("description", newProduct.description || "");
        formData.append("features", JSON.stringify(newProduct.features));
        formData.append("rating", newProduct.rating.toString());
        if (newProduct.image) {
          formData.append("image", newProduct.image);
        }
        console.log("Saving new product with features:", newProduct.features);
        const response = await axios.post(
          `${API_BASE_URL}/admin/popular-products/`,
          formData,
          getHeaders(true)
        );

        const createdProduct = {
          id: response.data.id,
          name: response.data.name,
          type: response.data.type,
          description: response.data.description,
          features: Array.isArray(response.data.features) ? response.data.features : [],
          rating: response.data.rating || 4.0,
          image: getImageUrl(response.data.image_url),
        };

        setProducts([createdProduct, ...products]);
        setIsAddingNew(false);
        setNewProduct({
          name: "",
          type: "",
          description: "",
          features: [],
          rating: 4.0,
          image: null,
        });
        setFeaturesInput("");
        setImagePreview(null);
        setIsSaveModalOpen(true);
        await fetchProducts(); // Refresh product list
      } catch (err) {
        console.error("Error creating product:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        setError(err.response?.data?.detail || "Failed to create product. Please try again.");
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleEdit = (id) => {
    const productToEdit = products.find((item) => item.id === id);
    if (productToEdit) {
      setEditingId(id);
      setNewProduct({
        ...productToEdit,
        image: null,
      });
      setFeaturesInput(productToEdit.features.join(", "));
      setImagePreview(productToEdit.image);
      setError(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!newProduct.name || newProduct.features.length === 0 || !newProduct.type) {
      setError("Please fill in all required fields (Name, Type, Features).");
      return;
    }

    handleOpenConfirmModal(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("type", newProduct.type);
        formData.append("description", newProduct.description || "");
        formData.append("features", JSON.stringify(newProduct.features));
        formData.append("rating", newProduct.rating.toString());
        if (newProduct.image) {
          formData.append("image", newProduct.image);
        }

        console.log("Updating product with ID:", editingId);
        console.log("Request URL:", `${API_BASE_URL}/admin/popular-products/${editingId}/`);
        console.log("FormData:", [...formData.entries()]);

        const response = await axios.put(
          `${API_BASE_URL}/admin/popular-products/${editingId}/`,
          formData,
          getHeaders(true)
        );

        const updatedProduct = {
          id: response.data.id,
          name: response.data.name,
          type: response.data.type,
          description: response.data.description,
          features: Array.isArray(response.data.features) ? response.data.features : [],
          rating: response.data.rating || 4.0,
          image: getImageUrl(response.data.image_url),
        };

        setProducts(
          products.map((item) => (item.id === editingId ? updatedProduct : item))
        );
        setEditingId(null);
        setNewProduct({
          name: "",
          type: "",
          description: "",
          features: [],
          rating: 4.0,
          image: null,
        });
        setFeaturesInput("");
        setImagePreview(null);
        setIsSaveModalOpen(true);
        await fetchProducts(); // Refresh product list
      } catch (err) {
        console.error("Error updating product:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        setError(err.response?.data?.detail || "Failed to update product. Please try again.");
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleOpenDeleteModal = (id) => {
    const cleanId = Number(String(id).split(':')[0]); // Clean ID
    setProductIdToDelete(cleanId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    if (productIdToDelete) {
      await handleDelete(productIdToDelete);
      setProductIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProductIdToDelete(null);
  };

  const handleCloseSaveModal = () => {
    setIsSaveModalOpen(false);
  };

  const handleDelete = async (id) => {
    const cleanId = Number(String(id).split(':')[0]); // Clean ID
    const url = `${API_BASE_URL}/admin/popular-products/${cleanId}`;
    console.log("Deleting product with ID:", cleanId, "URL:", url); // Log for debugging
    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(url, getHeaders());
      setProducts(products.filter((item) => item.id !== cleanId));
    } catch (err) {
      console.error("Delete error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        url: url
      });
      setError(err.response?.data?.detail || "Failed to delete product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setNewProduct({
      name: "",
      type: "",
      description: "",
      features: [],
      rating: 4.0,
      image: null,
    });
    setFeaturesInput("");
    setImagePreview(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold text-gray-800">Popular Products Manager</h1>
        <div className="flex space-x-2">
          {!isLoading && !isAddingNew && editingId === null && (
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
            className="px-4 py-2 bg-popRed text-white rounded-md hover:bg-red-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} className="mr-1" /> Add Popular Product
          </button>
        </div>
      </div>
      {error && !isAddingNew && editingId === null && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
          <button
            onClick={fetchProducts}
            className="ml-auto px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
          >
            <RefreshCw size={14} className="mr-1" /> Retry
          </button>
        </div>
      )}
      {isAddingNew && (
        <ProductForm
          product={newProduct}
          onInputChange={handleInputChange}
          onImageChange={handleImageChange}
          onFeatureInputChange={handleFeatureInputChange}
          onSave={handleSaveNew}
          onCancel={handleCancel}
          isNew={true}
          preview={imagePreview}
          error={error}
          setImagePreview={setImagePreview}
          featuresInput={featuresInput}
          setFeaturesInput={setFeaturesInput}
        />
      )}
      {isLoading && !isAddingNew && editingId === null ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 text-popPurple animate-spin" />
          <span className="ml-2 text-gray-600">Loading popular products...</span>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) =>
            editingId === product.id ? (
              <ProductForm
                key={product.id}
                product={newProduct}
                onInputChange={handleInputChange}
                onImageChange={handleImageChange}
                onFeatureInputChange={handleFeatureInputChange}
                onSave={handleSaveEdit}
                onCancel={handleCancel}
                preview={imagePreview}
                error={error}
                setImagePreview={setImagePreview}
                featuresInput={featuresInput}
                setFeaturesInput={setFeaturesInput}
              />
            ) : (
              <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 p-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-auto object-cover rounded-md"
                      onError={(e) => {
                        console.log("Image failed to load:", product.image);
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                        <p className="text-gray-600 text-sm">{product.type}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 mr-1" />
                        <span className="font-medium">{parseFloat(product.rating).toFixed(1)}/5</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2">{product.description}</p>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700">Features:</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {product.features.map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(Number(product.id))} // Ensure clean ID
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Star className="h-12 w-12 text-yellow-400 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No popular products</h3>
          <p className="mt-1 text-gray-500">Get started by adding a popular product.</p>
          <div className="mt-6">
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-popRed text-white rounded-md hover:bg-red-600 transition-colors inline-flex items-center"
            >
              <Plus size={16} className="mr-1" /> Add Popular Product
            </button>
          </div>
        </div>
      )}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <SaveModal
        isOpen={isSaveModalOpen}
        onClose={handleCloseSaveModal}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onConfirm={handleConfirmSave}
        onCancel={handleCancelConfirm}
      />
    </div>
  );
}