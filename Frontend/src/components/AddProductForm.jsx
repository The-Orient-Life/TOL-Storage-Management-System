import { useState, useEffect } from 'react'
import { Package, DollarSign, AlertCircle, Upload, Minus, Plus } from 'lucide-react'
import axios from 'axios';
import Swal from "sweetalert2";

function AddProduct() {
  const [productName, setProductName] = useState("")
  const [category, setCategory] = useState("")
  const [variants, setVariants] = useState([
    { name: "", stock: "", price: "" }
  ])
  const [totalWorth, setTotalWorth] = useState(0)
  const [stockStatus, setStockStatus] = useState("out-of-stock")
  const [formError, setFormError] = useState("")
  const [imagePreview, setImagePreview] = useState("")

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home & Garden",
    "Toys",
    "Sports"
  ]

  // Calculate total worth and stock status whenever variants change
  useEffect(() => {
    // Calculate total worth
    const worth = variants.reduce((total, variant) => {
      const price = parseFloat(variant.price) || 0
      const stock = parseInt(variant.stock) || 0
      return total + (price * stock)
    }, 0)
    setTotalWorth(worth)

    // Calculate stock status
    const totalStock = variants.reduce((total, variant) => {
      const stock = parseInt(variant.stock) || 0
      return total + stock
    }, 0)

    if (totalStock === 0) {
      setStockStatus("out-of-stock")
    } else if (totalStock < 10) {
      setStockStatus("low-stock")
    } else {
      setStockStatus("in-stock")
    }
  }, [variants])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addVariant = () => {
    setVariants([...variants, { name: "", stock: "", price: "" }])
  }

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
  }



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !category) {
      setFormError("Please fill in all required fields");
      return;
    }

    if (variants.some(v => !v.name || !v.price)) {
      setFormError("Please fill in all variant details");
      return;
    }

    // Form is valid
    setFormError("");

    // Format the data for the API
    const formData = {
      productName,
      productCategory: category,  // Use 'category' here
      productVariants: variants.map((variant) => ({
        name: variant.name,
        price: parseFloat(variant.price) || 0,
        stock: parseInt(variant.stock) || 0
      })),
      productTotalWorth: totalWorth,
      productStockStatus: stockStatus,
      imagePreview: imagePreview // This will be the image URL
    };

    try {
      // Make the API request to add the product
      const regURL = import.meta.env.VITE_APP_BACKENDADD;

      const response = await axios.post(regURL, formData);
      if (response.status === 201) {
        // Show success message
        Swal.fire({
          icon: "success",
          title: "Product Added Successfully",
          text: response.data.message
        });

        // Reset form fields after successful submission
        setProductName("");
        setCategory("");
        setVariants([{ name: "", stock: "", price: "" }]);
        setImagePreview("");
      }
    } catch (error) {
      // Handle error if API call fails
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong"
      });
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Add Product</h1>
        </div>

        {formError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium">Product Image</label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Upload className="w-4 h-4 inline mr-1" />
                Upload
              </label>
            </div>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium">Variants</label>
              <button
                type="button"
                onClick={addVariant}
                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Add Variant
              </button>
            </div>
            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) => updateVariant(index, "name", e.target.value)}
                    placeholder="Variant Name"
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, "price", e.target.value)}
                      placeholder="Price"
                      className="w-32 p-2 pl-8 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, "stock", e.target.value)}
                    placeholder="Stock"
                    className="w-24 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    required
                  />
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove variant"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            <div>
              <label className="block mb-1 font-medium">Total Worth</label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={totalWorth.toFixed(2)}
                  className="w-32 p-2 pl-8 border rounded-lg bg-gray-50"
                  readOnly
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Stock Status</label>
              <div className={`px-3 py-2 rounded-lg font-medium ${stockStatus === 'in-stock' ? 'bg-green-100 text-green-700' :
                  stockStatus === 'low-stock' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                }`}>
                {stockStatus.replace('-', ' ')}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProduct;