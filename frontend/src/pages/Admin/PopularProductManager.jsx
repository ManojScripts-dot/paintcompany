"use client"

import { useState, useEffect } from "react"
import { Star, Plus, Edit2, Trash2, RefreshCw, AlertTriangle, Upload } from "lucide-react"
import axios from "axios"
import DeleteModal from "../../components/DeleteModal"
import SaveModal from "../../components/SaveModal"
import ConfirmModal from "../../components/ConfirmModal"

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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">
        {isNew ? "Add New Popular Product" : "Edit Popular Product"}
      </h3>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
          <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
          <span>{error}</span>
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
              onChange={(e) => onInputChange("name", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Product Type *
            </label>
            <select
              id="type"
              value={product.type}
              onChange={(e) => onInputChange("type", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
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

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={product.description}
              onChange={(e) => onInputChange("description", e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">
              Features * (comma separated)
            </label>
            <input
              type="text"
              id="features"
              value={featuresInput}
              onChange={(e) => {
                setFeaturesInput(e.target.value)
                onFeatureInputChange(e)
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="Weather Resistance, Low VOC, Durable"
              required
            />
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
              Rating (1-5) *
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                id="rating"
                min="1"
                max="5"
                step="0.1"
                value={product.rating}
                onChange={(e) => onInputChange("rating", Number.parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex items-center space-x-1 min-w-[80px]">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-lg font-medium text-gray-900">{product.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Image *</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-400 transition-colors">
            {preview ? (
              <div className="relative">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Product preview"
                  className="mx-auto h-64 w-auto object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <label className="cursor-pointer bg-blue-500 text-white rounded-lg px-3 py-1 text-sm hover:bg-blue-600 transition-colors">
                    Replace
                    <input type="file" className="sr-only" accept="image/*" onChange={onImageChange} />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      onInputChange("image", null)
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
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <label className="cursor-pointer bg-red-500 text-white rounded-lg px-6 py-3 font-medium hover:bg-red-600 transition-colors inline-block">
                    Upload Image *
                    <input type="file" className="sr-only" accept="image/*" onChange={onImageChange} required />
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
  )
}

export default function PopularProductManager() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [productIdToDelete, setProductIdToDelete] = useState(null)
  const [pendingSaveAction, setPendingSaveAction] = useState(null)
  const [featuresInput, setFeaturesInput] = useState("")

  const [newProduct, setNewProduct] = useState({
    name: "",
    type: "",
    description: "",
    features: [],
    rating: 4.0,
    image: null,
  })

  const API_BASE_URL = "https://paintcompanybackend.onrender.com"

  const getAuthToken = () => {
    return localStorage.getItem("authToken")
  }

  const getHeaders = (isFormData = false) => {
    const token = getAuthToken()
    const headers = {
      Authorization: `Bearer ${token}`,
    }
    if (!isFormData) {
      headers["Content-Type"] = "application/json"
    }
    return { headers }
  }

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.svg?height=200&width=200&text=Product"

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl
    }

    if (imageUrl.startsWith("/static/")) {
      return `${API_BASE_URL}${imageUrl}`
    }

    if (!imageUrl.includes("/")) {
      return `${API_BASE_URL}/static/popular_products/${imageUrl}`
    }

    return imageUrl
  }

  const fetchProducts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/popular-products`, getHeaders())
      let fetchedProducts = []
      if (response.data && Array.isArray(response.data)) {
        fetchedProducts = response.data.map((product) => ({
          id: product.id,
          name: product.name,
          type: product.type,
          description: product.description,
          features: Array.isArray(product.features) ? product.features : [],
          rating: product.rating || 4.0,
          image: getImageUrl(product.image_url),
        }))
      } else if (response.data && response.data.items) {
        fetchedProducts = response.data.items.map((product) => ({
          id: product.id,
          name: product.name,
          type: product.type,
          description: product.description,
          features: Array.isArray(product.features) ? product.features : [],
          rating: product.rating || 4.0,
          image: getImageUrl(product.image_url),
        }))
      }
      setProducts(fetchedProducts)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products. Please check if the server is running and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAddNew = () => {
    setIsAddingNew(true)
    setNewProduct({
      name: "",
      type: "",
      description: "",
      features: [],
      rating: 4.0,
      image: null,
    })
    setFeaturesInput("")
    setImagePreview(null)
    setError(null)
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewProduct((prevState) => ({ ...prevState, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (field, value) => {
    setNewProduct((prevState) => ({
      ...prevState,
      [field]: value,
    }))
  }

  const handleFeatureInputChange = (e) => {
    const input = e.target.value
    const features = input
      .split(/[,\n]/)
      .map((feature) => feature.trim())
      .filter((feature) => feature.length > 0)
    setNewProduct((prevState) => ({ ...prevState, features }))
  }

  const handleOpenConfirmModal = (action) => {
    setPendingSaveAction(() => action)
    setIsConfirmModalOpen(true)
  }

  const handleConfirmSave = () => {
    setIsConfirmModalOpen(false)
    if (pendingSaveAction) {
      pendingSaveAction()
    }
    setPendingSaveAction(null)
  }

  const handleCancelConfirm = () => {
    setIsConfirmModalOpen(false)
    setPendingSaveAction(null)
  }

  const handleSaveNew = async () => {
    if (!newProduct.name || newProduct.features.length === 0 || !newProduct.image || !newProduct.type) {
      setError("Please fill in all required fields (Name, Type, Features, Image).")
      return
    }

    handleOpenConfirmModal(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const formData = new FormData()
        formData.append("name", newProduct.name)
        formData.append("type", newProduct.type)
        formData.append("description", newProduct.description || "")
        formData.append("features", JSON.stringify(newProduct.features))
        formData.append("rating", newProduct.rating.toString())
        if (newProduct.image) {
          formData.append("image", newProduct.image)
        }

        const response = await axios.post(`${API_BASE_URL}/admin/popular-products/`, formData, getHeaders(true))

        const createdProduct = {
          id: response.data.id,
          name: response.data.name,
          type: response.data.type,
          description: response.data.description,
          features: Array.isArray(response.data.features) ? response.data.features : [],
          rating: response.data.rating || 4.0,
          image: getImageUrl(response.data.image_url),
        }

        setProducts([createdProduct, ...products])
        setIsAddingNew(false)
        setNewProduct({
          name: "",
          type: "",
          description: "",
          features: [],
          rating: 4.0,
          image: null,
        })
        setFeaturesInput("")
        setImagePreview(null)
        setIsSaveModalOpen(true)
        await fetchProducts()
      } catch (err) {
        console.error("Error creating product:", err)
        setError(err.response?.data?.detail || "Failed to create product. Please try again.")
      } finally {
        setIsLoading(false)
      }
    })
  }

  const handleEdit = (id) => {
    const productToEdit = products.find((item) => item.id === id)
    if (productToEdit) {
      setEditingId(id)
      setNewProduct({
        ...productToEdit,
        image: null,
      })
      setFeaturesInput(productToEdit.features.join(", "))
      setImagePreview(productToEdit.image)
      setError(null)
    }
  }

  const handleSaveEdit = async () => {
    if (!newProduct.name || newProduct.features.length === 0 || !newProduct.type) {
      setError("Please fill in all required fields (Name, Type, Features).")
      return
    }

    handleOpenConfirmModal(async () => {
      setIsLoading(true)
      setError(null)

      try {
        const formData = new FormData()
        formData.append("name", newProduct.name)
        formData.append("type", newProduct.type)
        formData.append("description", newProduct.description || "")
        formData.append("features", JSON.stringify(newProduct.features))
        formData.append("rating", newProduct.rating.toString())
        if (newProduct.image) {
          formData.append("image", newProduct.image)
        }

        const response = await axios.put(
          `${API_BASE_URL}/admin/popular-products/${editingId}/`,
          formData,
          getHeaders(true),
        )

        const updatedProduct = {
          id: response.data.id,
          name: response.data.name,
          type: response.data.type,
          description: response.data.description,
          features: Array.isArray(response.data.features) ? response.data.features : [],
          rating: response.data.rating || 4.0,
          image: getImageUrl(response.data.image_url),
        }

        setProducts(products.map((item) => (item.id === editingId ? updatedProduct : item)))
        setEditingId(null)
        setNewProduct({
          name: "",
          type: "",
          description: "",
          features: [],
          rating: 4.0,
          image: null,
        })
        setFeaturesInput("")
        setImagePreview(null)
        setIsSaveModalOpen(true)
        await fetchProducts()
      } catch (err) {
        console.error("Error updating product:", err)
        setError(err.response?.data?.detail || "Failed to update product. Please try again.")
      } finally {
        setIsLoading(false)
      }
    })
  }

  const handleOpenDeleteModal = (id) => {
    const cleanId = Number(String(id).split(":")[0])
    setProductIdToDelete(cleanId)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false)
    if (productIdToDelete) {
      await handleDelete(productIdToDelete)
      setProductIdToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setProductIdToDelete(null)
  }

  const handleCloseSaveModal = () => {
    setIsSaveModalOpen(false)
  }

  const handleDelete = async (id) => {
    const cleanId = Number(String(id).split(":")[0])
    const url = `${API_BASE_URL}/admin/popular-products/${cleanId}`
    setIsLoading(true)
    setError(null)
    try {
      await axios.delete(url, getHeaders())
      setProducts(products.filter((item) => item.id !== cleanId))
    } catch (err) {
      console.error("Delete error:", err)
      setError(err.response?.data?.detail || "Failed to delete product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsAddingNew(false)
    setEditingId(null)
    setNewProduct({
      name: "",
      type: "",
      description: "",
      features: [],
      rating: 4.0,
      image: null,
    })
    setFeaturesInput("")
    setImagePreview(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Popular Products</h1>
            <p className="text-gray-600 mt-1">Manage your most popular paint products</p>
          </div>

          <div className="flex space-x-3">
            {!isLoading && !isAddingNew && editingId === null && (
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center"
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh
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

        {error && !isAddingNew && editingId === null && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
            <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={fetchProducts}
              className="ml-4 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center text-sm"
            >
              <RefreshCw size={14} className="mr-1" />
              Retry
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
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 text-red-500 animate-spin mx-auto" />
              <p className="text-gray-600 mt-4">Loading popular products...</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 p-6">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-48 md:h-full object-cover rounded-xl"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=200&width=200&text=Product"
                        }}
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-gray-600 text-sm">{product.type}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="font-medium text-gray-900">
                            {Number.parseFloat(product.rating).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">{product.description}</p>

                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.features.map((feature, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(Number(product.id))}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No popular products</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first popular product.</p>
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors inline-flex items-center font-medium"
            >
              <Plus size={16} className="mr-2" />
              Add Popular Product
            </button>
          </div>
        )}

        <DeleteModal isOpen={isDeleteModalOpen} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
        <SaveModal isOpen={isSaveModalOpen} onClose={handleCloseSaveModal} />
        <ConfirmModal isOpen={isConfirmModalOpen} onConfirm={handleConfirmSave} onCancel={handleCancelConfirm} />
      </div>
    </div>
  )
}
