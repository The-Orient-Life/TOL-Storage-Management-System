import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { X, Calendar, DollarSign, Clock, CheckCircle } from 'lucide-react';

const PaymentModal = ({ transaction, onClose, onPaymentUpdate }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handlePaymentSubmit = (payment) => {
    if (!paymentAmount || !paymentDate) return;

    const amount = parseFloat(paymentAmount);
    const update = {
      paymentId: payment._id,
      amount,
      dueAmount: payment.dueAmount - amount,
      status: amount >= payment.dueAmount ? 'paid' : 'pending',
      doneDate: new Date(paymentDate).toISOString(),
      month: payment.easyPaymentMonth,
      year: payment.easyPaymentYear
    };



    onPaymentUpdate(update);

    // Reset form
    setSelectedPayment(null);
    setPaymentAmount('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
  };

  const calculateRemainingAmount = (payment) => {
    const paidAmount = parseFloat(paymentAmount) || 0;
    return Math.max(0, payment.dueAmount - paidAmount);
  };

  const sortedPayments = [...transaction.easyPayment.payments].sort((a, b) => {
    if (a.easyPaymentYear !== b.easyPaymentYear) {
      return a.easyPaymentYear - b.easyPaymentYear;
    }
    return a.easyPaymentMonth - b.easyPaymentMonth;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Payment Management</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Customer Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{transaction.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">NIC</p>
              <p className="font-medium">{transaction.customerNIC}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Product</p>
              <p className="font-medium">{transaction.product.productName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Transaction ID</p>
              <p className="font-medium font-mono">{transaction.transactionID},{sessionStorage.setItem("TID", transaction.transactionID)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Calendar size={20} />
            Payment Schedule
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {sortedPayments.map((payment) => (
              <div
                key={payment._id}
                className={`border p-4 rounded-lg transition-all ${selectedPayment?._id === payment._id
                    ? 'border-blue-500 shadow-md'
                    : 'hover:border-gray-300'
                  }`}
                onClick={() => setSelectedPayment(payment)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      <Clock size={16} />
                      Month {payment.easyPaymentMonth} - {payment.easyPaymentYear}
                    </p>
                    {/* <p className="text-sm text-gray-600">
                      Due Date: {new Date(payment.dueDate.$date).toLocaleDateString()}
                    </p> */}
                  </div>
                  <div className="text-right">
                    <p className="text-sm flex items-center gap-1 justify-end">
                      <DollarSign size={16} />
                      Amount: ${payment.amount}
                    </p>
                    {/* <p className="text-sm">Due: ${payment.dueAmount}</p> */}
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${payment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                        }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>

                {selectedPayment?._id === payment._id && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Payment Amount
                        </label>
                        <div className="mt-1 relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <input
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="pl-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Payment Date
                        </label>
                        <input
                          type="date"
                          value={paymentDate}
                          onChange={(e) => setPaymentDate(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Remaining Amount: ${calculateRemainingAmount(payment)}
                      </p>
                    </div>

                    <button
                      onClick={() => handlePaymentSubmit(payment)}
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={20} />
                      Update Payment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

PaymentModal.propTypes = {
  transaction: PropTypes.shape({
    _id: PropTypes.shape({
      $oid: PropTypes.string.isRequired
    }).isRequired,
    customerName: PropTypes.string.isRequired,
    customerNIC: PropTypes.string.isRequired,
    transactionID: PropTypes.string.isRequired,
    product: PropTypes.shape({
      productName: PropTypes.string.isRequired
    }).isRequired,
    easyPayment: PropTypes.shape({
      payments: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.shape({
            $oid: PropTypes.string.isRequired
          }).isRequired,
          amount: PropTypes.number.isRequired,
          dueAmount: PropTypes.number.isRequired,
          dueDate: PropTypes.shape({
            $date: PropTypes.string.isRequired
          }).isRequired,
          easyPaymentMonth: PropTypes.number.isRequired,
          easyPaymentYear: PropTypes.number.isRequired,
          status: PropTypes.string.isRequired
        })
      ).isRequired
    }).isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onPaymentUpdate: PropTypes.func.isRequired
};

export default PaymentModal;