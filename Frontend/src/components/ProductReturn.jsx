import React, { useState } from 'react';
import { Search, Plus, MoreVertical, X } from 'lucide-react';

const Returns = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReturn, setNewReturn] = useState({
    customer: '',
    product: '',
    reason: '',
  });
  const [returns, setReturns] = useState([
    {
      id: 1,
      customer: 'John Doe',
      product: 'Xiaomi Note 9',
      returnDate: '2024-02-21',
      reason: 'Defective',
      status: 'Pending',
    },
    {
      id: 2,
      customer: 'Jane Smith',
      product: 'Innovex TV',
      returnDate: '2024-02-19',
      reason: 'Wrong Product',
      status: 'Approved',
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReturnItem = {
      id: returns.length + 1,
      ...newReturn,
      returnDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setReturns([...returns, newReturnItem]);
    setNewReturn({ customer: '', product: '', reason: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">New Return Request</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={newReturn.customer}
                  onChange={(e) => setNewReturn({ ...newReturn, customer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={newReturn.product}
                  onChange={(e) => setNewReturn({ ...newReturn, product: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Return Reason
                </label>
                <select
                  required
                  value={newReturn.reason}
                  onChange={(e) => setNewReturn({ ...newReturn, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a reason</option>
                  <option value="Defective">Defective</option>
                  <option value="Wrong Product">Wrong Product</option>
                  <option value="Not as Described">Not as Described</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Submit Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Returns Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Return
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search returns..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {returns.map((return_) => (
                <tr key={return_.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{return_.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{return_.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{return_.returnDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{return_.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        return_.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : return_.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {return_.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-800">Process Return</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {returns.map((return_) => (
            <div key={return_.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{return_.customer}</h3>
                  <p className="text-sm text-gray-500">{return_.product}</p>
                </div>
                <div className="relative">
                  <button className="p-1 hover:bg-gray-100 rounded-full">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Return Date:</span>
                  <span className="text-gray-900">{return_.returnDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Reason:</span>
                  <span className="text-gray-900">{return_.reason}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      return_.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : return_.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {return_.status}
                  </span>
                </div>
                <button className="w-full mt-3 text-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  Process Return
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Returns;