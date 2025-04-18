import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Search } from 'lucide-react';
import axios from 'axios';
import Swal from "sweetalert2";

function ProductList({ onProductSelect, selectedProducts }) {



  const [searchQuery, setSearchQuery] = useState('');
  const [product, setProducts] = useState([]);




  const apiUrl = import.meta.env.VITE_APP_BACKENDGETM

  useEffect(() => {
    // Fetch data from the backend API when the component mounts
    const fetchProducts = async () => {
      try {
        const response = await axios.get(apiUrl);  // Replace with your API URL
        if (response.status === 200) {
          const formattedProducts = response.data.variants.map(product => {
            return {
              id: product.id,
              name: product.name || 'Unknown Product',
              category: product.category || 'Unknown Category',
              stockLevel: product.stockLevel || 0,
              price: parseFloat(product.price) || 0,
              status: product.status || 'Out of Stock',
              image: product.image || 'https://via.placeholder.com/150'  // Placeholder image if missing
            };
          });

          setProducts(formattedProducts);  // Set the formatted product variants to state

        }
      } catch (error) {
        console.error('Error fetching products:', error);
        Swal.fire('Error', 'There was an issue fetching products.', 'error');
      }
    };

    fetchProducts();
  }, []);


  const products = product;
  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Low Stock':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Out of Stock':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isProductSelected = (productId) => {
    return selectedProducts.some(p => p.id === productId);
  };

  const filteredProducts = products.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  });




  return (
    <div>



      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold">Available Products</h2>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <ShoppingCart size={20} />
            <span className="font-medium">{selectedProducts.length} items selected</span>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search products by name or category..."
            className="w-full px-4 py-2 border rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all border ${isProductSelected(product.id) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100'
                }`}
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <span
                  className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    product.status
                  )}`}
                >
                  {product.status}
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600">Stock Level</div>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((product.stockLevel / 30) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-blue-600">${product.price}</span>
                </div>
                <div className="text-sm text-gray-600">{product.stockLevel} Units Available</div>
                <button
                  onClick={() => onProductSelect(product)}
                  className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${isProductSelected(product.id)
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } disabled:bg-gray-300 disabled:cursor-not-allowed`}
                  disabled={product.status === 'Out of Stock'}
                >
                  <ShoppingCart size={20} />
                  {isProductSelected(product.id) ? 'Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>




    </div>
  )
}

export default ProductList
