import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function NGODashboard() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH REQUESTS

  const fetchRequests = async () => {

    const { data, error } = await supabase
      .from("food_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setRequests(data);
    }

    setLoading(false);
  };

 useEffect(()=>{

fetchRequests()

const channel = supabase
.channel("food_requests")

.on(
"postgres_changes",
{
event:"INSERT",
schema:"public",
table:"food_requests"
},
(payload)=>{

fetchRequests()

}
)

.subscribe()

return ()=> supabase.removeChannel(channel)

},[])


  // ACCEPT REQUEST

  const acceptRequest = async (id) => {

    await supabase
      .from("food_requests")
      .update({ status: "accepted" })
      .eq("id", id);

    fetchRequests();
  };


  // COMPLETE REQUEST

  const completeRequest = async (id) => {

    await supabase
      .from("food_requests")
      .update({ status: "completed" })
      .eq("id", id);

    fetchRequests();
  };



  return (

    <section className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8 text-green-700">
          NGO Dashboard
        </h1>
<h1 className="text-3xl font-bold mb-6">
NGO Dashboard
</h1>

{/* MAP SECTION */}

<MapContainer
center={[20.59,78.96]}
zoom={5}
className="h-96 w-full rounded-xl mb-8"
>

<TileLayer
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

{requests
  .filter((req) => req.latitude && req.longitude)
  .map((req) => (

    <Marker
      key={req.id}
      position={[req.latitude, req.longitude]}
    >

      <Popup>

        <b>{req.name}</b><br/>
        People: {req.people_count}<br/>
        Urgency: {req.urgency}

      </Popup>

    </Marker>

))}

</MapContainer>

        {loading ? (
          <p>Loading requests...</p>
        ) : (

          <div className="grid md:grid-cols-2 gap-6">

            {requests.map((req) => (

              <div
                key={req.id}
                className="bg-white rounded-xl shadow-lg p-6 space-y-3"
              >

                <h2 className="text-xl font-semibold">
                  {req.name}
                </h2>

                <p>📞 {req.phone}</p>

                <p>📍 {req.address}</p>

                <p>👥 People: {req.people_count}</p>

                <p>🍽 Food Type: {req.food_type}</p>

                <p>
                  ⚡ Urgency:{" "}
                  <span className={
                    req.urgency === "Urgent"
                      ? "text-red-500 font-bold"
                      : "text-gray-600"
                  }>
                    {req.urgency}
                  </span>
                </p>

                <p className="text-sm text-gray-500">
                  Notes: {req.notes || "None"}
                </p>

                <p className="font-semibold">
                  Status: {req.status || "pending"}
                </p>


                {/* ACTION BUTTONS */}

                <div className="flex gap-3 pt-3">

                  {req.status === "pending" && (

                    <button
                      onClick={() => acceptRequest(req.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      Accept
                    </button>

                  )}

                  {req.status === "accepted" && (

                    <button
                      onClick={() => completeRequest(req.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Mark Completed
                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>

  );
}