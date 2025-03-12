import { MapPin } from 'lucide-react';
import { GoogleMapComponent } from './GoogleMapComponent';

export function GuarantorForm({ index, register, errors, onLocationSelect }) {
  return (
    <div className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
      <div className="flex items-center space-x-3">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">Guarantor {index + 1}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">User Name</label>
          <input
            type="text"
            {...register(`guarantors.${index}.userName`, { required: 'Username is required' })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter guarantor's username"
          />
          {errors?.guarantors?.[index]?.userName && 
            <span className="text-red-500 text-xs">{errors.guarantors[index].userName.message}</span>
          }
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">NIC Number</label>
          <input
            type="text"
            {...register(`guarantors.${index}.nicNumber`, { required: 'NIC Number is required' })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter guarantor's NIC number"
          />
          {errors?.guarantors?.[index]?.nicNumber && 
            <span className="text-red-500 text-xs">{errors.guarantors[index].nicNumber.message}</span>
          }
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Branch</label>
          <input
            type="text"
            {...register(`guarantors.${index}.branch`, { required: 'Branch is required' })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter guarantor's branch"
          />
          {errors?.guarantors?.[index]?.branch && 
            <span className="text-red-500 text-xs">{errors.guarantors[index].branch.message}</span>
          }
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register(`guarantors.${index}.email`, { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter guarantor's email"
          />
          {errors?.guarantors?.[index]?.email && 
            <span className="text-red-500 text-xs">{errors.guarantors[index].email.message}</span>
          }
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Phone Number 1</label>
          <input
            type="tel"
            {...register(`guarantors.${index}.phoneNumber1`, { required: 'Phone number is required' })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter guarantor's primary phone"
          />
          {errors?.guarantors?.[index]?.phoneNumber1 && 
            <span className="text-red-500 text-xs">{errors.guarantors[index].phoneNumber1.message}</span>
          }
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Phone Number 2 (Optional)</label>
          <input
            type="tel"
            {...register(`guarantors.${index}.phoneNumber2`)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter guarantor's secondary phone"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Address</label>
        <textarea
          {...register(`guarantors.${index}.address`, { required: 'Address is required' })}
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          placeholder="Enter guarantor's full address"
        />
        {errors?.guarantors?.[index]?.address && 
          <span className="text-red-500 text-xs">{errors.guarantors[index].address.message}</span>
        }
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Location</label>
        <div className="rounded-lg overflow-hidden shadow-md">
          <GoogleMapComponent onLocationSelect={onLocationSelect} />
        </div>
      </div>
    </div>
  );
}