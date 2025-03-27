import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CheckCircleIcon, XCircleIcon, ArrowUpIcon, ArrowDownIcon, CurrencyDollarIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
const data = [
  { name: 'Jan', easyPayment: 4000, cashPayment: 2400 },
  { name: 'Feb', easyPayment: 3000, cashPayment: 1398 },
  { name: 'Mar', easyPayment: 2000, cashPayment: 9800 },
  { name: 'Apr', easyPayment: 2780, cashPayment: 3908 },
  { name: 'May', easyPayment: 1890, cashPayment: 4800 },
  { name: 'Jun', easyPayment: 2390, cashPayment: 3800 },
];

const pendingPayments = [
  {
    id: 1,
    customer: "John Doe",
    amount: "$2,500",
    date: "2023-12-20",
    status: "pending"
  },
  {
    id: 2,
    customer: "Jane Smith",
    amount: "$1,800",
    date: "2023-12-19",
    status: "pending"
  },
  {
    id: 3,
    customer: "Mike Johnson",
    amount: "$3,200",
    date: "2023-12-18",
    status: "pending"
  }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/approval'); // replace with your target route
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Payment Dashboard</h1>
          <div className="flex gap-2">
            {/* <button 
              onClick={() => setSelectedPeriod('monthly')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedPeriod === 'monthly' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Monthly
            </button> */}
            {/* <button 
              onClick={() => setSelectedPeriod('yearly')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedPeriod === 'yearly' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Yearly
            </button> */}
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="h-7 w-7 text-green-600" />
              </div>
              <span className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                12%
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Total Easy Payments</h3>
            <p className="text-3xl font-bold text-gray-900 mb-2">$24,500</p>
            <p className="text-sm text-gray-500">Compared to last month</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserGroupIcon className="h-7 w-7 text-blue-600" />
              </div>
              <span className="flex items-center text-blue-600 text-sm font-medium">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                8%
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Total Cash Payments</h3>
            <p className="text-3xl font-bold text-gray-900 mb-2">$18,300</p>
            <p className="text-sm text-gray-500">Compared to last month</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
              onClick={handleClick}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-7 w-7 text-yellow-600" />
              </div>
              <span className="flex items-center text-yellow-600 text-sm font-medium">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                5
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Pending Approvals</h3>
            <p className="text-3xl font-bold text-gray-900 mb-2">12</p>
            <p className="text-sm text-gray-500">New requests today</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">Payment Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="easyPaymentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="cashPaymentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="easyPayment" 
                    stroke="#10B981" 
                    fillOpacity={1}
                    fill="url(#easyPaymentGradient)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cashPayment" 
                    stroke="#3B82F6" 
                    fillOpacity={1}
                    fill="url(#cashPaymentGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">Payment Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="easyPayment" 
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="cashPayment" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Approval Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Easy Payment Approvals</h3>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              {pendingPayments.length} Pending
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600">
                            {payment.customer.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{payment.customer}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{payment.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button className="p-1 rounded-full hover:bg-green-50 text-green-600 hover:text-green-900 transition-colors">
                          <CheckCircleIcon className="h-6 w-6" />
                        </button>
                        <button className="p-1 rounded-full hover:bg-red-50 text-red-600 hover:text-red-900 transition-colors">
                          <XCircleIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}