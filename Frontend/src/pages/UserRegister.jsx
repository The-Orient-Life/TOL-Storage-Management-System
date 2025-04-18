import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Upload, UserPlus, X } from 'lucide-react';
import { GoogleMapComponent } from '../components/GoogleMapComponent';
import { GuarantorForm } from '../components/GuarantorForm';
import axios from 'axios';
import Swal from "sweetalert2";

function UserRegister() {


  const storedUserDetails = sessionStorage.getItem('UserDetails');
  let userRole = '';
  let defaultRole = 'Customer';

  if (storedUserDetails) {
    const parsedUserDetails = JSON.parse(storedUserDetails);
    if (parsedUserDetails && parsedUserDetails.data && parsedUserDetails.data.role) {
      userRole = parsedUserDetails.data.role;

      // Only Head Admin can assign roles manually
      if (userRole === 'Head Admin') {
        defaultRole = '';
      }
    }
  }

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      role: defaultRole  // Automatically sets "Customer" if not Head Admin
    }
  });
  const [previewImage, setPreviewImage] = useState();

  const isGuarantor = watch('isGuarantor');
  const guarantors = watch('guarantors') || [];
  const selectedRole = watch('role');

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onSubmit = (data) => {

    // Handle form submission
    const regURL = import.meta.env.VITE_APP_BACKENDREG;

    axios.post(regURL, data)
      .then(response => {

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Registration Successfully",
          showConfirmButton: false,
          iconColor: "#4BB543",
          timer: 2000,
        });
      })
      .catch(error => {
        console.error("This Is Post Error Form Frontend", error);
      });
  };

  const handleAddGuarantor = () => {
    if (guarantors.length < 2) {
      setValue('guarantors', [...guarantors, {}]);
    }
  };

  const removeGuarantor = (index) => {
    const newGuarantors = guarantors.filter((_, i) => i !== index);
    setValue('guarantors', newGuarantors);
  };

  const showPasswordField = selectedRole === 'Executive' || selectedRole === 'Branch Manager';


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-white p-4 rounded-full w-20 h-20 mx-auto shadow-md flex items-center justify-center">
            <UserPlus className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">User Registration</h2>
          <p className="mt-2 text-sm text-gray-600">Fill in your details to create an account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">User Name</label>
                <input
                  type="text"
                  {...register('userName', { required: 'Username is required' })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your username"
                />
                {errors.userName && <span className="text-red-500 text-xs">{errors.userName.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">NIC Number</label>
                <input
                  type="text"
                  {...register('nicNumber', { required: 'NIC Number is required' })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter NIC number"
                />
                {errors.nicNumber && <span className="text-red-500 text-xs">{errors.nicNumber.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Branch</label>
                <input
                  type="text"
                  {...register('branch', { required: 'Branch is required' })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter branch name"
                />
                {errors.branch && <span className="text-red-500 text-xs">{errors.branch.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your email"
                />
                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number 1</label>
                <input
                  type="tel"
                  {...register('phoneNumber1', { required: 'Phone number is required' })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter primary phone number"
                />
                {errors.phoneNumber1 && <span className="text-red-500 text-xs">{errors.phoneNumber1.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number 2 (Optional)</label>
                <input
                  type="tel"
                  {...register('phoneNumber2')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter secondary phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <textarea
                {...register('address', { required: 'Address is required' })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your full address"
              />
              {errors.address && <span className="text-red-500 text-xs">{errors.address.message}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <select
                  {...register('role', { required: 'Role is required' })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                >
                  <option value="">Select a role</option>
                  <option value="Executive">Executive</option>
                  <option value="Branch Manager">Branch Manager</option>
                </select>
                {errors.role && <span className="text-red-500 text-xs">{errors.role.message}</span>}
              </div> */}

              {userRole === 'Head Admin' ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <select
                    {...register('role', { required: 'Role is required' })}
                    defaultValue=""
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  >
                    <option value="">Select a role</option>
                    <option value="Executive">Executive</option>
                    <option value="Branch Manager">Branch Manager</option>
                  </select>
                  {errors.role && (
                    <span className="text-red-500 text-xs">{errors.role.message}</span>
                  )}
                </div>
              ) : (
                // Hidden input so role is still submitted as "Customer"
                <input type="hidden" value="Customer" {...register('role')} />
              )}


              {showPasswordField && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    {...register('password', {
                      required: 'Password is required for Executive and Branch Manager roles',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters long'
                      }
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your password"
                  />
                  {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                </div>
              )}

              <div className="flex items-center h-full">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register('isGuarantor')}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition duration-200"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition duration-200">
                    Add Guarantor Details
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <div className="rounded-lg overflow-hidden shadow-md">
                <GoogleMapComponent
                  onLocationSelect={(location) => setValue('location', location)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Photo</label>
              <div className="flex items-center space-x-4">
                <div className="flex justify-center items-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition duration-200">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  {...register('photo', { required: 'Photo is required' })}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition duration-200"
                />
              </div>
              {errors.photo && <span className="text-red-500 text-xs">{errors.photo.message}</span>}
            </div>
          </div>

          {isGuarantor && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-medium text-gray-900">Guarantor Details</h3>
                {guarantors.length < 2 && (
                  <button
                    type="button"
                    onClick={handleAddGuarantor}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                  >
                    Add Guarantor
                  </button>
                )}
              </div>

              {guarantors.map((_, index) => (
                <div key={index} className="relative">
                  <button
                    type="button"
                    onClick={() => removeGuarantor(index)}
                    className="absolute right-4 top-4 p-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <GuarantorForm
                    index={index}
                    register={register}
                    errors={errors}
                    onLocationSelect={(location) =>
                      setValue(`guarantors.${index}.location`, location)
                    }
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 shadow-lg hover:shadow-xl"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserRegister;