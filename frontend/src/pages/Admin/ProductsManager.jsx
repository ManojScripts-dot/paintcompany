"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Filter, RefreshCw, Layers, AlertTriangle } from "lucide-react";
import axios from "axios";
import PropTypes from "prop-types";
import DeleteModal from "../../components/DeleteModal";
import SaveModal from "../../components/SaveModal";
import ConfirmModal from "../../components/ConfirmModal";

const ProductForm = ({
  product,
  onChange,
  onImageChange,
  onFeatureInputChange,
  onSave,
  onCancel,
  isNew = false,
  preview,
  categories,
  setImagePreview,
  featuresInput,
  setFeaturesInput,
  error,
}) => {
  const fileInputRef = useRef(null);

  const getPriceFields = (category) => {
    if (category === "Silver/Copper/Gold") {
      return [
        { id: "price1kg", label: "Price (1 kg)", placeholder: "e.g. Rs. 2000" },
        { id: "price500g", label: "Price (500 g)", placeholder: "e.g. Rs. 1100" },
        { id: "price200g", label: "Price (200 g)", placeholder: "e.g. Rs. 500" },
        { id: "price100g", label: "Price (100 g)", placeholder: "e.g. Rs. 300" },
        { id: "price50g", label: "Price (50 g)", placeholder: "e.g. Rs. 180" },
      ];
    } else if (["Metal and Wood Primer", "Metal and Wood Enamel", "Aluminium Paints"].includes(category)) {
      return [
        { id: "price20l", label: "Price (20 Ltr)", placeholder: "e.g. Rs. 8,500" },
        { id: "price4l", label: "Price (4 Ltr)", placeholder: "e.g. Rs. 1,800" },
        { id: "price1l", label: "Price (1 Ltr)", placeholder: "e.g. Rs. 500" },
        { id: "price500ml", label: "Price (500 ml)", placeholder: "e.g. Rs. 300" },
        { id: "price200ml", label: "Price (200 ml)", placeholder: "e.g. Rs. 150" },
      ];
    } else if (category === "Distemper") {
      return [
        { id: "price1l", label: "Price (1 Ltr)", placeholder: "e.g. Rs. 500" },
        { id: "price5l", label: "Price (5 Ltr)", placeholder: "e.g. Rs. 1,800" },
        { id: "price10l", label: "Price (10 Ltr)", placeholder: "e.g. Rs. 4,500" },
        { id: "price20l", label: "Price (20 Ltr)", placeholder: "e.g. Rs. 8,500" },
      ];
    } else {
      return [
        { id: "price1l", label: "Price (1 Ltr)", placeholder: "e.g. Rs. 500" },
        { id: "price4l", label: "Price (4 Ltr)", placeholder: "e.g. Rs. 1,800" },
        { id: "price10l", label: "Price (10 Ltr)", placeholder: "e.g. Rs. 4,500" },
        { id: "price20l", label: "Price (20 Ltr)", placeholder: "e.g. Rs. 8,500" },
      ];
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">{isNew ? "Add New Product" : "Edit Product"}</h3>
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
              onChange={(e) => onChange({ ...product, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              value={product.category}
              onChange={(e) => onChange({ ...product, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={product.description}
              onChange={(e) => onChange({ ...product, description: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">
              Features
            </label>
            <input
              type="text"
              id="features"
              value={featuresInput}
              onChange={(e) => {
                setFeaturesInput(e.target.value);
                onFeatureInputChange(e);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="e.g. Weather Resistance, Low VOC, Durable"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {getPriceFields(product.category).map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                <input
                  type="text"
                  id={field.id}
                  value={product[field.id] || ""}
                  onChange={(e) => onChange({ ...product, [field.id]: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Image {isNew ? "*" : ""}</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-400 transition-colors">
            {preview ? (
              <div className="relative">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Product preview"
                  className="mx-auto h-64 w-auto object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=200&width=200&text=Product"
                    e.currentTarget.onerror = null
                  }}
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <label className="cursor-pointer bg-blue-500 text-white rounded-lg px-3 py-1 text-sm hover:bg-blue-600 transition-colors">
                    Replace
                    <input type="file" className="sr-only" accept="image/*" onChange={(e) => onImageChange(e)} />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      onChange({ ...product, image: null })
                      setImagePreview(null)
                    }}
                    className="bg-red-500 text-white rounded-lg px-3 py-1 text-sm hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
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
                <div>
                  <label className="cursor-pointer bg-red-500 text-white rounded-lg px-6 py-3 font-medium hover:bg-red-600 transition-colors inline-block">
                    Upload Image {isNew ? "*" : ""}
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => onImageChange(e)}
                      required={isNew}
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
};

ProductForm.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.string),
    price1l: PropTypes.string,
    price4l: PropTypes.string,
    price5l: PropTypes.string,
    price10l: PropTypes.string,
    price20l: PropTypes.string,
    price500ml: PropTypes.string,
    price200ml: PropTypes.string,
    price1kg: PropTypes.string,
    price500g: PropTypes.string,
    price200g: PropTypes.string,
    price100g: PropTypes.string,
    price50g: PropTypes.string,
    stock: PropTypes.string,
    image: PropTypes.any,
    image_url: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onImageChange: PropTypes.func.isRequired,
  onFeatureInputChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isNew: PropTypes.bool,
  preview: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  setImagePreview: PropTypes.func.isRequired,
  featuresInput: PropTypes.string.isRequired,
  setFeaturesInput: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveModalMessage, setSaveModalMessage] = useState("Product added successfully.✅");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingSaveAction, setPendingSaveAction] = useState(null);
  const [featuresInput, setFeaturesInput] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    features: [],
    price1l: "",
    price4l: "",
    price5l: "",
    price10l: "",
    price20l: "",
    price500ml: "",
    price200ml: "",
    price1kg: "",
    price500g: "",
    price200g: "",
    price100g: "",
    price50g: "",
    stock: "In Stock",
    image: null,
    image_url: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://paintcompanybackend.onrender.com";
  const token = localStorage.getItem("authToken");

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

  const categories = [
    "Primer",
    "Emulsion",
    "Distemper",
    "Metal and Wood Primer",
    "Metal and Wood Enamel",
    "Aluminium Paints",
    "Silver/Copper/Gold",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError("");
      try {
        let allProducts = [];
        let url = `${API_BASE_URL}/admin/products/`;
        const params = { limit: 100 };

        while (url) {
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params,
          });

          console.log("API Response:", response.data);

          if (response.status === 200) {
            const products = Array.isArray(response.data)
              ? response.data
              : response.data.results || [];
            allProducts = [...allProducts, ...products];
            url = response.data.next || null;
          } else {
            setError("Failed to fetch products");
            break;
          }
        }

        console.log("Total products fetched:", allProducts.length);
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            setError("Unauthorized access. Please log in again.");
            window.location.href = "/login";
          } else {
            setError(`Server error: ${error.response.data.detail || "Unknown error"}`);
          }
        } else if (error.request) {
          setError("No response from server. Please check your connection.");
        } else {
          setError("An error occurred while fetching products.");
        }
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchProducts();
    } else {
      setError("Please log in to access this page.");
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let results = products;

    if (filterCategory !== "all") {
      results = results.filter((product) => product.category.toLowerCase() === filterCategory.toLowerCase());
    }

    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(lowercasedSearch) ||
          (product.description && product.description.toLowerCase().includes(lowercasedSearch)) ||
          product.category.toLowerCase().includes(lowercasedSearch),
      );
    }

    console.log("Filtered products:", results.length);
    setFilteredProducts(results);
  }, [searchTerm, filterCategory, products]);

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewProduct({
      name: "",
      category: "",
      description: "",
      features: [],
      price1l: "",
      price4l: "",
      price5l: "",
      price10l: "",
      price20l: "",
      price500ml: "",
      price200ml: "",
      price1kg: "",
      price500g: "",
      price200g: "",
      price100g: "",
      price50g: "",
      stock: "In Stock",
      image: null,
      image_url: "",
    });
    setFeaturesInput("");
    setImagePreview(null);
    setError("");
  };

  const handleImageChange = (e) => {
    try {
      console.log("handleImageChange triggered");
      const file = e.target.files[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          setError("Image file is too large. Maximum size is 10MB.");
          return;
        }
        if (!file.type.startsWith("image/")) {
          setError("Please upload a valid image file (PNG, JPG, GIF).");
          return;
        }
        console.log("Selected file:", file.name);
        setNewProduct({ ...newProduct, image: file, image_url: "" });
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log("FileReader result:", reader.result);
          setImagePreview(reader.result);
        };
        reader.onerror = (error) => {
          console.error("FileReader error:", error);
          setError("Failed to read the image file.");
        };
        reader.readAsDataURL(file);
      } else {
        console.log("No file selected");
      }
    } catch (error) {
      console.error("Error in handleImageChange:", error);
      setError("An error occurred while processing the image.");
    }
  };

  const handleFeatureInputChange = (e) => {
    const input = e.target.value;
    const features = input
      .split(",")
      .map((feature) => feature.trim())
      .filter((feature) => feature.length > 0);
    setNewProduct({ ...newProduct, features });
  };

  const handleSaveNew = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.image) {
      setError("Please fill in all required fields (Name, Category, Image).");
      return;
    }

    handleOpenConfirmModal(async () => {
      setIsLoading(true);
      setError("");
      try {
        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("category", newProduct.category);
        formData.append("description", newProduct.description || "");
        formData.append("features", JSON.stringify(newProduct.features));
        formData.append("price1l", newProduct.price1l || "");
        formData.append("price4l", newProduct.price4l || "");
        formData.append("price5l", newProduct.price5l || "");
        formData.append("price10l", newProduct.price10l || "");
        formData.append("price20l", newProduct.price20l || "");
        formData.append("price500ml", newProduct.price500ml || "");
        formData.append("price200ml", newProduct.price200ml || "");
        formData.append("price1kg", newProduct.price1kg || "");
        formData.append("price500g", newProduct.price500g || "");
        formData.append("price200g", newProduct.price200g || "");
        formData.append("price100g", newProduct.price100g || "");
        formData.append("price50g", newProduct.price50g || "");
        formData.append("stock", newProduct.stock);
        if (newProduct.image) {
          formData.append("image", newProduct.image);
        }

        console.log("Saving new product:", [...formData.entries()]);

        const response = await axios.post(`${API_BASE_URL}/admin/products/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Saved product:", response.data);

        if (response.status === 201) {
          const updatedProducts = [response.data, ...products];
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
          setIsAddingNew(false);
          setNewProduct({
            name: "",
            category: "",
            description: "",
            features: [],
            price1l: "",
            price4l: "",
            price5l: "",
            price10l: "",
            price20l: "",
            price500ml: "",
            price200ml: "",
            price1kg: "",
            price500g: "",
            price200g: "",
            price100g: "",
            price50g: "",
            stock: "In Stock",
            image: null,
            image_url: "",
          });
          setFeaturesInput("");
          setImagePreview(null);
          setSaveModalMessage("Product added successfully.✅");
          setIsSaveModalOpen(true);
        } else {
          setError("Failed to add product");
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            setError("Unauthorized access. Please log in again.");
            window.location.href = "/login";
          } else {
            setError(`Server error: ${error.response.data.detail || "Unknown error"}`);
          }
        } else if (error.request) {
          setError("No response from server. Please check your connection.");
        } else {
          setError("An error occurred while adding the product.");
        }
        console.error("Error adding product:", error);
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleEdit = (id) => {
    const productToEdit = products.find((item) => item.id === id);
    if (productToEdit) {
      setEditingId(id);
      let features = [];
      try {
        features = Array.isArray(productToEdit.features)
          ? productToEdit.features
          : typeof productToEdit.features === "string"
          ? JSON.parse(productToEdit.features)
          : [];
        features = features.filter((feature) => typeof feature === "string" && feature.length > 0);
      } catch (e) {
        console.error(`Error parsing features for product ${productToEdit.name}:`, e);
        features = [];
      }
      setNewProduct({
        ...productToEdit,
        features,
        price5l: productToEdit.price5l || "",
        image: null,
        image_url: productToEdit.image_url || "",
      });
      setFeaturesInput(features.join(", "));
      setImagePreview(getImageUrl(productToEdit.image_url));
      setError("");
    }
  };

  const handleSaveEdit = async () => {
    if (!newProduct.name || !newProduct.category) {
      setError("Please fill in all required fields (Name, Category).");
      return;
    }

    handleOpenConfirmModal(async () => {
      setIsLoading(true);
      setError("");
      try {
        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("category", newProduct.category);
        formData.append("description", newProduct.description || "");
        formData.append("features", JSON.stringify(newProduct.features));
        formData.append("price1l", newProduct.price1l || "");
        formData.append("price4l", newProduct.price4l || "");
        formData.append("price5l", newProduct.price5l || "");
        formData.append("price10l", newProduct.price10l || "");
        formData.append("price20l", newProduct.price20l || "");
        formData.append("price500ml", newProduct.price500ml || "");
        formData.append("price200ml", newProduct.price200ml || "");
        formData.append("price1kg", newProduct.price1kg || "");
        formData.append("price500g", newProduct.price500g || "");
        formData.append("price200g", newProduct.price200g || "");
        formData.append("price100g", newProduct.price100g || "");
        formData.append("price50g", newProduct.price50g || "");
        formData.append("stock", newProduct.stock);
        if (newProduct.image) {
          formData.append("image", newProduct.image);
        }

        console.log("Updating product with ID:", editingId);
        console.log("Request URL:", `${API_BASE_URL}/admin/products/${editingId}`);
        console.log("FormData:", [...formData.entries()]);

        const response = await axios.put(`${API_BASE_URL}/admin/products/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Updated product:", response.data);

        if (response.status === 200) {
          const updatedProducts = products.map((item) => (item.id === editingId ? response.data : item));
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
          setEditingId(null);
          setNewProduct({
            name: "",
            category: "",
            description: "",
            features: [],
            price1l: "",
            price4l: "",
            price5l: "",
            price10l: "",
            price20l: "",
            price500ml: "",
            price200ml: "",
            price1kg: "",
            price500g: "",
            price200g: "",
            price100g: "",
            price50g: "",
            stock: "In Stock",
            image: null,
            image_url: "",
          });
          setFeaturesInput("");
          setImagePreview(null);
          setSaveModalMessage("Product updated successfully.✅");
          setIsSaveModalOpen(true);
        } else {
          setError("Failed to update product");
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            setError("Unauthorized access. Please log in again.");
            window.location.href = "/login";
          } else if (error.response.status === 405) {
            setError("Method not allowed. Please check the backend API configuration.");
          } else {
            setError(`Server error: ${error.response.data.detail || "Unknown error"}`);
          }
        } else if (error.request) {
          setError("No response from server. Please check your connection.");
        } else {
          setError("An error occurred while updating the product.");
        }
        console.error("Error updating product:", error);
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleDelete = (id) => {
    setProductIdToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsModalOpen(false);
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/products/${productIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        const updatedProducts = products.filter((item) => item.id !== productIdToDelete);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
      } else {
        setError("Failed to delete product");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError("Unauthorized access. Please log in again.");
          window.location.href = "/login";
        } else {
          setError(`Server error: ${error.response.data.detail || "Unknown error"}`);
        }
      } else if (error.request) {
        setError("No response from server. Please check your connection.");
        console.error(error.request);
      } else {
        setError("An error occurred while deleting the product.");
      }
      console.error("Error deleting product:", error);
    } finally {
      setIsLoading(false);
      setProductIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setProductIdToDelete(null);
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setNewProduct({
      name: "",
      category: "",
      description: "",
      features: [],
      price1l: "",
      price4l: "",
      price5l: "",
      price10l: "",
      price20l: "",
      price500ml: "",
      price200ml: "",
      price1kg: "",
      price500g: "",
      price200g: "",
      price100g: "",
      price50g: "",
      stock: "In Stock",
      image: null,
      image_url: "",
    });
    setFeaturesInput("");
    setImagePreview(null);
    setError("");
  };

  const handleCloseSaveModal = () => {
    setIsSaveModalOpen(false);
    setSaveModalMessage("Product added successfully.✅");
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

  const getStockBadgeColor = (stock) => {
    switch (stock.toLowerCase()) {
      case "in stock":
        return "bg-green-100 text-green-800";
      case "low stock":
        return "bg-yellow-100 text-yellow-800";
      case "out of stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPriceRange = (product) => {
    const prices = [
      product.price1l,
      product.price4l,
      product.price5l,
      product.price10l,
      product.price20l,
      product.price500ml,
      product.price200ml,
      product.price1kg,
      product.price500g,
      product.price200g,
      product.price100g,
      product.price50g,
    ].filter((price) => price && price.trim() !== "");

    if (prices.length === 0) return "Not set";

    const minPrice = prices[0];
    const maxPrice = prices[prices.length - 1];

    return prices.length === 1 ? minPrice : `${minPrice} - ${maxPrice}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products Manager</h1>
            <p className="text-gray-600 mt-1">Manage your complete product catalog</p>
          </div>
          <button
            onClick={handleAddNew}
            disabled={isAddingNew || editingId !== null}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Plus size={16} className="mr-2" />
            Add Product
          </button>
        </div>

        {error && !isAddingNew && editingId === null && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
            <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError("")} className="ml-4 text-red-600 hover:text-red-800">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Add Product Form */}
        {isAddingNew && (
          <ProductForm
            product={newProduct}
            onChange={setNewProduct}
            onImageChange={handleImageChange}
            onFeatureInputChange={handleFeatureInputChange}
            onSave={handleSaveNew}
            onCancel={handleCancel}
            isNew={true}
            preview={imagePreview}
            categories={categories}
            setImagePreview={setImagePreview}
            featuresInput={featuresInput}
            setFeaturesInput={setFeaturesInput}
            error={error}
          />
        )}

        {/* Edit Product Form */}
        {editingId && (
          <ProductForm
            product={newProduct}
            onChange={setNewProduct}
            onImageChange={handleImageChange}
            onFeatureInputChange={handleFeatureInputChange}
            onSave={handleSaveEdit}
            onCancel={handleCancel}
            isNew={false}
            preview={imagePreview}
            categories={categories}
            setImagePreview={setImagePreview}
            featuresInput={featuresInput}
            setFeaturesInput={setFeaturesInput}
            error={error}
          />
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products by name, category, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-gray-600">{filteredProducts.length} products displayed</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 text-red-500 animate-spin mx-auto" />
              <p className="text-gray-600 mt-4">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price Range
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 rounded-xl overflow-hidden">
                            <img
                              src={getImageUrl(product.image_url) || "/placeholder.svg?height=48&width=48&text=Product"}
                              alt={product.name}
                              className="h-12 w-12 object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                                e.currentTarget.onerror = null;
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatPriceRange(product)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockBadgeColor(
                            product.stock,
                          )}`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(product.id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Layers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first product."}
            </p>
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors inline-flex items-center font-medium"
            >
              <Plus size={16} className="mr-2" />
              Add Product
            </button>
          </div>
        )}

        <DeleteModal isOpen={isModalOpen} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
        <SaveModal isOpen={isSaveModalOpen} onClose={handleCloseSaveModal} message={saveModalMessage} />
        <ConfirmModal isOpen={isConfirmModalOpen} onConfirm={handleConfirmSave} onCancel={handleCancelConfirm} />
      </div>
    </div>
  );
}