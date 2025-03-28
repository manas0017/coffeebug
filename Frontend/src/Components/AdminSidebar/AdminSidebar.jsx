import React from "react";
import { Link } from "react-router-dom";
import { FaBox, FaShoppingCart, FaUser, FaCogs, FaSignOutAlt } from "react-icons/fa";

const AdminSidebar = () => {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-blue-300 to-blue-500 p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Coffee Bug</h2>
      <ul>
        <li className="mb-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <FaBox /> Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/orders" className="flex items-center gap-2">
            <FaShoppingCart /> Orders
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/customers" className="flex items-center gap-2">
            <FaUser /> Customers
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/settings" className="flex items-center gap-2">
            <FaCogs /> Settings
          </Link>
        </li>
        <li className="mt-6">
          <button className="flex items-center gap-2 text-red-300">
            <FaSignOutAlt /> Log out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
