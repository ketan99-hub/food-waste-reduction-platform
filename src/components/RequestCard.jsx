import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function RequestCard({ request }) {
  const navigate = useNavigate();
  const isUrgent = request.people_count >= 5;

  const statusText = useMemo(() => {
    if (!request.status || request.status === "pending") return "Pending";
    return request.status.charAt(0).toUpperCase() + request.status.slice(1);
  }, [request.status]);

  const statusClass = useMemo(() => {
    switch (request.status) {
      case "accepted":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "rejected":
        return "bg-gray-500";
      default:
        return "bg-yellow-500";
    }
  }, [request.status]);

  const handleActionClick = () => {
    if (request.status === "completed") return;

    // Go to dedicated request details page with rich workflow
    navigate(`/requests/${request.id}`);
  };

  return (
    <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl p-6 hover:scale-105 transition duration-300">

      {/* Urgent Badge */}
      {isUrgent && (
        <span className="inline-block bg-red-500 text-white text-xs px-3 py-1 rounded-full mb-3 font-semibold">
          URGENT
        </span>
      )}

      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-white">{request.name}</h3>
        <span className={`text-white text-xs px-2 py-1 rounded ${statusClass}`}>
          {statusText}
        </span>
      </div>

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

      {/* Action Button */}
      <button
        onClick={handleActionClick}
        disabled={request.status === "completed"}
        className={`mt-5 w-full py-2.5 rounded-lg font-semibold shadow-md transition duration-300 ${
          request.status === "completed"
            ? "bg-gray-400 text-gray-800 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {request.status === "completed" ? "Request Fulfilled" : "Support Request"}
      </button>

    </div>
  );
}