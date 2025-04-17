import React, { useState, useEffect } from 'react';
import { Search, UserPlus, AlertCircle, Calendar, CheckCircle2, Clock, CreditCard, DollarSign, User, Package } from 'lucide-react';
import axios from 'axios';

// Mock customer database with updated payment structure
const mockCustomerDB = [
  {
    id: 1,
    name: "Anusha Lakmali",
    nic: "123456789V",
    email: "anusha@example.com",
    transaction: {
      _id: { $oid: "67e77ef988fe2d3014badd0b" },
      transactionID: "66014373-cc4f-45fe-bfd3-0a026f46c832",
      customerName: "Anusha Lakmali",
      customerNIC: "123456789V",
      product: {
        productID: "67e6864c71e4e10a69056349",
        productName: "Dell V2",
        productQuantity: 1
      },
      easyPayment: {
        payments: Array.from({ length: 6 }, (_, i) => ({
          amount: 100,
          actualPaid: 0,
          doneDate: null,
          dueAmount: 600 - (i * 100),
          dueDate: new Date(2025, 3 + i, 29).toISOString(),
          easyPaymentMonth: i + 1,
          easyPaymentYear: 2025,
          status: "pending",
          _id: { $oid: `67e77ef988fe2d3014badd${i + 15}` }
        }))
      },
      status: "Pending",
      executive: {
        executiveName: "Kesari",
        executiveNIC: "112233445V",
        _id: { $oid: "67e77ef988fe2d3014badd0c" }
      },
      guarantors: [],
      paymentMethod: "Easy Payment",
      branch: "Katana",
      headAdminApproval: true,
      penalty: null,
      createdAt: "2025-03-29T05:02:49.415Z",
      updatedAt: "2025-03-29T05:03:26.104Z"
    }
  }
];

function SearchBar({ onSearch }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search customer by NIC number..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full pl-10 pr-24 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Search
      </button>
    </form>
  );
}

function PaymentSummary({ payments }) {
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = payments.reduce((sum, payment) => sum + (payment.actualPaid || 0), 0);
  const remainingAmount = totalAmount - paidAmount;
  const completedPayments = payments.filter(p => p.status === 'completed').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-xl font-bold">${totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Paid Amount</p>
            <p className="text-xl font-bold">${paidAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <AlertCircle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Remaining</p>
            <p className="text-xl font-bold">${remainingAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-xl font-bold">{completedPayments} of {payments.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentHistory({ transaction, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [payments, setPayments] = useState(transaction.easyPayment.payments);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  const handlePaymentSubmit = (paymentId) => {
    if (!paymentAmount || paymentAmount <= 0) return;

    setPayments(prev => {
      const paymentIndex = prev.findIndex(p => p._id.$oid === paymentId);
      if (paymentIndex === -1) return prev;

      const newPayments = [...prev];
      const currentPayment = { ...newPayments[paymentIndex] };
      const extraPayment = paymentAmount - currentPayment.amount;

      // Update current payment
      currentPayment.actualPaid = paymentAmount;
      currentPayment.status = 'completed';
      currentPayment.doneDate = new Date().toISOString();
      newPayments[paymentIndex] = currentPayment;

      // If there's extra payment, distribute it to future payments
      if (extraPayment > 0) {
        let remainingExtra = extraPayment;
        for (let i = paymentIndex + 1; i < newPayments.length && remainingExtra > 0; i++) {
          const payment = { ...newPayments[i] };
          const amountToReduce = Math.min(remainingExtra, payment.amount);
          payment.amount -= amountToReduce;
          payment.dueAmount -= amountToReduce;
          remainingExtra -= amountToReduce;
          newPayments[i] = payment;
        }
      }

      return newPayments;
    });

    setPaymentAmount(0);
    setSelectedPaymentId(null);
  };

  const filteredPayments = payments.filter(payment => {
    const searchString = searchTerm.toLowerCase();
    return (
      payment.easyPaymentMonth.toString().includes(searchString) ||
      payment.easyPaymentYear.toString().includes(searchString) ||
      new Date(payment.dueDate).toLocaleDateString().toLowerCase().includes(searchString)
    );
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Payment History</h1>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>

          <CustomerInfo transaction={transaction} />
          <PaymentSummary payments={payments} />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by month, year, or due date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPayments.map(payment => (
            <PaymentCard
              key={payment._id.$oid}
              payment={payment}
              onPaymentSubmit={handlePaymentSubmit}
              transactionID={transaction.transactionID}
              isSelected={selectedPaymentId === payment._id.$oid}
              onSelect={() => setSelectedPaymentId(payment._id.$oid)}
              paymentAmount={paymentAmount}
              setPaymentAmount={setPaymentAmount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CustomerInfo({ transaction }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Easy Payment Management</h2>
        <span className={`
          px-3 py-1 rounded-full text-sm font-medium
          ${transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}
        `}>
          {transaction.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-gray-600">Customer</p>
            <p className="font-medium">{transaction.customerName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-gray-600">NIC</p>
            <p className="font-medium">{transaction.customerNIC}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-gray-600">Product</p>
            <p className="font-medium">{transaction.product.productName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-gray-600">Transaction ID</p>
            <p className="font-medium">{transaction.transactionID}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentCard({
  payment,
  onPaymentSubmit,
  transactionID,
  isSelected,
  onSelect,
  paymentAmount,
  setPaymentAmount
}) {
  const dueDate = new Date(payment.dueDate);
  const isOverdue = dueDate < new Date();
  const isPending = payment.status === 'pending';

  return (
    <div
      className={`
        p-4 rounded-lg shadow-sm transition-all cursor-pointer
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${isPending
          ? isOverdue
            ? 'bg-red-50 border border-red-200'
            : 'bg-white border border-gray-200'
          : 'bg-green-50 border border-green-200'
        }
      `}
      onClick={() => isPending && onSelect()}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">
            Payment {payment.easyPaymentMonth}
          </h3>
          <p className="text-sm text-gray-600">
            {payment.easyPaymentMonth}/{payment.easyPaymentYear}
          </p>
        </div>
        {isPending ? (
          <Clock className="w-5 h-5 text-gray-400" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            Due: {new Date(payment.dueDate).toLocaleDateString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Required: ${payment.amount}</p>
            <p className="text-sm text-gray-600">
              Total Remaining: ${payment.dueAmount}
            </p>
            {payment.actualPaid > 0 && (
              <p className="text-sm text-green-600">
                Paid: ${payment.actualPaid}
              </p>
            )}
          </div>

          {isPending && isSelected && (
            <div className="space-y-2">
              <input
                type="number"
                value={paymentAmount || ''}
                onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
                className="w-24 px-2 py-1 border border-gray-200 rounded-md text-sm"
                placeholder="Amount"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPaymentSubmit(payment._id.$oid);
                }}
                className="w-full px-3 py-1 rounded-full text-sm font-medium transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                Pay
              </button>
            </div>
          )}

          {!isPending && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
              Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function RegistrationForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    nic: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="nic" className="block text-sm font-medium text-gray-700 mb-1">
          NIC Number
        </label>
        <input
          type="text"
          id="nic"
          value={formData.nic}
          onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Register
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function CustomerManagement({ customer, onViewPaymentHistory }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Customer Details</h2>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          Active Customer
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Full Name</p>
          <p className="font-medium">{customer.name}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">NIC Number</p>
          <p className="font-medium">{customer.nic}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Email Address</p>
          <p className="font-medium">{customer.email}</p>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={onViewPaymentHistory}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Payment History
        </button>
      </div>
    </div>
  );
}

function NotFound({ onRegister }) {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <AlertCircle className="w-16 h-16 text-orange-500" />
      </div>
      <h2 className="text-xl font-semibold">Customer Not Found</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        We couldn't find a customer with the provided NIC number. Would you like to register a new customer?
      </p>
      <button
        onClick={onRegister}
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <UserPlus className="w-5 h-5" />
        Register New Customer
      </button>
    </div>
  );
}

function PaymentUpdate() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customer, setCustomer] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.length >= 3) {
      const foundCustomer = mockCustomerDB.find(c => c.nic.toLowerCase().includes(term.toLowerCase()));
      setCustomer(foundCustomer || null);
      setSearched(true);
    } else {
      setCustomer(null);
      setSearched(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management System</h1>
          <p className="text-gray-600">Search for existing customers or register new ones</p>
        </div>

        <SearchBar onSearch={handleSearch} />

        {!showRegistration && searched && (
          <div className="mt-8">
            {customer ? (
              <CustomerManagement
                customer={customer}
                onViewPaymentHistory={() => setShowPaymentHistory(true)}
              />
            ) : (
              <NotFound onRegister={() => setShowRegistration(true)} />
            )}
          </div>
        )}

        {showRegistration && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Register New Customer</h2>
            <RegistrationForm onClose={() => setShowRegistration(false)} />
          </div>
        )}

        {showPaymentHistory && customer && customer.transaction && (
          <PaymentHistory
            transaction={customer.transaction}
            onClose={() => setShowPaymentHistory(false)}
          />
        )}
      </div>
    </div>
  );
}

export default PaymentUpdate;