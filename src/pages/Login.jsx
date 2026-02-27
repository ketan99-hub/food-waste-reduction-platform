import React, { useState } from "react";
import { FaUser, FaLock, FaLeaf } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }

    alert(`Login Successful as ${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100 via-white to-green-200 px-4">

      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-10 w-full max-w-md">

        {/* Logo Section */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3 text-green-600 text-4xl">
            <FaLeaf />
          </div>
          <h2 className="text-2xl font-bold text-green-700">
            Food Waste Reduction
          </h2>
          <p className="text-gray-600 text-sm">
            Reduce Food Waste. Feed the Future.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">


             {/* Role Select */}
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-green-600 outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="donor">Donor</option>
            <option value="ngo">NGO</option>
            <option value="admin">Admin</option>
            <option value="requester">Food Requester</option> 
          </select>

          {/* Email */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-green-600 transition">
            <FaUser className="text-green-600 mr-2" />
            <input
              type="email"
              placeholder="Enter Email"
              className="outline-none flex-1 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-green-600 transition">
            <FaLock className="text-green-600 mr-2" />
            <input
              type="password"
              placeholder="Enter Password"
              className="outline-none flex-1 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

         

          {/* Button */}
          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;