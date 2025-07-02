"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Search, Filter, RefreshCw, Layers, AlertTriangle } from "lucide-react";
import axios from "axios";
import PropTypes from "prop-types"; // Add PropTypes import
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
        { id: "price20L", label: "Price (20 Ltr)", placeholder: "e.g. Rs. 8,500" },
        { id: "price4L", label: "Price (4 Ltr)", placeholder: "e.g. Rs. 1,800" },
        { id: "price1L", label: "Price (1 Ltr)", placeholder: "e.g. Rs. 500" },
        { id: "price500ml", label: "Price (500 ml)", placeholder: "e.g. Rs. 300" },
        { id: "price200ml", label: "Price (200 ml)", placeholder: "e.g. Rs. 150" },
      ];
    } else if (category === "Distemper") {
      return [
        { id: "price1L", label: "Price (1 Ltr)", placeholder: "e.g. Rs. 500" },
        { id: "price5L", label: "Price (5 Ltr)", placeholder: "e.g. Rs. 1,800" },
        { id: "price10L", label: "Price (10 Ltr)", placeholder: "e.g. Rs. 4,500" },
        { id: "price20L", label: "Price (20 Ltr)", placeholder: "e.g. Rs. 8,500" },
      ];
    } else {
      return [
        { id: "price1L", label: "Price (1 Ltr)", placeholder: "e.g. Rs. 500" },
        { id: "price4L", label: "Price (4 Ltr)", placeholder: "e.g. Rs. 1,800" },
        { id: "price10L", label: "Price (10 Ltr)", placeholder: "e.g. Rs. 4,500" },
        { id: "price20L", label: "Price (20 Ltr)", placeholder: "e.g. Rs. 8,500" },
      ];
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{isNew ? "Add New Product" : "Edit Product"}</h3>
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
              onChange={(e) => onChange({ ...product, name: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              value={product.category}
              onChange={(e) => onChange({ ...product, category: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
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

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={product.description}
              onChange={(e) => onChange({ ...product, description: e.target.value })}
              rows="3"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
              placeholder="e.g. Weather Resistance, Low VOC, Durable"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {getPriceFields(product.category).map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type="text"
                  id={field.id}
                  value={product[field.id] || ""}
                  onChange={(e) => onChange({ ...product, [field.id]: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image {isNew ? "*" : ""}
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-purple-500 transition-colors">
            <div className="space-y-1 text-center">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Product preview"
                    className="mx-auto h-64 w-auto object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                      e.currentTarget.onerror = null;
                    }}
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
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        onChange({ ...product, image: null });
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
                      Upload Image {isNew ? "*" : ""}
                      <input
                        ref={fileInputRef}
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => onImageChange(e)}
                        required={isNew}
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
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Save
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
    price1L: PropTypes.string,
    price4L: PropTypes.string,
    price5L: PropTypes.string,
    price10L: PropTypes.string,
    price20L: PropTypes.string,
    price500ml: PropTypes.string,
    price200ml: PropTypes.string,
    price1kg: PropTypes.string,
    price500g: PropTypes.string,
    price200g: PropTypes.string,
    price100g: PropTypes.string,
    price50g: PropTypes.string,
    price5kg: PropTypes.string,
    price10kg: PropTypes.string,
    price20kg: PropTypes.string,
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
    price1L: "",
    price4L: "",
    price5L: "",
    price10L: "",
    price20L: "",
    price500ml: "",
    price200ml: "",
    price1kg: "",
    price500g: "",
    price200g: "",
    price100g: "",
    price50g: "",
    price5kg: "",
    price10kg: "",
    price20kg: "",
    stock: "In Stock",
    image: null,
    image_url: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
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
      price1L: "",
      price4L: "",
      price5L: "",
      price10L: "",
      price20L: "",
      price500ml: "",
      price200ml: "",
      price1kg: "",
      price500g: "",
      price200g: "",
      price100g: "",
      price50g: "",
      price5kg: "",
      price10kg: "",
      price20kg: "",
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
        formData.append("price1L", newProduct.price1L || "");
        formData.append("price4L", newProduct.price4L || "");
        formData.append("price5L", newProduct.price5L || "");
        formData.append("price10L", newProduct.price10L || "");
        formData.append("price20L", newProduct.price20L || "");
        formData.append("price500ml", newProduct.price500ml || "");
        formData.append("price200ml", newProduct.price200ml || "");
        formData.append("price1kg", newProduct.price1kg || "");
        formData.append("price500g", newProduct.price500g || "");
        formData.append("price200g", newProduct.price200g || "");
        formData.append("price100g", newProduct.price100g || "");
        formData.append("price50g", newProduct.price50g || "");
        formData.append("price5kg", newProduct.price5kg || "");
        formData.append("price10kg", newProduct.price10kg || "");
        formData.append("price20kg", newProduct.price20kg || "");
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
            price1L: "",
            price4L: "",
            price5L: "",
            price10L: "",
            price20L: "",
            price500ml: "",
            price200ml: "",
            price1kg: "",
            price500g: "",
            price200g: "",
            price100g: "",
            price50g: "",
            price5kg: "",
            price10kg: "",
            price20kg: "",
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
        price5L: productToEdit.price5L || "",
        price5kg: productToEdit.price5kg || "",
        price10kg: productToEdit.price10kg || "",
        price20kg: productToEdit.price20kg || "",
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
        formData.append("price1L", newProduct.price1L || "");
        formData.append("price4L", newProduct.price4L || "");
        formData.append("price5L", newProduct.price5L || "");
        formData.append("price10L", newProduct.price10L || "");
        formData.append("price20L", newProduct.price20L || "");
        formData.append("price500ml", newProduct.price500ml || "");
        formData.append("price200ml", newProduct.price200ml || "");
        formData.append("price1kg", newProduct.price1kg || "");
        formData.append("price500g", newProduct.price500g || "");
        formData.append("price200g", newProduct.price200g || "");
        formData.append("price100g", newProduct.price100g || "");
        formData.append("price50g", newProduct.price50g || "");
        formData.append("price5kg", newProduct.price5kg || "");
        formData.append("price10kg", newProduct.price10kg || "");
        formData.append("price20kg", newProduct.price20kg || "");
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
            price1L: "",
            price4L: "",
            price5L: "",
            price10L: "",
            price20L: "",
            price500ml: "",
            price200ml: "",
            price1kg: "",
            price500g: "",
            price200g: "",
            price100g: "",
            price50g: "",
            price5kg: "",
            price10kg: "",
            price20kg: "",
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
      price1L: "",
      price4L: "",
      price5L: "",
      price10L: "",
      price20L: "",
      price500ml: "",
      price200ml: "",
      price1kg: "",
      price500g: "",
      price200g: "",
      price100g: "",
      price50g: "",
      price5kg: "",
      price10kg: "",
      price20kg: "",
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
      product.price1L,
      product.price4L,
      product.price5L,
      product.price10L,
      product.price20L,
      product.price500ml,
      product.price200ml,
      product.price1kg,
      product.price500g,
      product.price200g,
      product.price100g,
      product.price50g,
      product.price5kg,
      product.price10kg,
      product.price20kg,
    ].filter((price) => price && price.trim() !== "");

    if (prices.length === 0) return "Not set";

    const minPrice = prices[0];
    const maxPrice = prices[prices.length - 1];

    return prices.length === 1 ? minPrice : `${minPrice} - ${maxPrice}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Products Manager</h1>
        <button
          onClick={handleAddNew}
          disabled={isAddingNew || editingId !== null}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} className="mr-1" /> Add New Product
        </button>
      </div>

      {error && !isAddingNew && editingId === null && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
          <button onClick={() => setError("")} className="ml-auto text-red-600 hover:text-red-800">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

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

      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products by name, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
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

      <p className="text-gray-600">{filteredProducts.length} products displayed</p>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 text-purple-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price Range
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) =>
                  editingId === product.id ? (
                    <tr key={product.id}>
                      <td colSpan="5" className="px-6 py-4">
                        <ProductForm
                          product={newProduct}
                          onChange={setNewProduct}
                          onImageChange={handleImageChange}
                          onFeatureInputChange={handleFeatureInputChange}
                          onSave={handleSaveEdit}
                          onCancel={handleCancel}
                          preview={imagePreview}
                          categories={categories}
                          setImagePreview={setImagePreview}
                          featuresInput={featuresInput}
                          setFeaturesInput={setFeaturesInput}
                          error={error}
                        />
                      </td>
                    </tr>
                  ) : (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                            <img
                              src={getImageUrl(product.image_url) || "/placeholder.svg"}
                              alt={product.name}
                              className="h-10 w-10 object-cover"
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
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockBadgeColor(
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
                            className="text-gray-600 hover:text-gray-900"
                            title="Edit"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Layers className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm || filterCategory !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by adding a new product."}
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

      <DeleteModal isOpen={isModalOpen} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
      <SaveModal isOpen={isSaveModalOpen} onClose={handleCloseSaveModal} message={saveModalMessage} />
      <ConfirmModal isOpen={isConfirmModalOpen} onConfirm={handleConfirmSave} onCancel={handleCancelConfirm} />
    </div>
  );
}

