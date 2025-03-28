import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch all products
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await axios.get('/api/products', {
  //         headers: {
  //           Authorization: Bearer ${localStorage.getItem('token')},
  //         };
  //       setProducts(response.data);
  //       console.log("product:", response)
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //       toast.error("Failed to load products.");
  //     }
  //   };

  //   fetchProducts();
  // }, []);

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



  // Handle delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/products/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter((product) => product.ProductID !== id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  };

  // Navigate to edit page
  const handleEdit = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Product List</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Price</th>
            <th className="p-3 border">Category</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.ProductID} className="text-center">

              <td className="p-3 border">{product.ProductName}</td>
              <td className="p-3 border">{product.ProductPrice}Rs</td>

              <td className="p-3 border">{product.ProductCategoryID}</td>
              <td className="p-3 border flex justify-center space-x-4">
                <button
                  onClick={() => handleEdit(product.ProductID)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.ProductID)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => navigate("/admin/products/add")}
        className="mt-6 px-4 py-2 bg-green-500 text-white rounded"
      >
        Add Product
      </button>
    </div>
  );
};

export default AdminProducts;
