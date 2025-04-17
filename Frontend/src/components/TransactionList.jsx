import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search, AlertCircle } from 'lucide-react';
import PaymentModal from '../components/PaymentModel';
import axios from "axios";


const TransactionList = () => {
    const [searchNIC, setSearchNIC] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const handleSearch = async () => {
        if (!searchNIC.trim()) {
            setSearchResults([]);
            setSearchPerformed(false);
            return;
        }
        const apiUrl = import.meta.env.VITE_APP_BACKENDCUSF
        try {
            // Make an API call to the backend to get transactions by customerNIC
            const response = await axios.get(`${apiUrl}/${searchNIC}`);

            if (response.data.success) {
                setSearchResults(response.data.data); // Set the search results to the data from the API

                setSearchPerformed(true);


            } else {
                setSearchResults([]);
                setSearchPerformed(true);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setSearchResults([]);
            setSearchPerformed(true);
        }


    };

    const handleTransactionClick = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };



    const handlePaymentUpdate = async (transactionId, paymentUpdate) => {




        // Prepare the payload for the API request
        const paymentData = {
            paymentId: paymentUpdate.paymentId,
            paymentAmount: paymentUpdate.amount,
        };

        try {
            const apiUrl = import.meta.env.VITE_APP_BACKENDCUSP
            // Send a POST request to the backend API
            const response = await axios.post(apiUrl, paymentData);



            // Close the modal or perform any other UI update
            setIsModalOpen(false);

        } catch (error) {
            // Handle any errors that occur during the API call
            console.error('Error processing payment:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Enter customer NIC number"
                        value={searchNIC}
                        onChange={(e) => setSearchNIC(e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
                    >
                        <Search size={20} />
                        Search
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Transaction List</h2>

                {searchPerformed && searchResults.length === 0 ? (
                    <div className="flex items-center justify-center p-8 text-gray-500 bg-gray-50 rounded-lg">
                        <AlertCircle className="mr-2" size={20} />
                        <p>No transactions found for this NIC number</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {searchResults.map((transaction) => (
                            <div
                                key={transaction._id.$oid}
                                onClick={() => handleTransactionClick(transaction)}
                                className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{transaction.customerName}</p>
                                        <p className="text-sm text-gray-600">NIC: {transaction.customerNIC}</p>
                                        <p className="text-sm text-gray-600">Product: {transaction.product.productName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Transaction ID:</p>
                                        <p className="text-sm font-mono">{transaction.transactionID}</p>
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {transaction.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && selectedTransaction && (
                <PaymentModal
                    transaction={selectedTransaction}
                    onClose={() => setIsModalOpen(false)}
                    onPaymentUpdate={(update) => handlePaymentUpdate(selectedTransaction._id.$oid, update)}
                />
            )}
        </div>
    );
};

TransactionList.propTypes = {
    onPaymentUpdate: PropTypes.func
};

export default TransactionList;