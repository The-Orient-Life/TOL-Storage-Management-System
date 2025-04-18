import React, { useState } from 'react';
import { CreditCard, Calendar, ShoppingCart, Trash2 } from 'lucide-react';
import axios from 'axios';
import Swal from "sweetalert2";


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
  const [executiveNIC, setExecutiveNIC] = useState('');

  // Ensure subtotal is a valid number before using toFixed
  const validSubtotal = typeof subtotal === 'number' && !isNaN(subtotal) ? subtotal : 0;
  const numericDownPayment = downPayment === '' ? 0 : Number(downPayment);
  const remainingBalance = validSubtotal - numericDownPayment;
  const monthlyPayment = paymentType === 'Easy Payment' ? remainingBalance / months : 0;



  const handleCompletePurchase = async () => {
    // Log product details

    const productIds = selectedProducts?.map(product => product.id || 'ID not found');


    // Log payment details

    const CustomerNic = sessionStorage.getItem("Customer NIC");


    // Retrieve the data from sessionStorage
    const storedUserDetails = sessionStorage.getItem('UserDetails');
    let executiveNIC = ''; // Assuming executive NIC needs to be set as well
    if (storedUserDetails) {
      // Parse the data
      const parsedUserDetails = JSON.parse(storedUserDetails);

      // Check if 'data' exists and 'nicNumber' is inside 'data'
      if (parsedUserDetails && parsedUserDetails.data && parsedUserDetails.data.nicNumber) {
        executiveNIC = parsedUserDetails.data.nicNumber;

      } else {
        console.error("NIC Number is undefined or missing from stored data.");
      }
    } else {
      console.error("No data found in sessionStorage for 'UserDetails'.");
    }

    // Prepare data to send for "Easy Payment"
    if (paymentType === 'Easy Payment' || paymentType === 'Full Payment') {


      // Construct the data object to send to backend
      const transactionData = {
        customerNIC: CustomerNic,
        executiveNIC: executiveNIC,
        productVariantId: productIds[0], // Assuming you're sending the first selected product
        subtotal: validSubtotal,
        downPayment: numericDownPayment,
        remainingBalance: remainingBalance,
        monthlyPayment: monthlyPayment,
        paymentType: paymentType,
        easyPaymentMonths: months,
      };

      const apiUrl = import.meta.env.VITE_APP_BACKENDADDT

      try {
        // Send data to the backend using fetch
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transactionData),
        });

        const data = await response.json();
        if (response.ok) {

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Successful",
            showConfirmButton: false,
            iconColor: "#4BB543",
            timer: 2000,
          });
          // Handle success (e.g., show confirmation message, redirect, etc.)
        } else {
          console.error('Error saving transaction:', data.message);
          // Handle error (e.g., show error message to the user)
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Unsuccessful",
            showConfirmButton: false,
            iconColor: "#4BB543",
            timer: 2000,
          });
        }
      } catch (error) {
        console.error('Error sending transaction data:', error);
      }
    } else {
      // Handle other payment types if necessary
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