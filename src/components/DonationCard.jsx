export default function DonationCard({ donation }) {
  return (
<div className="bg-transparent backdrop-blur-md
">      <h3 className="text-lg font-bold text-gray-800">
        🍛 {donation.food_type}
      </h3>

      <p className="text-gray-600 mt-1">📍 {donation.location}</p>
      <p className="text-gray-600">📦 {donation.quantity} meals</p>

      {donation.notes && (
        <p className="text-sm text-gray-500 mt-2 italic">
          "{donation.notes}"
        </p>
      )}

      <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
        Claim Food
      </button>
    </div>
  );
}