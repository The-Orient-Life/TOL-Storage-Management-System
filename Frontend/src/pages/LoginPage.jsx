import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import axios from 'axios';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Logo from "../assets/LOGO.jpg"
import { jwtDecode } from "jwt-decode";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from submitting the default way
  
    // Get the backend URL from the environment variable
    const regURL = import.meta.env.VITE_APP_BACKENDLOG;
  
    // Check if the URL is correct
    console.log("Backend URL:", regURL);  // Log the backend URL to verify it's correct
  
    if (!regURL) {
      console.error("Backend URL is missing! Please check your .env file.");
      Swal.fire("Error", "Backend URL is not defined", "error");
      return;
    }
  
    try {
      const response = await axios.post(regURL, {
        username: userName,
        password: password,
      });
  
      if (response.data.status === "ok") {
        const token = response.data.token;
        sessionStorage.setItem("authToken", token);
        Swal.fire("Success", "You have logged in successfully", "success");
        navigate("/dashboard");
      } else {
        Swal.fire("Error", response.data.error, "error");
      }
    } catch (error) {
      console.error("Login failed:", error);
      Swal.fire("Error", "An error occurred during login", "error");
    }
    const token = sessionStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    console.log(decoded);
    const userId = decoded.id;  // Get the 'id' from the decoded token

    const userDetailsResponse = await axios.get(
      `${import.meta.env.VITE_APP_BACKENDUSER}${userId}`
    );

    if (userDetailsResponse.data) {
      console.log('User details:', userDetailsResponse.data);
      // Handle user details response (e.g., show user info or store it)
      sessionStorage.setItem("UserDetails",JSON.stringify(userDetailsResponse));
    } else {
      Swal.fire("Error", "Failed to fetch user details", "error");
    }

    console.log(decoded);
   
  };
  
  async () => {
    const token = sessionStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    const userId = decoded.id;  // Get the 'id' from the decoded token

    const userDetailsResponse = await axios.get(
      `${import.meta.env.VITE_APP_BACKENDUSER}${userId}`
    );

    if (userDetailsResponse.data) {
      console.log('User details:', userDetailsResponse.data);
      // Handle user details response (e.g., show user info or store it)
    } else {
      Swal.fire("Error", "Failed to fetch user details", "error");
    }

    console.log(decoded);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <div className="rounded-full border-4 border-blue-600 p-1 shadow-lg">
            <img 
              src={Logo} 
              alt="The Orient Life Logo" 
              className="h-24 w-24 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          {isLogin ? 'Welcome Back' : 'Reset Password'}
        </h2>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>

            {isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            )}
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            {isLogin ? 'Sign In' : 'Send Reset Link'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            {isLogin ? 'Forgot your password?' : 'Back to login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
