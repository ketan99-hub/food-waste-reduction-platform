import { useNavigate } from "react-router-dom";

export default function DonationCard({ donation, onClaim }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/donation/${donation.id}`);
  };

  return (
<div className="bg-transparent backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800">
        🍛 {donation.food_type}
      </h3>

      <p className="text-gray-600 mt-1">📍 {donation.location}</p>
      <p className="text-gray-600">📦 {donation.quantity} meals</p>

      {donation.cookedTime && (
        <p className="text-gray-600 text-sm">⏰ Cooked: {donation.cookedTime}</p>
      )}

      {donation.expiryTime && (
        <p className="text-gray-600 text-sm">⏳ Expires: {donation.expiryTime}</p>
      )}

      {donation.notes && (
        <p className="text-sm text-gray-500 mt-2 italic">
          "{donation.notes}"
        </p>
      )}

      <button
        onClick={handleViewDetails}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
      >
        View Details
      </button>
    </div>
  );
}