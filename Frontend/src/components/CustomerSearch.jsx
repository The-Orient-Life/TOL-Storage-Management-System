import React, { useState } from 'react';
import { Search, UserPlus, User, X, Package, CreditCard, AlertTriangle, RotateCcw, ChevronRight, Calendar, Clock, CheckCircle } from 'lucide-react';


function CustomerSearch() {


  const [nicSearch, setNicSearch] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formData, setFormData] = useState({
    nic: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    totalPurchases: 0,
    products: [],
    easyPayments: [],
    returnedProducts: [],
    totalPenalty: 0
  });

  // Simulated database - replace with actual API calls
  const mockSearchUser = (nic) => {
    // Simulate API call
    if (nic === '123456789V') {
      return {
        nic: '123456789V',
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+94 77 123 4567',
        address: '123 Main St, Colombo',
        totalPurchases: 5,
        products: [
          {
            id: 'P1',
            name: 'Samsung TV 55"',
            purchaseDate: '2024-02-15',
            price: 150000,
            status: 'ongoing'
          },
          {
            id: 'P2',
            name: 'iPhone 15',
            purchaseDate: '2024-01-10',
            price: 250000,
            status: 'completed'
          }
        ],
        easyPayments: [
          {
            productId: 'P1',
            productName: 'Samsung TV 55"',
            totalMonths: 24,
            paidMonths: 6,
            monthlyAmount: 6250,
            startDate: '2023-09-15',
            penalty: 1000,
            penaltyReason: 'Late payment for February 2024',
            nextPaymentDate: '2024-03-15',
            paymentHistory: [
              {
                date: '2024-02-20',
                amount: 6250,
                status: 'late',
                penaltyAmount: 1000,
                penaltyReason: 'Payment received 5 days late'
              },
              {
                date: '2024-01-15',
                amount: 6250,
                status: 'on-time'
              },
              {
                date: '2023-12-15',
                amount: 6250,
                status: 'on-time'
              }
            ]
          }
        ],
        returnedProducts: [
          {
            id: 'R1',
            productName: 'Laptop Asus',
            returnDate: '2024-01-05',
            reason: 'Display defect',
            refundAmount: 125000
          }
        ],
        totalPenalty: 1000
      };
    }
    return null;
  };

  const handleSearch = () => {
    const result = mockSearchUser(nicSearch);
    if (result) {
      setUserData(result);
      setIsAddingUser(false);
    } else {
      setUserData(null);
      setIsAddingUser(true);
      setFormData({ ...formData, nic: nicSearch });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({
      nic: '',
      fullName: '',
      email: '',
      phone: '',
      address: '',
      totalPurchases: 0,
      products: [],
      easyPayments: [],
      returnedProducts: [],
      totalPenalty: 0
    });
    setIsAddingUser(false);
    setNicSearch('');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  return (
    <div>


      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Customer Management System</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="max-w-xl">
              <label htmlFor="nic" className="block text-sm font-medium text-gray-700 mb-2">
                Search by NIC Number
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    id="nic"
                    value={nicSearch}
                    onChange={(e) => setNicSearch(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter NIC number"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Customer Details and History */}
          {userData && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <User className="h-6 w-6 text-blue-600" />
                    <h2 className="ml-2 text-xl font-semibold text-gray-900">Customer Details</h2>
                  </div>
                  <button
                    onClick={() => setUserData(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">NIC Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userData.nic}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userData.fullName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userData.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userData.phone}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userData.address}</dd>
                  </div>
                </dl>
              </div>

              {/* Purchase Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <Package className="h-6 w-6 text-blue-600" />
                  <h2 className="ml-2 text-xl font-semibold text-gray-900">Purchase History</h2>
                </div>
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Product</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {userData.products.map((product) => (
                        <tr key={product.id}>
                          <td className="py-4 pl-4 pr-3 text-sm text-gray-900">{product.name}</td>
                          <td className="px-3 py-4 text-sm text-gray-500">{formatDate(product.purchaseDate)}</td>
                          <td className="px-3 py-4 text-sm text-gray-500">{formatCurrency(product.price)}</td>
                          <td className="px-3 py-4 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === 'completed' ? 'bg-green-100 text-green-800' :
                                product.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                                  'bg-red-100 text-red-800'
                              }`}>
                              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Easy Payments */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                  <h2 className="ml-2 text-xl font-semibold text-gray-900">Easy Payments</h2>
                </div>
                {userData.easyPayments.map((payment) => (
                  <div key={payment.productId} className="border rounded-lg p-6 mb-4 bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{payment.productName}</h3>
                        <p className="text-sm text-gray-500 mt-1">Started on {formatDate(payment.startDate)}</p>
                      </div>
                      {payment.penalty > 0 && (
                        <div className="flex items-start bg-red-50 text-red-700 px-4 py-2 rounded-lg">
                          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Penalty: {formatCurrency(payment.penalty)}</p>
                            <p className="text-sm mt-1">{payment.penaltyReason}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-2">Payment Progress</p>
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(payment.paidMonths / payment.totalMonths) * 100}%` }}
                            />
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-900">
                            {payment.paidMonths}/{payment.totalMonths} months
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">Next Payment</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              {formatDate(payment.nextPaymentDate)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Monthly Amount</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              {formatCurrency(payment.monthlyAmount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base font-medium text-gray-900">Payment History</h4>
                        <button
                          onClick={() => setSelectedPayment(selectedPayment === payment.productId ? null : payment.productId)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                        >
                          {selectedPayment === payment.productId ? 'Hide Details' : 'Show Details'}
                          <ChevronRight className={`h-4 w-4 ml-1 transform transition-transform ${selectedPayment === payment.productId ? 'rotate-90' : ''
                            }`} />
                        </button>
                      </div>

                      {selectedPayment === payment.productId && (
                        <div className="space-y-4">
                          {payment.paymentHistory.map((history, index) => (
                            <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                              <div className={`rounded-full p-2 mr-4 ${history.status === 'on-time' ? 'bg-green-100' :
                                  history.status === 'late' ? 'bg-red-100' :
                                    'bg-yellow-100'
                                }`}>
                                {history.status === 'on-time' ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : history.status === 'late' ? (
                                  <Clock className="h-5 w-5 text-red-600" />
                                ) : (
                                  <Calendar className="h-5 w-5 text-yellow-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-gray-900">{formatDate(history.date)}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                      Payment {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-gray-900">{formatCurrency(history.amount)}</p>
                                    {history.penaltyAmount && (
                                      <p className="text-sm text-red-600 mt-1">
                                        Penalty: {formatCurrency(history.penaltyAmount)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {history.penaltyReason && (
                                  <p className="text-sm text-red-600 mt-2">
                                    {history.penaltyReason}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Returns */}
              {userData.returnedProducts.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <RotateCcw className="h-6 w-6 text-blue-600" />
                    <h2 className="ml-2 text-xl font-semibold text-gray-900">Returned Products</h2>
                  </div>
                  <div className="space-y-4">
                    {userData.returnedProducts.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-base font-medium text-gray-900">{product.productName}</h4>
                            <p className="mt-1 text-sm text-gray-500">Returned on {formatDate(product.returnDate)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Refund Amount</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">{formatCurrency(product.refundAmount)}</p>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Reason: </span>
                          {product.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Add New User Form */}
          {isAddingUser && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <UserPlus className="h-6 w-6 text-blue-600" />
                <h2 className="ml-2 text-xl font-semibold text-gray-900">Add New Customer</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="form-nic" className="block text-sm font-medium text-gray-700">
                      NIC Number
                    </label>
                    <input
                      type="text"
                      id="form-nic"
                      value={formData.nic}
                      onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingUser(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Customer
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>


    </div>
  )
}

export default CustomerSearch
