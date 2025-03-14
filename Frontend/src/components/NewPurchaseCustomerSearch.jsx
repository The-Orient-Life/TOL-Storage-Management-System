import React, { useState } from "react";
import { Search, UserPlus, User, X, Mail, Phone, MapPin } from "lucide-react";
import axios from "axios";

function NewPurchaseCustomerSearch({ onCustomerSelect }) {
  const [nic, setNic] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [foundCustomer, setFoundCustomer] = useState(null);

  const searchCustomer = async (nic) => {
    try {
      // Construct the full API URL by appending the NIC number
      const apiUrl = `${import.meta.env.VITE_APP_BACKENDGET}${nic}`;

      const response = await axios.get(apiUrl);
      console.log("User found:", response.data);

      // Map the API response to the structure expected by your component
      const foundCustomer = {
        nic: response.data.nicNumber,
        fullName: response.data.userName,
        email: response.data.email,
        phone: response.data.phoneNumber1,
        address: response.data.address,
        guarantors: response.data.guarantors,
      };

      // console.log("Mapped User Data:", userData);
      return foundCustomer;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  // // Mock customer database
  // const mockCustomers = [
  //   {
  //     id: '1',
  //     nic: '123456789V',
  //     name: 'John Doe',
  //     phone: '+94 77 123 4567',
  //     email: 'john@example.com',
  //     address: '123 Main St, Colombo'
  //   },
  //   {
  //     id: '2',
  //     nic: '987654321V',
  //     name: 'Jane Smith',
  //     phone: '+94 77 987 6543',
  //     email: 'jane@example.com',
  //     address: '456 Oak Ave, Kandy'
  //   }
  // ];

  // const searchCustomer = (searchNic) => {
  //   return mockCustomers.find(customer => customer.nic === searchNic);
  // };

  const handleSearch = async () => {
    const customer = await searchCustomer(nic);
    if (customer) {
      setSearchResult("found");
      setFoundCustomer(customer);
      onCustomerSelect(customer);
      setShowForm(false);
    } else {
      setSearchResult("not_found");
      setFoundCustomer(null);
      setShowForm(true);
      onCustomerSelect(null);
    }
  };

  const handleCloseDetails = () => {
    setFoundCustomer(null);
    setSearchResult(null);
    onCustomerSelect(null);
    setNic("");
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by NIC (try: 123456789V or 987654321V)"
              className="w-full px-4 py-2 border rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
            />
            <Search
              className="absolute right-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Search size={20} />
            Search
          </button>
        </div>

        {searchResult === "not_found" && !showForm && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3">
            <User className="text-red-600 mt-1" size={24} />
            <div>
              <h3 className="text-red-800 font-medium">Customer Not Found</h3>
              <p className="text-red-600 text-sm">
                Please register the customer before proceeding with the
                purchase.
              </p>
            </div>
          </div>
        )}

        {foundCustomer && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <User className="text-blue-600" size={24} />
                <h3 className="text-xl font-semibold">Customer Details</h3>
              </div>
              <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">NIC Number</label>
                  <p className="font-medium">{foundCustomer.nic}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <p className="font-medium">{foundCustomer.fullName}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-gray-400" />
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{foundCustomer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={18} className="text-gray-400" />
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="font-medium">{foundCustomer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-gray-400" />
                  <div>
                    <label className="text-sm text-gray-500">Address</label>
                    <p className="font-medium">{foundCustomer.address}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Guarantors Info */}
            {foundCustomer.guarantors &&
              foundCustomer.guarantors.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <User className="h-6 w-6 text-blue-600" />
                    <h2 className="ml-2 text-xl font-semibold text-gray-900">
                      Guarantors
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {foundCustomer.guarantors.map((guarantor, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">
                              Name
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {guarantor.userName}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">
                              NIC Number
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {guarantor.nicNumber}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">
                              Email
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {guarantor.email}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">
                              Phone
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {guarantor.phoneNumber1}
                            </dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Address
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {guarantor.address}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <UserPlus className="text-blue-600" size={24} />
              <h3 className="text-xl font-semibold">
                New Customer Registration
              </h3>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    NIC
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                    value={nic}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Phone Number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email Address"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Address
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Full Address"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus size={20} />
                Register Customer
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewPurchaseCustomerSearch;
