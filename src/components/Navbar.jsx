import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Navbar() {
const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);   // 👈 NEW

  useEffect(() => {

    // Current session check
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    // Auth change listener
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg transition ${
      isActive
        ? "text-green-600 bg-green-50 font-semibold"
        : "text-gray-700 hover:text-green-600"
    }`;

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-bold text-green-600 hover:text-green-700"
        >
          SaveFood
        </NavLink>

        {/* Links */}
        <div className="flex gap-4 font-medium items-center">

          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/how-it-works" className={linkClass}>
            How it Works
          </NavLink>

          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>

          <NavLink to="/request-food" className={linkClass}>
            Request Food
          </NavLink>

          <NavLink to="/donate" className={linkClass}>
            Donate
          </NavLink>

          {/* USER LOGIN CHECK */}

          {!user ? (

            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>

          ) : (

            <div className="relative flex items-center gap-3">

              {/* Profile Icon */}
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="profile"
                className="w-8 h-8 rounded-full border cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}   // 👈 CLICK
              />

              {/* Email */}
              <span className="text-sm text-gray-700">
                {user.email}
              </span>

              {/* Logout */}
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
              >
                Logout
              </button>

              {/* DROPDOWN MENU */}

            {menuOpen && (
  <div className="absolute right-0 top-12 w-52 bg-white shadow-lg rounded-lg border">

    <button
      onClick={() => navigate("/profile")}
      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
    >
      👤 My Profile
    </button>

    <button
      onClick={() => navigate("/my-donations")}
      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
    >
      🍛 My Donations
    </button>

    <button
      onClick={() => navigate("/my-requests")}
      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
    >
      📦 My Requests
    </button>

    <button
      onClick={logout}
      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
    >
      🚪 Logout
    </button>

  </div>
)}
            </div>

          )}

        </div>
      </div>
    </nav>
  );
}