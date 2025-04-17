import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  Package,
  Wallet,
  CheckCircle2,
  Clock,
  Calendar,
  CalendarDays,
  ChevronDown
} from 'lucide-react';
import axios from 'axios';
import Swal from "sweetalert2";

function Report() {
  const [showTransactionOptions, setShowTransactionOptions] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');



  const handleOptionClick = async (optionName) => {
    try {
      let url = '';
      let filename = '';

      if (optionName === 'Products') {
        url = 'http://localhost:3001/api/export-products';
        filename = `products-${selectedPeriod}.xlsx`;
      } else if (optionName === 'Customers') {
        url = 'http://localhost:3001/api/export-customers';
        filename = `customers-${selectedPeriod}.xlsx`;
      } else {
        url = 'http://localhost:3001/api/export-transactionsTest';
        filename = `transactions-${optionName}-${selectedPeriod}.xlsx`;
      }

      const response = await axios.get(url, {
        params: {
          optionName,
          selectedPeriod,
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Failed to export ${optionName.toLowerCase()}!`,
      });
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white/70 backdrop-blur-lg sticky top-0 z-10 border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-indigo-900 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-indigo-600" />
            Report Generation Dashboard
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Time Period Filters */}
        <div className="mb-12 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setSelectedPeriod('weekly')}
            className={`flex items-center gap-2 px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 ${selectedPeriod === 'weekly'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                : 'bg-white text-indigo-600 hover:bg-indigo-50'
              }`}
          >
            <Calendar className="h-5 w-5" />
            Weekly Report
          </button>
          <button
            onClick={() => setSelectedPeriod('monthly')}
            className={`flex items-center gap-2 px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 ${selectedPeriod === 'monthly'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                : 'bg-white text-indigo-600 hover:bg-indigo-50'
              }`}
          >
            <CalendarDays className="h-5 w-5" />
            Monthly Report
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Main Report Types */}
          <div className="relative">
            <button
              onClick={() => setShowTransactionOptions(!showTransactionOptions)}
              className="w-full bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all duration-200 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:via-indigo-500/5 group-hover:to-indigo-500/0 transition-all duration-500"></div>
              <div className="flex items-center gap-6">
                <div className="bg-indigo-100 p-4 rounded-xl group-hover:bg-indigo-200 transition-colors">
                  <Wallet className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="text-left flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
                  <p className="text-gray-500 mt-1">View transaction reports</p>
                </div>
                <ChevronDown className={`h-6 w-6 text-gray-400 transition-transform duration-200 ${showTransactionOptions ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Transaction Options Dropdown */}
            <div className={`mt-4 space-y-4 transition-all duration-200 ${showTransactionOptions ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
              <button
                className="w-full bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 transform hover:translate-x-2"
                onClick={() => handleOptionClick('Completed Payments')}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Completed Payments</h3>
                    <p className="text-sm text-gray-500">View successful transactions</p>
                  </div>
                </div>
              </button>

              <button
                className="w-full bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 transform hover:translate-x-2"
                onClick={() => handleOptionClick('Ongoing Payments')}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Ongoing Payments</h3>
                    <p className="text-sm text-gray-500">View pending transactions</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <button
            className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all duration-200 group relative overflow-hidden"
            onClick={() => handleOptionClick('Products')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:via-green-500/5 group-hover:to-green-500/0 transition-all duration-500"></div>
            <div className="flex items-center gap-6">
              <div className="bg-green-100 p-4 rounded-xl group-hover:bg-green-200 transition-colors">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-semibold text-gray-900">Products</h2>
                <p className="text-gray-500 mt-1">View product analytics</p>
              </div>
            </div>
          </button>

          <button
            className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all duration-200 group relative overflow-hidden"
            onClick={() => handleOptionClick('Customers')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-blue-500/5 group-hover:to-blue-500/0 transition-all duration-500"></div>
            <div className="flex items-center gap-6">
              <div className="bg-blue-100 p-4 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-semibold text-gray-900">Customers</h2>
                <p className="text-gray-500 mt-1">View customer insights</p>
              </div>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}

export default Report;
