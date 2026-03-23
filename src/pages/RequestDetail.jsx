import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "../lib/supabase";

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequest = async () => {
    if (!id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("food_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Request fetch error:", error);
      setError("Unable to load request");
      setRequest(null);
    } else {
      setRequest(data);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequest();

    const channel = supabase
      .channel("food_requests_detail")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "food_requests" },
        (payload) => {
          if (payload?.new?.id?.toString() === id.toString()) {
            fetchRequest();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const updateStatus = async (newStatus) => {
    if (!request?.id) return;
    const { error } = await supabase
      .from("food_requests")
      .update({ status: newStatus })
      .eq("id", request.id);

    if (error) {
      console.error("Status update failed:", error);
      return;
    }

    fetchRequest();
  };

  const handleDonate = () => {
    navigate("/donate", { state: { requestId: request?.id } });
  };

  if (loading) {
    return <p className="pt-28 text-center">Loading request...</p>;
  }

  if (error || !request) {
    return <p className="pt-28 text-center text-red-500">{error || "Request not found"}</p>;
  }

  return (
    <section className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border p-6 space-y-6">
        <h1 className="text-3xl font-bold text-green-700">Request Details</h1>

        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <h2 className="text-2xl font-semibold">{request.name}</h2>
            <p className="text-gray-700 text-sm">Phone: {request.phone || "N/A"}</p>
            <p className="text-gray-700 text-sm">Address: {request.address}</p>
            <p className="text-gray-700 text-sm">People: {request.people_count}</p>
            <p className="text-gray-700 text-sm">Food Type: {request.food_type || "Any"}</p>
            <p className="text-gray-700 text-sm">Urgency: {request.urgency || "Normal"}</p>
            <p className="text-gray-700 text-sm">Notes: {request.notes || "—"}</p>
            <p className="text-sm mt-2">
              Status: <span className="font-semibold">{request.status || "pending"}</span>
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleDonate}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Donate For This Request
            </button>
            <button
              onClick={() => updateStatus("accepted")}
              disabled={request.status === "accepted" || request.status === "completed"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              Mark Accepted
            </button>
            <button
              onClick={() => updateStatus("completed")}
              disabled={request.status === "completed"}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              Mark Completed
            </button>
          </div>
        </div>

        {request.latitude && request.longitude ? (
          <div className="h-72 rounded-xl overflow-hidden border">
            <MapContainer
              center={[Number(request.latitude), Number(request.longitude)]}
              zoom={14}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[Number(request.latitude), Number(request.longitude)]}>
                <Popup>Request location for {request.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          <p className="text-gray-500">Location coordinates not available for request map.</p>
        )}

        <button
          onClick={() => navigate(-1)}
          className="mt-2 text-sm text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
      </div>
    </section>
  );
}
