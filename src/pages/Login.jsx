import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaLeaf } from "react-icons/fa";

import { FaUser, FaLock, FaEnvelope, FaLeaf, FaPhone } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");


  async function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor");
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please fill all fields!");
    return;
  }

    if (!email || !password || (!isLogin && (!name || !mobile))) {
      alert("Please fill all fields!");
      return;
    }

    if (isLogin) {
      alert(`Login Successful as ${role}`);
    } else {
      alert(`Registration Successful as ${role}`);
    }
  };

  const handleGoogleSignIn = () => {
    alert("Google Sign In Clicked (Firebase required)");
  };
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  // Optional: role-based redirect
  if (role === "donor") {
    navigate("/donor-dashboard");
  } else if (role === "ngo") {
    navigate("/ngo-dashboard");
  } else if (role === "admin") {
    navigate("/admin-dashboard");
  } else {
    navigate("/request-dashboard");
  }

alert(`Login Successful as ${role} 🎉`);};
console.log("URL:", import.meta.env.VITE_SUPABASE_URL);
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">

      <div className="flex bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl">

        {/* Illustration Section */}
        <div className="hidden md:flex flex-col justify-center items-center bg-green-600 text-white p-10 w-1/2">

          <img
  src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png"
  alt="food donation"
  className="w-56 mb-6"
/>
          <h2 className="text-2xl font-bold mb-3">
            Together We Fight Hunger
          </h2>

          <p className="text-center text-sm opacity-90">
            Together we fight hunger and reduce food waste.
            Donate surplus food and help people in need.
          </p>

        </div>

        {/* Form Section */}
        <div className="p-10 w-full md:w-1/2">

          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex justify-center text-green-600 text-3xl mb-2">
              <FaLeaf />
            </div>
            <h2 className="text-xl font-bold text-green-700">
              Food Waste Reduction
            </h2>
          </div>

          {/* Toggle */}
          <div className="flex mb-5 border rounded-lg overflow-hidden">
            <button
              className={`w-1/2 py-2 ${
                isLogin ? "bg-green-600 text-white" : "bg-gray-100"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>

            <button
              className={`w-1/2 py-2 ${
                !isLogin ? "bg-green-600 text-white" : "bg-gray-100"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Mobile Number */}
            {!isLogin && (
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaPhone className="text-green-600 mr-2" />
                <input
                  type="tel"
                  placeholder="Enter Mobile Number"
                  className="outline-none flex-1 text-sm"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
            )}

            {/* Name */}
            {!isLogin && (
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaUser className="text-green-600 mr-2" />
                <input
                  type="text"
                  placeholder="Enter Name"
                  className="outline-none flex-1 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            {/* Role */}
            <select
              className="border rounded-lg px-3 py-2 text-sm outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="donor">Donor</option>
              <option value="ngo">NGO</option>
              <option value="admin">Admin</option>
              <option value="requester">Food Requester</option>
            </select>

            {/* Email */}
            <div className="flex items-center border rounded-lg px-3 py-2">
              <FaEnvelope className="text-green-600 mr-2" />
              <input
                type="email"
                placeholder="Enter Email"
                className="outline-none flex-1 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="flex items-center border rounded-lg px-3 py-2">
              <FaLock className="text-green-600 mr-2" />
              <input
                type="password"
                placeholder="Enter Password"
                className="outline-none flex-1 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {isLogin ? "Login" : "Register"}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-1" />
            <span className="px-2 text-gray-400 text-sm">OR</span>
            <hr className="flex-1" />
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-full border py-2 rounded-lg hover:bg-gray-100"
          >
            <FcGoogle className="mr-2 text-xl" />
            Sign in with Google
          </button>

        </div>
      </div>
    </div>
  );
}

export default AuthPage;