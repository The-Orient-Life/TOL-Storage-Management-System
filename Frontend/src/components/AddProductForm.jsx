import React, { useState } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Tv, 
  Pen as Oven,
  Plus,
  Minus,
  Package,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';


function AddProductForm() {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [variants, setVariants] = useState([{ name: '', stock: 0 }]);
  const [totalWorth, setTotalWorth] = useState('');
  const [stockStatus, setStockStatus] = useState('in-stock');
  const [formError, setFormError] = useState('');

  const addVariant = () => {
    setVariants([...variants, { name: '', stock: 0 }]);
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
      setFormError('Please select a product category');
      return;
    }
  
    if (variants.some(v => !v.name)) {
      setFormError('Please fill in all variant names');
      return;
    }
  
    setFormError('');
  
    
    console.log({
      productName,
      category,
      variants,
      totalWorth: parseFloat(totalWorth),
      stockStatus
    });
  
    
    const data = {
      productName, 
      productCategory: category, 
      productVariants: variants.map(variant => ({

        name: variant.name,    
        stock: variant.stock  

      }) ), 
      productTotalWorth: parseFloat(totalWorth), 
      productStockStatus: stockStatus.charAt(0).toUpperCase() + stockStatus.slice(1).replace("-", " ")
    };
  
    const addURL = import.meta.env.VITE_APP_BACKENDADD
    axios.post(addURL, data)
      .then(response => {
        console.log("Yayyy"); 
        console.log(response.data); 
      })
      .catch(error => {
        console.error("This Is Post Error Form Frontend", error);  
      });
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
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
            <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all duration-200 ease-in-out hover:border-blue-200"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { icon: Smartphone, label: 'Smartphones' },
                    { icon: Monitor, label: 'Monitors' },
                    { icon: Tv, label: 'TV' },
                    { icon: Oven, label: 'Appliances' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setCategory(item.label)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${
                        category === item.label
                          ? 'bg-blue-600 text-white shadow-lg scale-105'
                          : 'bg-white border-2 border-gray-100 hover:border-blue-200 hover:shadow'
                      }`}
                    >
                      <item.icon className={`w-7 h-7 mb-2 ${category === item.label ? 'text-white' : 'text-blue-600'}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Variants/Models
                  </label>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Variant
                  </button>
                </div>
                <div className="space-y-4">
                  {variants.map((variant, index) => (
                    <div 
                      key={index} 
                      className="flex gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => updateVariant(index, 'name', e.target.value)}
                        className="flex-1 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Variant name"
                        required
                      />
                      <input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value))}
                        className="w-32 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Stock"
                        required
                      />
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Stock Status
                </label>
                <div className="flex gap-6">
                  {[
                    { value: 'in-stock', color: 'bg-green-50 text-green-700 border-green-100' },
                    { value: 'low-stock', color: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
                    { value: 'out-of-stock', color: 'bg-red-50 text-red-700 border-red-100' }
                  ].map((status) => (
                    <label
                      key={status.value}
                      className={`flex items-center px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                        stockStatus === status.value ? status.color : 'bg-gray-50 text-gray-600 border-gray-100'
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
                        {status.value.replace(/-/g, ' ')}
                      </span>
                    </label>
                  ))}
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

export default AddProductForm;