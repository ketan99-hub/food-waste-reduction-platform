export default function RequestCard({ request }) {
  const isUrgent = request.people_count >= 5;

  return (
    <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl p-6 hover:scale-105 transition duration-300">

      {/* Urgent Badge */}
      {isUrgent && (
        <span className="inline-block bg-red-500 text-white text-xs px-3 py-1 rounded-full mb-3 font-semibold">
          URGENT
        </span>
      )}

      {/* Name */}
      <h3 className="text-xl font-bold text-white mb-2">
        {request.name}
      </h3>

      {/* Address */}
      <p className="text-gray-200 text-sm flex items-center gap-2">
        📍 {request.address}
      </p>

      {/* People count */}
      <p className="text-gray-200 text-sm mt-1 flex items-center gap-2">
        👥 {request.people_count} people
      </p>

      {/* Notes */}
      {request.notes && (
        <p className="text-gray-300 text-sm mt-3 italic">
          "{request.notes}"
        </p>
      )}

      {/* Button */}
      <button className="mt-5 w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition duration-300 shadow-md">
        Help Now
      </button>

    </div>
  );
}