import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiUser, FiUpload } from "react-icons/fi";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    role: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/createUser", formData);
      toast.success("User created successfully!");
    } catch (error) {
      toast.error("Failed to create user. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-12 py-8">
        <img src="/img/Logo.png" alt="Logo" className="w-28 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800">Get Started Now</h2>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mt-4">
          <div className="w-20 h-20 border rounded-full flex items-center justify-center bg-gray-200">
            <FiUser className="text-gray-500 text-4xl" />
          </div>
          <button className="mt-2 flex items-center px-3 py-2 border rounded-md bg-gray-100 hover:bg-gray-200">
            <FiUpload className="mr-2" /> Upload your Photo
          </button>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-lg mt-6 space-y-4">
          <div className="flex space-x-4">
            <input type="text" name="firstName" placeholder="First Name" className="input-style" value={formData.firstName} onChange={handleChange} />
            <input type="text" name="lastName" placeholder="Last Name" className="input-style" value={formData.lastName} onChange={handleChange} />
          </div>

          <div className="flex space-x-4">
            <input type="date" name="dateOfBirth" className="input-style" value={formData.dateOfBirth} onChange={handleChange} />
            <input type="tel" name="phoneNumber" placeholder="Phone Number" className="input-style" value={formData.phoneNumber} onChange={handleChange} />
          </div>

          <div className="flex space-x-4">
            <input type="text" name="gender" placeholder="Gender" className="input-style" value={formData.gender} onChange={handleChange} />
            <input type="text" name="role" placeholder="Role" className="input-style" value={formData.role} onChange={handleChange} />
          </div>

          <input type="text" name="address" placeholder="Address" className="input-style" value={formData.address} onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" className="input-style" value={formData.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" className="input-style" value={formData.password} onChange={handleChange} />

          <div className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm text-gray-600">I agree to the terms & policies</span>
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            Signup
          </button>

          <p className="text-center text-gray-500 mt-2">
            Have an account? <a href="/login" className="text-blue-500 font-semibold hover:underline">Sign In</a>
          </p>
        </form>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/img/Signup.png')" }}></div>
    </div>
  );
};

export default CreateUser;
