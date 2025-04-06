import React, { useState, useEffect } from 'react';
import { Package2, AlertTriangle, CheckCircle2, History, List, Grid, Search } from 'lucide-react';
import axios from "axios";
import Swal from "sweetalert2";

const sampleProducts = [
  {
    "_id": { "$oid": "67e6864c71e4e10a69056347" },
    "productName": "DELL",
    "productCategory": "Electronics",
    "productVariants": [
      { "name": "Dell V1", "stock": 49, "price": "20", "_id": { "$oid": "67e6864c71e4e10a69056348" } },
      { "name": "Dell V2", "stock": 49, "price": "20", "_id": { "$oid": "67e6864c71e4e10a69056349" } },
      { "name": "Dell V3", "stock": 49, "price": "20", "_id": { "$oid": "67e6864c71e4e10a6905634a" } },
      { "name": "Dell v4", "stock": 42, "price": "20", "_id": { "$oid": "67e6864c71e4e10a6905634b" } }
    ],
    "productTotalWorth": 4000,
    "productStockStatus": "in-stock",
    "imagePreview": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=200",
    "createdAt": { "$date": "2025-03-28T11:21:48.596Z" },
    "updatedAt": { "$date": "2025-03-29T07:34:37.485Z" },
    "__v": 0
  },
  {
    "_id": { "$oid": "67e6864c71e4e10a69056350" },
    "productName": "HP Laptop",
    "productCategory": "Electronics",
    "productVariants": [
      { "name": "HP Pro", "stock": 15, "price": "30", "_id": { "$oid": "67e6864c71e4e10a69056351" } },
      { "name": "HP Elite", "stock": 8, "price": "40", "_id": { "$oid": "67e6864c71e4e10a69056352" } }
    ],
    "productTotalWorth": 3000,
    "productStockStatus": "low-stock",
    "imagePreview": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=200",
    "createdAt": { "$date": "2025-03-28T11:21:48.596Z" },
    "updatedAt": { "$date": "2025-03-29T07:34:37.485Z" },
    "__v": 0
  }
];

function Restock() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [restockAmount, setRestockAmount] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  // const handleRestock = () => {
  //   if (selectedVariant && restockAmount > 0) {
  //     // Log the restock details
  //     console.log({
  //       variantId: selectedVariant._id,
  //       variantName: selectedVariant.name,
  //       currentStock: selectedVariant.stock,
  //       restockAmount: restockAmount,
  //       newStockLevel: selectedVariant.stock + restockAmount
  //     });

  //     setSelectedVariant(null);/////////////////
  //     /////////////////////////////////////////
  //     setRestockAmount(0);
  //   }
  // };

  const handleRestock = () => {
    if (selectedVariant && restockAmount > 0) {
      // Log the restock details to the console (optional for debugging)
      console.log({
        variantId: selectedVariant._id,
        variantName: selectedVariant.name,
        currentStock: selectedVariant.stock,
        restockAmount: restockAmount,
        newStockLevel: selectedVariant.stock + restockAmount,
      });

      // Prepare the data to be sent to the backend
      const restockData = {
        variantId: selectedVariant._id,
        restockAmount: restockAmount,
      };

      const apiUrl = import.meta.env.VITE_APP_BACKENDRESTK;

      // Make the PATCH request to the backend API
      axios
        .patch(apiUrl, restockData)
        .then((response) => {
          // Show success message using SweetAlert
          Swal.fire({
            title: "Success!",
            text: "Variant restocked successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });

          // Reset form states after successful restock
          setSelectedVariant(null);
          setRestockAmount(0);
        })
        .catch((error) => {
          // Handle error (network error, API error, etc.)
          console.error("Error during restock:", error);
          Swal.fire({
            title: "Error!",
            text: error.response ? error.response.data.message : "An error occurred",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    } else {
      // Handle invalid restock amount (e.g., less than or equal to 0)
      Swal.fire({
        title: "Error!",
        text: "Restock amount must be greater than 0.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };


  // Fetch products from backend using axios
  useEffect(() => {
    axios.get('http://localhost:3001/api/getProduct')  // Make sure the URL matches your backend
      .then(response => {
        setProducts(response.data.getProduct);  // Assuming 'getProduct' is the key in the response
      })
      .catch(error => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  const getStockStatusColor = (stock) => {
    if (stock <= 10) return 'text-red-600';
    if (stock <= 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleManageStock = (product) => {
    setSelectedProduct(product);
    // Select the first variant by default
    if (product.productVariants.length > 0) {
      setSelectedVariant(product.productVariants[0]);
    }
  };

  const renderProductGrid = (product) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Package2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.productName}</h1>
              <p className="text-sm text-gray-500">{product.productCategory}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {product.productStockStatus}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Worth: ${product.productTotalWorth}
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 p-6">
        <div className="md:col-span-1">
          <img
            src={product.imagePreview}
            alt={product.productName}
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <History className="h-4 w-4 mr-2" />
              Last updated: {new Date(product.updatedAt.$date).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.productVariants.map((variant) => (
              <div
                key={variant._id.$oid}
                className={`p-4 rounded-lg border ${selectedVariant?._id.$oid === variant._id.$oid
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
                  } cursor-pointer hover:border-blue-500 transition-colors`}
                onClick={() => setSelectedVariant(variant)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">{variant.name}</h3>
                  <span className={`font-medium ${getStockStatusColor(variant.stock)}`}>
                    {variant.stock} units
                  </span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-500">${variant.price}/unit</span>
                  {variant.stock <= 20 && (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProductTable = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variants</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Worth</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredProducts.map((product) => (
            <tr key={product._id.$oid}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <img className="h-10 w-10 rounded-full object-cover" src={product.imagePreview} alt="" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.productCategory}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{product.productVariants.length} variants</div>
                <div className="text-sm text-gray-500">
                  {product.productVariants.map(v => v.name).join(', ')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.productTotalWorth}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.productStockStatus === 'in-stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {product.productStockStatus}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleManageStock(product)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Manage Stock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          {viewMode === 'grid' ? (
            filteredProducts.map(product => (
              <div key={product._id.$oid}>
                {renderProductGrid(product)}
              </div>
            ))
          ) : (
            renderProductTable()
          )}
        </div>

        {/* Restock Panel */}
        {selectedVariant && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Restock {selectedVariant.name}
              </h3>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(parseInt(e.target.value) || 0)}
                  className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Amount"
                />
                <button
                  onClick={handleRestock}
                  disabled={restockAmount <= 0}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirm Restock
                </button>
                <button
                  onClick={() => {
                    setSelectedVariant(null);
                    setRestockAmount(0);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Restock;