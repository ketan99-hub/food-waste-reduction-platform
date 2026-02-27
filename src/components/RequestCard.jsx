export default function RequestCard({ request }) {
  const isUrgent = request.people_count >= 5; // urgent logic

  return (
<div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">      {/* Urgent Badge */}
      {isUrgent && (
        <span className="inline-block bg-red-500 text-white text-xs px-3 py-1 rounded-full mb-2">
          URGENT
        </span>
      )}

      <h3 className="text-lg font-bold text-gray-800">{request.name}</h3>

      <p className="text-gray-600 mt-1">📍 {request.address}</p>
      <p className="text-gray-600">👥 {request.people_count} people</p>

      {request.notes && (
        <p className="text-sm text-gray-500 mt-2 italic">
          "{request.notes}"
        </p>
      )}

      <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
        Help Now
      </button>
    </div>
  );
}