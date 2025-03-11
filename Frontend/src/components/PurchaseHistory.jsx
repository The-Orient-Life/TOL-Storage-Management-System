import React, { useState } from 'react';
import { Search, Calendar, DollarSign, User } from 'lucide-react';

const PurchaseHistory = () => {
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const purchases = [
    {
      id: 1,
      customer: 'John Doe',
      product: 'Xiaomi Note 9',
      date: '2024-02-20',
      amount: 999,
      status: 'Completed',
      paymentType: 'Full Payment',
    },
    {
      id: 2,
      customer: 'Jane Smith',
      product: 'Innovex TV',
      date: '2024-02-18',
      amount: 1500,
      status: 'In Progress',
      paymentType: 'Easy Payment (6 months)',
      installments: {
        total: 6,
        paid: 2,
        monthlyAmount: 250,
        nextPayment: '2024-03-18',
        payments: [
          { date: '2024-02-18', amount: 250, status: 'Paid' },
          { date: '2024-03-18', amount: 250, status: 'Pending' },
          { date: '2024-04-18', amount: 250, status: 'Pending' },
          { date: '2024-05-18', amount: 250, status: 'Pending' },
          { date: '2024-06-18', amount: 250, status: 'Pending' },
          { date: '2024-07-18', amount: 250, status: 'Pending' },
        ]
      }
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Purchase History</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search purchases..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select className="border border-gray-300 rounded-lg px-4 py-2">
                <option>All Status</option>
                <option>Completed</option>
                <option>In Progress</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchases.map((purchase) => (
                    <tr 
                      key={purchase.id}
                      className={`hover:bg-gray-50 cursor-pointer ${selectedPurchase === purchase.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedPurchase(purchase.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{purchase.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{purchase.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{purchase.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${purchase.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{purchase.paymentType}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            purchase.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {purchase.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-800">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedPurchase && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
              {purchases.find(p => p.id === selectedPurchase)?.installments ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Next Payment</p>
                      <p className="text-lg font-semibold text-blue-600">
                        ${purchases.find(p => p.id === selectedPurchase)?.installments?.monthlyAmount}
                      </p>
                    </div>
                    <Calendar className="text-blue-600 w-6 h-6" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Installments Paid</p>
                      <p className="text-lg font-semibold">
                        {purchases.find(p => p.id === selectedPurchase)?.installments?.paid} of {purchases.find(p => p.id === selectedPurchase)?.installments?.total}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Next Due Date</p>
                      <p className="text-lg font-semibold">
                        {purchases.find(p => p.id === selectedPurchase)?.installments?.nextPayment}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Payment Schedule</h4>
                    {purchases.find(p => p.id === selectedPurchase)?.installments?.payments.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{payment.date}</p>
                          <p className="text-sm text-gray-600">${payment.amount}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            payment.status === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Full payment completed</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;