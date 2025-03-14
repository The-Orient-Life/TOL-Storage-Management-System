import React, { useState } from "react";
import {
  Package,
  DollarSign,
  AlertCircle,
  Upload,
  Minus,
  Plus,
} from "lucide-react";

function App() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [variants, setVariants] = useState([{ name: "", stock: 0, price: "" }]);
  const [totalWorth, setTotalWorth] = useState("");
  const [stockStatus, setStockStatus] = useState("in-stock");
  const [formError, setFormError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const categories = [
    "Smartphones",
    "Laptops",
    "Tablets",
    "Accessories",
    "Monitors",
    "TV",
    "Appliances",
    "Gaming",
    "Audio",
  ];

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addVariant = () => {
    setVariants([...variants, { name: "", stock: 0, price: "" }]);
  };

  const removeVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!category) {
      setFormError("Please select a product category");
      return;
    }

    if (variants.some((v) => !v.name || !v.price)) {
      setFormError("Please fill in all variant details");
      return;
    }

    if (!imagePreview) {
      setFormError("Please upload a product image");
      return;
    }

    setFormError("");

    console.log({
      productName,
      category,
      variants,
      totalWorth: parseFloat(totalWorth),
      stockStatus,
      imagePreview,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between border-b pb-6">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Add New Product
              </h2>
            </div>
            <div className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              New Entry
            </div>
          </div>

          {formError && (
            <div className="flex items-center gap-2 p-4 mt-6 rounded-lg bg-red-50 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Image
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg hover:border-blue-400 transition-colors w-full cursor-pointer"
                  >
                    <div className="space-y-2 text-center">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto h-64 w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevents clicking on the main button
                              setImagePreview("");
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-2">
                            <label className="cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                              Upload product image
                            </label>
                            <input
                              id="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Worth
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={totalWorth}
                      onChange={(e) => setTotalWorth(e.target.value)}
                      className="block w-full pl-10 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Variants/Models
                    </label>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {variants.map((variant, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) =>
                            updateVariant(index, "name", e.target.value)
                          }
                          className="col-span-5 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="Variant name"
                          required
                        />
                        <div className="col-span-3 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            value={variant.price}
                            onChange={(e) =>
                              updateVariant(index, "price", e.target.value)
                            }
                            className="block w-full pl-8 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Price"
                            required
                          />
                        </div>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "stock",
                              parseInt(e.target.value)
                            )
                          }
                          className="col-span-3 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="Stock"
                          required
                        />
                        {variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="col-span-1 p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Stock Status
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      {
                        value: "in-stock",
                        color: "bg-green-50 text-green-700 border-green-100",
                      },
                      {
                        value: "low-stock",
                        color: "bg-yellow-50 text-yellow-700 border-yellow-100",
                      },
                      {
                        value: "out-of-stock",
                        color: "bg-red-50 text-red-700 border-red-100",
                      },
                    ].map((status) => (
                      <label
                        key={status.value}
                        className={`flex items-center px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${
                          stockStatus === status.value
                            ? status.color
                            : "bg-gray-50 text-gray-600 border-gray-100"
                        }`}
                      >
                        <input
                          type="radio"
                          value={status.value}
                          checked={stockStatus === status.value}
                          onChange={(e) => setStockStatus(e.target.value)}
                          className="hidden"
                        />
                        <span className="text-sm font-medium capitalize">
                          {status.value.replace(/-/g, " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                className="px-6 py-2.5 rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
