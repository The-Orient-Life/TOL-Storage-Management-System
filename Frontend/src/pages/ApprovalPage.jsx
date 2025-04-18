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
    const apiUrl = import.meta.env.VITE_APP_BACKENDGETTRS;
    axios
      .get(apiUrl) // Replace with your backend URL
      .then((response) => {
        setTransactions(response.data.transactions); // Set transactions in state
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      });
  }, []);



  // Function to send the transactionID to the API
  const approveTransaction = async (transactionID) => {
    const storedUserDetails = sessionStorage.getItem('UserDetails');
    let userName = '';

    if (storedUserDetails) {
      const parsedUserDetails = JSON.parse(storedUserDetails);
      if (parsedUserDetails?.data?.userName) {
        userName = parsedUserDetails.data.userName;

      }
    }
    try {


      // Define the API URL (make sure to replace it with your actual endpoint)
      const apiUrl = import.meta.env.VITE_APP_BACKENDAPPROVAL; // Example URL

      // Send POST request to the backend API
      const response = await axios.post(apiUrl, { transactionID, AdminName: userName, });


      // Updated product information

    } catch (error) {
      // Handle any errors that occur during the API request
      console.error('Error:', error.response ? error.response.data.message : error.message);
    }
  };

  const handleApprove = (transactionId) => {

    // Add your approval logic here
    approveTransaction(transactionId);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Approved Success !",
      showConfirmButton: false,
      iconColor: "#4BB543",
      timer: 2000,
    }).then(() => {
      // Refresh the page after the Swal closes
      window.location.reload();
    });
  };

  const handleDecline = (transactionId) => {

    // Add your decline logic here
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Approved Declined !",
      showConfirmButton: false,
      iconColor: "#F72C5B",
      timer: 2000,
    }).then(() => {
      // Refresh the page after the Swal closes
      window.location.reload();
    });
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