import React, { useState } from 'react';
import { CreditCard, Calendar, ShoppingCart, Trash2 } from 'lucide-react';

export default function PaymentDetails({
  selectedProducts,
  onRemoveProduct,
  subtotal,
  onPaymentTypeChange,
  onMonthsChange,
  paymentType,
  months
}) {
  const [downPayment, setDownPayment] = useState('');

  // Ensure subtotal is a valid number before using toFixed
  const validSubtotal = typeof subtotal === 'number' && !isNaN(subtotal) ? subtotal : 0;
  const numericDownPayment = downPayment === '' ? 0 : Number(downPayment);
  const remainingBalance = validSubtotal - numericDownPayment;
  const monthlyPayment = paymentType === 'Easy Payment' ? remainingBalance / months : 0;

  const handleCompletePurchase = () => {
    // Log product details
    console.log('Selected Products:', selectedProducts);

    // Log payment details
    console.log('Subtotal:', validSubtotal.toFixed(2));
    const CustomerNic = sessionStorage.getItem("Customer NIC");
    console.log("This Is Customer ", CustomerNic);
    // Retrieve the data from sessionStorage
    const storedUserDetails = sessionStorage.getItem('UserDetails');

    // Check if the data exists
    if (storedUserDetails) {
      // Parse the data
      const parsedUserDetails = JSON.parse(storedUserDetails);

      // Check if 'data' exists and 'nicNumber' is inside 'data'
      if (parsedUserDetails && parsedUserDetails.data && parsedUserDetails.data.nicNumber) {
        const userNic = parsedUserDetails.data.nicNumber;
        console.log("This Is Stuff Mem NIC: ", userNic);
      } else {
        console.error("NIC Number is undefined or missing from stored data.");
      }
    } else {
      console.error("No data found in sessionStorage for 'UserDetails'.");
    }




    if (paymentType === 'Easy Payment') {
      console.log('Down Payment:', numericDownPayment);
      console.log('Remaining Balance:', remainingBalance.toFixed(2));
      console.log('Monthly Payment:', monthlyPayment.toFixed(2));
      console.log('Payment Type:', paymentType);
      console.log('Months:', months);
    } else {
      console.log('Payment Type:', paymentType);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="text-blue-600" size={24} />
        <h2 className="text-xl font-semibold">Cart & Payment</h2>
      </div>

      {selectedProducts.length > 0 ? (
        <div className="space-y-6">
          <div className="space-y-4">
            {selectedProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600">${product.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveProduct(product.id)}
                  className="text-red-500 hover:text-red-600 p-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Payment Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${paymentType === 'Full Payment'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  onClick={() => {
                    onPaymentTypeChange('Full Payment');
                    setDownPayment('');
                  }}
                >
                  <CreditCard size={20} />
                  Full Payment
                </button>
                <button
                  className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${paymentType === 'Easy Payment'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  onClick={() => onPaymentTypeChange('Easy Payment')}
                >
                  <Calendar size={20} />
                  Easy Payment
                </button>
              </div>
            </div>

            {paymentType === 'Easy Payment' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Down Payment ($)</label>
                  <input
                    type="number"
                    min="0"
                    max={validSubtotal}
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Months</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={months}
                    onChange={(e) => onMonthsChange(Number(e.target.value))}
                  >
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                    <option value={12}>12 Months</option>
                  </select>
                </div>
              </>
            )}

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-medium">${validSubtotal.toFixed(2)}</span>
              </div>

              {paymentType === 'Easy Payment' && (
                <>
                  <div className="flex justify-between text-gray-600">
                    <span>Down Payment:</span>
                    <span className="font-medium">${numericDownPayment.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Remaining Balance:</span>
                    <span className="font-medium">${remainingBalance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-blue-600">
                    <span>Monthly Payment:</span>
                    <span className="font-medium">${monthlyPayment.toFixed(2)}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span>${validSubtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              onClick={handleCompletePurchase}
            >
              <CreditCard size={20} />
              Complete Purchase
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
          <p>Your cart is empty</p>
        </div>
      )}
    </div>
  );
}