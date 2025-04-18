import React, { useState } from 'react';
import { Search, Plus, Phone, Mail, Calendar, CreditCard, AlertTriangle, RotateCcw, Shield } from 'lucide-react';


const CustomerList = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  const customers = [
    {
      id: 1,
      name: 'John Doe',
      phone: '123-456-7890',
      email: 'john@example.com',
      totalPurchases: 5,
      lastPurchase: '2024-02-20',
      activeInstallments: 0,
      totalSpent: 4500,
      returns: [
        {
          id: 1,
          product: 'Samsung TV',
          date: '2024-01-15',
          reason: 'Defective Screen',
          status: 'Approved',
        }
      ],
      penalties: []
    },
    {
      id: 2,
      name: 'Jane Smith',
      phone: '098-765-4321',
      email: 'jane@example.com',
      totalPurchases: 3,
      lastPurchase: '2024-02-18',
      activeInstallments: 1,
      totalSpent: 3500,
      currentInstallments: [
        {
          product: 'Innovex TV',
          totalAmount: 1500,
          remainingAmount: 1000,
          nextPayment: '2024-03-18',
          monthlyPayment: 250,
          penalties: [
            {
              date: '2024-02-10',
              amount: 25,
              reason: 'Late Payment',
              status: 'Unpaid'
            }
          ]
        }
      ],
      returns: [
        {
          id: 1,
          product: 'iPhone 13',
          date: '2024-02-01',
          reason: 'Wrong Model',
          status: 'Pending'
        }
      ],
      penalties: [
        {
          date: '2024-02-10',
          amount: 25,
          reason: 'Late Payment',
          status: 'Unpaid'
        }
      ]
    },
  ];

  const renderCustomerDetails = (customer) => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-lg font-semibold text-blue-600">
                  ${customer.totalSpent}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Active Installments</p>
                <p className="text-lg font-semibold text-blue-600">
                  {customer.activeInstallments}
                </p>
              </div>
            </div>

            {customer.currentInstallments && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Active Payment Plans</h4>
                {customer.currentInstallments.map((plan, index) => (
                  <div key={index} className="p-4 border border-blue-100 rounded-lg bg-blue-50">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="font-medium">{plan.product}</h5>
                      <span className="text-sm text-blue-600">
                        ${plan.monthlyPayment}/month
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Remaining Amount:</span>
                        <span className="font-medium">${plan.remainingAmount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Next Payment:</span>
                        <span className="font-medium">{plan.nextPayment}</span>
                      </div>
                      {plan.penalties && plan.penalties.length > 0 && (
                        <div className="mt-2 p-2 bg-red-50 rounded border border-red-100">
                          <div className="flex items-center text-red-600 text-sm mb-1">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            <span>Payment Penalties</span>
                          </div>
                          {plan.penalties.map((penalty, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{penalty.date}</span>
                              <span className="font-medium">${penalty.amount}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'returns':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Return History</h4>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Total: {customer.returns.length}
              </span>
            </div>
            {customer.returns.length > 0 ? (
              customer.returns.map((return_, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium">{return_.product}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs ${return_.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {return_.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Date: {return_.date}</p>
                    <p>Reason: {return_.reason}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <RotateCcw className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No returns history</p>
              </div>
            )}
          </div>
        );

      case 'penalties':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Payment Penalties</h4>
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                Total: {customer.penalties?.length || 0}
              </span>
            </div>
            {customer.penalties && customer.penalties.length > 0 ? (
              customer.penalties.map((penalty, index) => (
                <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-red-600">${penalty.amount}</p>
                      <p className="text-sm text-gray-600">{penalty.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${penalty.status === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {penalty.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Reason: {penalty.reason}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No payment penalties</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5 mr-2" />
            Add Customer
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returns</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penalties</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className={`hover:bg-gray-50 cursor-pointer ${selectedCustomer === customer.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedCustomer(customer.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {customer.returns?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${customer.penalties?.length ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {customer.penalties?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${customer.penalties?.length ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                        {customer.penalties?.length ? 'Has Penalties' : 'Good Standing'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        {selectedCustomer && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {customers.find(c => c.id === selectedCustomer) && (
              <>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-blue-600">
                      {customers.find(c => c.id === selectedCustomer)?.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">
                    {customers.find(c => c.id === selectedCustomer)?.name}
                  </h3>
                </div>

                <div className="flex border-b border-gray-200 mb-4">
                  <button
                    className={`flex-1 py-2 text-sm font-medium ${activeTab === 'info'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                    onClick={() => setActiveTab('info')}
                  >
                    Information
                  </button>
                  <button
                    className={`flex-1 py-2 text-sm font-medium ${activeTab === 'returns'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                    onClick={() => setActiveTab('returns')}
                  >
                    Returns
                  </button>
                  <button
                    className={`flex-1 py-2 text-sm font-medium ${activeTab === 'penalties'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                    onClick={() => setActiveTab('penalties')}
                  >
                    Penalties
                  </button>
                </div>

                {renderCustomerDetails(customers.find(c => c.id === selectedCustomer))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;