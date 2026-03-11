
import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

import { FaUser, FaLock, FaEnvelope, FaLeaf, FaPhone } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

function AuthPage() {

  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [role, setRole] = useState("donor");

  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [ngoAddress, setNgoAddress] = useState("");
  const [ngoReg, setNgoReg] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    // LOGIN
    if (isLogin) {

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profile.role === "ngo" && profile.status !== "approved") {
        alert("NGO account waiting for admin approval");
        return;
      }
      

navigate("/");
      return;
    }

    // REGISTER
  const { data, error } = await supabase.auth.signUp({
  email,
  password,
});

if (error) {
  alert(error.message);
  return;
}

if (!data.user) {
  alert("User creation failed");
  return;
}

const user = data.user;

const status = role === "ngo" ? "pending" : "approved";

const { error: profileError } = await supabase
  .from("profiles")
  .insert([
    {
      id: user.id,
      name: name,
      mobile: mobile,
      role: role,
      ngo_address: ngoAddress,
      ngo_reg: ngoReg,
      status: status
    }
  ]);

if (profileError) {
  alert(profileError.message);
  return;
}

// NGO case
if (role === "ngo") {
  alert("NGO registered successfully. Wait for admin approval.");
  return;
}

// Normal user case
alert("Registration successful 🎉");
navigate("/");
  };

  const handleGoogleSignIn = async () => {

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin
      }
    });

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-green-50">

      <div className="flex bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl">

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
            Donate surplus food and help people in need.
          </p>

        </div>

        <div className="p-10 w-full md:w-1/2">

          <div className="text-center mb-6">

            <div className="flex justify-center text-green-600 text-3xl mb-2">
              <FaLeaf />
            </div>

            <h2 className="text-xl font-bold text-green-700">
              Food Waste Reduction
            </h2>

          </div>

          <div className="flex mb-5 border rounded-lg overflow-hidden">

            <button
              type="button"
              className={`w-1/2 py-2 ${isLogin ? "bg-green-600 text-white" : "bg-gray-100"}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>

            <button
              type="button"
              className={`w-1/2 py-2 ${!isLogin ? "bg-green-600 text-white" : "bg-gray-100"}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>

          </div>

          <select
            className="border rounded-lg px-3 py-2 mb-4 w-full"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
           <option value="user">User</option>
<option value="ngo">NGO</option>
          </select>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  className="border px-3 py-2 rounded"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                />

                <input
                  type="tel"
                  placeholder="Phone"
                  className="border px-3 py-2 rounded"
                  value={mobile}
                  onChange={(e)=>setMobile(e.target.value)}
                />
              </>
            )}

            {!isLogin && role === "ngo" && (
              <>
                <input
                  type="text"
                  placeholder="NGO Address"
                  className="border px-3 py-2 rounded"
                  value={ngoAddress}
                  onChange={(e)=>setNgoAddress(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Registration Number"
                  className="border px-3 py-2 rounded"
                  value={ngoReg}
                  onChange={(e)=>setNgoReg(e.target.value)}
                />
              </>
            )}

            <input
              type="email"
              placeholder="Email"
              className="border px-3 py-2 rounded"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="border px-3 py-2 rounded"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <button className="bg-green-600 text-white py-2 rounded">
              {isLogin ? "Login" : "Register"}
            </button>

          </form>

          <div className="flex items-center my-4">
            <hr className="flex-1"/>
            <span className="px-2 text-gray-400 text-sm">OR</span>
            <hr className="flex-1"/>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-full border py-2 rounded-lg hover:bg-gray-100"
          >
            <FcGoogle className="mr-2 text-xl"/>
            Sign in with Google
          </button>

        </div>

      </div>

    </div>

  );
}

export default AuthPage;

