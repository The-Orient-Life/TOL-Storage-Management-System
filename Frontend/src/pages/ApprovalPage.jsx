import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import Swal from "sweetalert2";

function TransactionRow({ transaction, expandedRow, toggleExpand, handleApprove, handleDecline, formatDate }) {
  const isExpanded = expandedRow === transaction.transactionID;

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
          <button
            onClick={() => toggleExpand(transaction.transactionID)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {transaction.transactionID}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{transaction.customerName}</div>
          <div className="text-sm text-gray-500">{transaction.customerNIC}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{transaction.product.productName}</div>
          <div className="text-sm text-gray-500">Qty: {transaction.product.productQuantity}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            {transaction.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-4">
            <button
              onClick={() => handleApprove(transaction.transactionID)}
              className="text-green-600 hover:text-green-900 transition-colors p-1 hover:bg-green-50 rounded-full"
            >
              <Check size={20} />
            </button>
            <button
              onClick={() => handleDecline(transaction.transactionID)}
              className="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className="px-6 py-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Executive Details</h4>
                <p className="text-sm text-gray-600">Name: {transaction.executive.executiveName}</p>
                <p className="text-sm text-gray-600">NIC: {transaction.executive.executiveNIC}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Payment Details</h4>
                <p className="text-sm text-gray-600">Method: {transaction.paymentMethod}</p>
                <p className="text-sm text-gray-600">Branch: {transaction.branch}</p>
              </div>
              <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Guarantors</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {transaction.guarantors.map((guarantor) => (
                    <div key={guarantor._id.$oid} className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                      <p>Name: {guarantor.guarantorName}</p>
                      <p>NIC: {guarantor.guarantorNIC}</p>
                    </div>
                  ))}
                </div>
              </div>
              {transaction.easyPayment && (
                <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Payment Schedule</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {transaction.easyPayment.payments.map((payment) => (
                      <div key={payment._id.$oid} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">Month {payment.easyPaymentMonth}</p>
                        <p className="text-sm text-gray-600">Due: ${payment.dueAmount.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Date: {formatDate(payment.dueDate.$date)}</p>
                        <span className="mt-2 inline-block text-xs font-semibold text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full">
                          {payment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

TransactionRow.propTypes = {
  transaction: PropTypes.shape({
    _id: PropTypes.shape({
      $oid: PropTypes.string.isRequired,
    }).isRequired,
    transactionID: PropTypes.string.isRequired,
    customerName: PropTypes.string.isRequired,
    customerNIC: PropTypes.string.isRequired,
    product: PropTypes.shape({
      productName: PropTypes.string.isRequired,
      productQuantity: PropTypes.number.isRequired,
    }).isRequired,
    status: PropTypes.string.isRequired,
    executive: PropTypes.shape({
      executiveName: PropTypes.string.isRequired,
      executiveNIC: PropTypes.string.isRequired,
    }).isRequired,
    paymentMethod: PropTypes.string.isRequired,
    branch: PropTypes.string.isRequired,
    guarantors: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.shape({
          $oid: PropTypes.string.isRequired,
        }).isRequired,
        guarantorName: PropTypes.string.isRequired,
        guarantorNIC: PropTypes.string.isRequired,
      })
    ).isRequired,
    easyPayment: PropTypes.shape({
      payments: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.shape({
            $oid: PropTypes.string.isRequired,
          }).isRequired,
          amount: PropTypes.number.isRequired,
          dueAmount: PropTypes.number.isRequired,
          dueDate: PropTypes.shape({
            $date: PropTypes.string.isRequired,
          }).isRequired,
          easyPaymentMonth: PropTypes.number.isRequired,
          status: PropTypes.string.isRequired,
        })
      ).isRequired,
    }),
  }).isRequired,
  expandedRow: PropTypes.string,
  toggleExpand: PropTypes.func.isRequired,
  handleApprove: PropTypes.func.isRequired,
  handleDecline: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
};

function Approval() {
  const [expandedRow, setExpandedRow] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch transactions from the backend
    axios
      .get('http://localhost:3001/api/gettransactions') // Replace with your backend URL
      .then((response) => {
        setTransactions(response.data.transactions); // Set transactions in state
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      });
  }, []);

  // Sample transactions array with multiple entries
//   const transactions = Array(10).fill().map((_, index) => ({
//     "_id": { "$oid": `67e51f9094869bf16116ca2${index}` },
//     "transactionID": `e2360f12-a096-4e3d-8a14-adc09b4864${index}f`,
//     "customerName": `Customer ${index + 1}`,
//     "customerNIC": "123456789V",
//     "product": {
//       "productID": "67e5057febfcab56e22f22f7",
//       "productName": "HG 21 Headset",
//       "productQuantity": 1
//     },
//     "executive": {
//       "executiveName": "Kesari",
//       "executiveNIC": "112233445V",
//       "_id": { "$oid": "67e51f9094869bf16116ca22" }
//     },
//     "guarantors": [
//       {
//         "guarantorName": "Guarantor 1",
//         "guarantorNIC": "987654321V",
//         "_id": { "$oid": "67d15103b7d6897c350c9400" }
//       },
//       {
//         "guarantorName": "Guarantor 2",
//         "guarantorNIC": "89765231",
//         "_id": { "$oid": "67d15103b7d6897c350c9401" }
//       }
//     ],
//     "easyPayment": {
//       "payments": [
//         {
//           "amount": 66.67,
//           "doneDate": { "$date": "2025-03-27T09:51:12.898Z" },
//           "dueAmount": 200,
//           "dueDate": { "$date": "2025-04-27T09:51:12.898Z" },
//           "easyPaymentMonth": 1,
//           "easyPaymentYear": 2025,
//           "status": "pending",
//           "_id": { "$oid": `67e51f9094869bf16116ca${index}5` }
//         },
//         {
//           "amount": 66.67,
//           "doneDate": { "$date": "2025-03-27T09:51:12.898Z" },
//           "dueAmount": 133.33,
//           "dueDate": { "$date": "2025-05-27T09:51:12.898Z" },
//           "easyPaymentMonth": 2,
//           "easyPaymentYear": 2025,
//           "status": "pending",
//           "_id": { "$oid": `67e51f9094869bf16116ca${index}6` }
//         },
//         {
//           "amount": 66.67,
//           "doneDate": { "$date": "2025-03-27T09:51:12.898Z" },
//           "dueAmount": 66.67,
//           "dueDate": { "$date": "2025-06-27T09:51:12.898Z" },
//           "easyPaymentMonth": 3,
//           "easyPaymentYear": 2025,
//           "status": "pending",
//           "_id": { "$oid": `67e51f9094869bf16116ca${index}7` }
//         }
//       ]
//     },
//     "paymentMethod": "Full Payment",
//     "branch": "Katana",
//     "status": "Pending",
//     "headAdminApproval": false,
//     "penalty": null,
//     "createdAt": { "$date": "2025-03-27T09:51:12.918Z" },
//     "updatedAt": { "$date": "2025-03-27T09:51:12.918Z" }
//   }));

  const handleApprove = (transactionId) => {
    console.log(`Approved transaction: ${transactionId}`);
    // Add your approval logic here
  };

  const handleDecline = (transactionId) => {
    console.log(`Declined transaction: ${transactionId}`);
    // Add your decline logic here
  };

  const toggleExpand = (transactionId) => {
    setExpandedRow(expandedRow === transactionId ? null : transactionId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Transaction Management</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border-b border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expand
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <TransactionRow
                        key={transaction._id.$oid}
                        transaction={transaction}
                        expandedRow={expandedRow}
                        toggleExpand={toggleExpand}
                        handleApprove={handleApprove}
                        handleDecline={handleDecline}
                        formatDate={formatDate}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Approval;