import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function MyRequests() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    const { data, error } = await supabase
      .from("food_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setRequests(data);
    }

    setLoading(false);
  };

  const handleEdit = (item) => {

    setEditingId(item.id);

    setEditData({
      id: item.id,
      name: item.name,
      phone: item.phone,
      address: item.address,
      food_type: item.food_type,
      people_count: item.people_count,
      urgency: item.urgency,
      notes: item.notes
    });

  };

  const handleSave = async () => {

    const { error } = await supabase
      .from("food_requests")
      .update({
        name: editData.name,
        phone: editData.phone,
        address: editData.address,
        food_type: editData.food_type,
        people_count: editData.people_count,
        urgency: editData.urgency,
        notes: editData.notes
      })
      .eq("id", editData.id);

    if (error) {
      console.error(error);
      alert("Update failed");
      return;
    }

    setEditingId(null);
    fetchRequests();
  };

  const deleteRequest = async (id) => {

    if (!confirm("Delete this request?")) return;

    const { error } = await supabase
      .from("food_requests")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Delete failed");
      return;
    }

    fetchRequests();
  };

  if (loading) {
    return (
      <div className="pt-28 text-center text-lg">
        Loading your requests...
      </div>
    );
  }

  return (

    <div className="pt-28 min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold text-green-700">
            My Requests
          </h1>

          <button
            onClick={() => navigate("/request-food")}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
          >
            + Request Food
          </button>

        </div>

        {requests.length === 0 ? (

          <div className="text-center text-gray-500 text-lg">
            You haven't requested food yet.
          </div>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {requests.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md border hover:shadow-lg transition p-5"
              >

                {/* Name */}

                {editingId === item.id ? (
                  <input
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <h2 className="text-xl font-semibold text-green-700">
                    👤 {item.name}
                  </h2>
                )}

                {/* Phone */}

                {editingId === item.id ? (
                  <input
                    value={editData.phone}
                    onChange={(e) =>
                      setEditData({ ...editData, phone: e.target.value })
                    }
                    className="border p-2 rounded w-full mt-2"
                  />
                ) : (
                  <p className="text-gray-600 mt-2">
                    📞 {item.phone}
                  </p>
                )}

                {/* Address */}

                {editingId === item.id ? (
                  <input
                    value={editData.address}
                    onChange={(e) =>
                      setEditData({ ...editData, address: e.target.value })
                    }
                    className="border p-2 rounded w-full mt-2"
                  />
                ) : (
                  <p className="text-gray-600">
                    📍 {item.address}
                  </p>
                )}

                {/* Food Type */}

                {editingId === item.id ? (
                  <input
                    value={editData.food_type}
                    onChange={(e) =>
                      setEditData({ ...editData, food_type: e.target.value })
                    }
                    className="border p-2 rounded w-full mt-2"
                  />
                ) : (
                  <p className="text-gray-600">
                    🍛 {item.food_type}
                  </p>
                )}

                {/* People */}

                {editingId === item.id ? (
                  <input
                    type="number"
                    value={editData.people_count}
                    onChange={(e) =>
                      setEditData({ ...editData, people_count: e.target.value })
                    }
                    className="border p-2 rounded w-full mt-2"
                  />
                ) : (
                  <p className="text-gray-600">
                    👥 People: {item.people_count}
                  </p>
                )}

                {/* Urgency */}

                {editingId === item.id ? (
                  <input
                    value={editData.urgency}
                    onChange={(e) =>
                      setEditData({ ...editData, urgency: e.target.value })
                    }
                    className="border p-2 rounded w-full mt-2"
                  />
                ) : (
                  <p className="text-gray-600">
                    ⚡ Urgency: {item.urgency}
                  </p>
                )}

                {/* Notes */}

                {editingId === item.id ? (
                  <textarea
                    value={editData.notes}
                    onChange={(e) =>
                      setEditData({ ...editData, notes: e.target.value })
                    }
                    className="border p-2 rounded w-full mt-2"
                  />
                ) : (
                  <p className="text-gray-600 mt-2">
                    📝 {item.notes}
                  </p>
                )}

                {/* Status */}

                <span
                  className={`px-3 py-1 rounded-full text-sm mt-2 inline-block ${
                    item.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.status}
                </span>

                <p className="text-gray-400 text-xs mt-2">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>

                {/* Buttons */}

                <div className="flex gap-2 mt-4">

                  {editingId === item.id ? (

                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Save
                    </button>

                  ) : (

                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>

                  )}

                  <button
                    onClick={() => deleteRequest(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );
}