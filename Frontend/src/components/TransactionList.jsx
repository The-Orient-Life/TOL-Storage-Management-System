import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search, AlertCircle } from 'lucide-react';
import PaymentModal from '../components/PaymentModel';
import axios from "axios";

const mockTransactions = [
    {
        _id: { $oid: "67e7a25c88fe2d3014bade18" },
        transactionID: "098a6415-b54e-4799-a55f-e79d0db56562",
        customerName: "Anusha Lakmali",
        customerNIC: "123456789V",
        product: {
            productID: "67e6864c71e4e10a6905634a",
            productName: "Dell V3",
            productQuantity: 1
        },
        easyPayment: {
            payments: [
                {
                    _id: { $oid: "67e7a25c88fe2d3014bade1c" },
                    amount: 6,
                    doneDate: { $date: "2025-03-29T07:33:48.320Z" },
                    dueAmount: 18,
                    dueDate: { $date: "2025-04-29T07:33:48.320Z" },
                    easyPaymentMonth: 1,
                    easyPaymentYear: 2025,
                    status: "pending"
                },
                {
                    _id: { $oid: "67e7a25c88fe2d3014bade1d" },
                    amount: 6,
                    doneDate: { $date: "2025-03-29T07:33:48.320Z" },
                    dueAmount: 12,
                    dueDate: { $date: "2025-05-29T07:33:48.320Z" },
                    easyPaymentMonth: 2,
                    easyPaymentYear: 2025,
                    status: "pending"
                },
                {
                    _id: { $oid: "67e7a25c88fe2d3014bade1e" },
                    amount: 6,
                    doneDate: { $date: "2025-03-29T07:33:48.321Z" },
                    dueAmount: 6,
                    dueDate: { $date: "2025-06-29T07:33:48.321Z" },
                    easyPaymentMonth: 3,
                    easyPaymentYear: 2025,
                    status: "pending"
                }
            ]
        },
        status: "Pending"
    },
    {
        _id: { $oid: "67e7a25c88fe2d3014bade18" },
        transactionID: "098a6415-b54e-4799-a55f-e79d0db56562",
        customerName: "Anusha Lakmali",
        customerNIC: "123456789V",
        product: {
            productID: "67e6864c71e4e10a6905634a",
            productName: "Dell V3",
            productQuantity: 1
        },
        easyPayment: {
            payments: [
                {
                    _id: { $oid: "67e7a25c88fe2d3014bade1c" },
                    amount: 6,
                    doneDate: { $date: "2025-03-29T07:33:48.320Z" },
                    dueAmount: 18,
                    dueDate: { $date: "2025-04-29T07:33:48.320Z" },
                    easyPaymentMonth: 1,
                    easyPaymentYear: 2025,
                    status: "pending"
                },
                {
                    _id: { $oid: "67e7a25c88fe2d3014bade1d" },
                    amount: 6,
                    doneDate: { $date: "2025-03-29T07:33:48.320Z" },
                    dueAmount: 12,
                    dueDate: { $date: "2025-05-29T07:33:48.320Z" },
                    easyPaymentMonth: 2,
                    easyPaymentYear: 2025,
                    status: "pending"
                },
                {
                    _id: { $oid: "67e7a25c88fe2d3014bade1e" },
                    amount: 6,
                    doneDate: { $date: "2025-03-29T07:33:48.321Z" },
                    dueAmount: 6,
                    dueDate: { $date: "2025-06-29T07:33:48.321Z" },
                    easyPaymentMonth: 3,
                    easyPaymentYear: 2025,
                    status: "pending"
                }
            ]
        },
        status: "Pending"
    }
];

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

        try {
            // Make an API call to the backend to get transactions by customerNIC
            const response = await axios.get(`http://localhost:3001/api/customer/${searchNIC}`);

            if (response.data.success) {
                setSearchResults(response.data.data); // Set the search results to the data from the API
                console.log("This data from backend ",response)
                setSearchPerformed(true);
                console.log("This Is Data ",response)
                // setIsModalOpen(true);
            } else {
                setSearchResults([]);
                setSearchPerformed(true);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setSearchResults([]);
            setSearchPerformed(true);
        }

        // // Simulate API call with mock data
        // const results = searchResults.filter(
        //     transaction => transaction.customerNIC.toLowerCase().includes(searchNIC.toLowerCase())
        // );
        // setSearchResults(results);
        // setSearchPerformed(true);
    };

    const handleTransactionClick = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const handlePaymentUpdate = (transactionId, paymentUpdate) => {
        console.log('Payment Update:', { transactionId, ...paymentUpdate });
        // Here you would typically make an API call to update the payment
        setIsModalOpen(false);
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