import React, { useState } from 'react';
import CustomerSearch from '../components/NewPurchaseCustomerSearch';
import ProductList from '../components/ProductList';
import PaymentDetails from '../components/PaymentDetails';

function NewPurchase() {


    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [paymentType, setPaymentType] = useState('Full Payment');
    const [months, setMonths] = useState(3);
    
  
    const handleProductSelect = (product) => {
      const existingProduct = selectedProducts.find(p => p.id === product.id);
      if (!existingProduct) {
        setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
      }
    };
  
    const handleRemoveProduct = (productId) => {
      setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    };
  
    const subtotal = selectedProducts.reduce((sum, product) => sum + product.price, 0);


  return (
    <div>

        
<div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">New Purchase</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Customer Search</h2>
              <CustomerSearch onCustomerSelect={setSelectedCustomer} />
            </div>

            {selectedCustomer && (
              <ProductList 
                onProductSelect={handleProductSelect}
                selectedProducts={selectedProducts}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            {selectedCustomer && (
              <PaymentDetails
                selectedProducts={selectedProducts}
                onRemoveProduct={handleRemoveProduct}
                subtotal={subtotal}
                onPaymentTypeChange={setPaymentType}
                onMonthsChange={setMonths}
                paymentType={paymentType}
                months={months}
              />
            )}
          </div>
        </div>
      </div>
    </div>



      
    </div>
  )
}

export default NewPurchase
