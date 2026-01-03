export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            FoodSave 🌱
          </h2>
          <p className="text-sm leading-relaxed">
            Food Waste Reduction Platform helps connect food donors,
            NGOs and communities to reduce waste and feed the needy.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">How it Works</li>
            <li className="hover:text-white cursor-pointer">Donate Food</li>
            <li className="hover:text-white cursor-pointer">Login</li>
          </ul>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Features
          </h3>
          <ul className="space-y-2 text-sm">
            <li>Food Donation</li>
            <li>NGO Management</li>
            <li>Live Tracking</li>
            <li>Impact Reports</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Contact
          </h3>
          <p className="text-sm">Email: support@foodsave.org</p>
          <p className="text-sm mt-2">
            India
          </p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} FoodSave. All rights reserved.
      </div>
    </footer>
  );
}
