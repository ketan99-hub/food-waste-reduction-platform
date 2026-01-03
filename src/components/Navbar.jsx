import { NavLink } from "react-router-dom";

export default function Navbar() {
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
        <div className="flex gap-4 font-medium">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <a href="Features" className="px-3 py-2 hover:text-green-600">
            How it Works
          </a>

          <NavLink to="/donate" className={linkClass}>
            Donate
          </NavLink>

          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
        </div>

      </div>
    </nav>
  );
}
