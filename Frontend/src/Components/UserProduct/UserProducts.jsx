import React from "react";
import  { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const UserProducts = () => {
  const [products, setProducts] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const authData = localStorage.getItem("authData");
        const parsedData = JSON.parse(authData); // Parse stored JSON
        const token = parsedData.token;
        if (!token) {
          toast.error("Unauthorized! Please log in.");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(response.data);
        console.log("Products:", response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products.");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.ProductID} className="bg-white p-4 shadow-md rounded-lg">
            <img src={product.Image} alt={product.ProductName} className="w-full h-40 object-cover rounded-md" />
            <h3 className="text-xl font-semibold mt-2">{product.ProductName}</h3>
            <p className="text-gray-600">{product.ProductDescription}</p>
            <p className="text-gray-900 font-bold mt-2">${product.ProductPrice}</p>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserProducts;
