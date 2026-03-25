import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function MyDonations() {

  const [donations, setDonations] = useState([]);
  const [addresses, setAddresses] = useState({});
  const [claims, setClaims] = useState({});
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchDonations();
    fetchAddresses();
  }, []);

  useEffect(() => {
    fetchClaims();

    // Real-time subscription for claims
    const claimsChannel = supabase
      .channel("claims_updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "claims" },
        () => fetchClaims()
      )
      .subscribe();

    return () => supabase.removeChannel(claimsChannel);
  }, [donations]);

  const fetchDonations = async () => {

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    const { data, error } = await supabase
      .from("donations")
      .select(`
        id,
        user_id,
        status,
        created_at,
        address_id,
        donation_items (
          id,
          food_name,
          category,
          quantity,
          image_url
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching donations:", error);
    } else {
      setDonations(data || []);
    }

    setLoading(false);
  };

  const fetchClaims = async () => {
    if (!donations.length) return;

    const donationIds = donations.map((d) => d.id);

    const { data, error } = await supabase
      .from("claims")
      .select("id, donation_id, claimer_id, status, created_at, claimer:profiles!claimer_id(id, name, role, mobile)")
      .in("donation_id", donationIds);

    if (error) {
      console.error("Error fetching claims:", error);
      return;
    }

    const claimsMap = {};
    (data || []).forEach((claim) => {
      if (!claimsMap[claim.donation_id]) claimsMap[claim.donation_id] = [];
      claimsMap[claim.donation_id].push(claim);
    });

    setClaims(claimsMap);
  };

  const handleEdit = (donationId, item) => {
    setEditingId(donationId);
    setEditData({
      id: item.id,
      food_name: item.food_name,
      category: item.category,
      quantity: item.quantity
    });
  };

  const fetchAddresses = async () => {
    const { data, error } = await supabase
      .from("addresses")
      .select(`
        id,
        house,
        area,
        city,
        pincode,
        latitude,
        longitude
      `);

    if (error) {
      console.error("Error fetching addresses:", error);
      return;
    }

    const addressMap = {};
    data.forEach((addr) => {
      addressMap[addr.id] = addr;
    });

    setAddresses(addressMap);
  };

  const handleSave = async () => {

    const { error } = await supabase
      .from("donation_items")
      .update({
        food_name: editData.food_name,
        category: editData.category,
        quantity: editData.quantity
      })
      .eq("id", editData.id);

    if (error) {
      alert("Update failed");
      console.error(error);
      return;
    }

    alert("Donation updated ✅");

    setEditingId(null);
    fetchDonations();
  };

  const handleApproveClaim = async (claim) => {
    // Mark this claim approved and set donation status to claimed.
    const { error: approveError } = await supabase
      .from("claims")
      .update({ status: "approved" })
      .eq("id", claim.id);

    if (approveError) {
      alert("Unable to approve claim");
      console.error(approveError);
      return;
    }

    const { error: donationError } = await supabase
      .from("donations")
      .update({ status: "claimed" })
      .eq("id", claim.donation_id);

    if (donationError) {
      alert("Unable to update donation status");
      console.error(donationError);
      return;
    }

    // Reject any other pending claims for this donation
    const { error: rejectError } = await supabase
      .from("claims")
      .update({ status: "rejected" })
      .eq("donation_id", claim.donation_id)
      .neq("id", claim.id)
      .eq("status", "pending");

    if (rejectError) {
      console.error("Unable to reject remaining claims", rejectError);
    }

    alert(`✅ Claim approved!\n\nPickup Details:\n📍 Recipient: ${claim.claimer?.name || "Recipient"}\n📞 Phone: ${claim.claimer?.mobile || "Not provided"}\n\nPlease coordinate with the recipient for food pickup.`);
    fetchDonations();
    fetchClaims();
  };

  const handleRejectClaim = async (claim) => {
    const { error } = await supabase
      .from("claims")
      .update({ status: "rejected" })
      .eq("id", claim.id);

    if (error) {
      alert("Unable to reject claim");
      console.error(error);
      return;
    }

    alert("Claim rejected.");
    fetchClaims();
  };

  const updateDonationStatus = async (donationId, status) => {
    const { error } = await supabase
      .from("donations")
      .update({ status })
      .eq("id", donationId);

    if (error) {
      alert("Unable to update donation status");
      console.error(error);
      return;
    }

    fetchDonations();
  };

  const deleteDonation = async (donationId) => {

    if (!confirm("Delete this donation?")) return;

    const { error } = await supabase
      .from("donations")
      .delete()
      .eq("id", donationId);

    if (error) {
      alert("Delete failed");
      console.error(error);
      return;
    }

    fetchDonations();
  };

  if (loading) {
    return (
      <div className="pt-28 text-center text-lg">
        Loading your donations...
      </div>
    );
  }

  return (

    <div className="pt-28 min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold text-green-700">
            My Donations
          </h1>

          <button
            onClick={() => navigate("/donate")}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + Donate Food
          </button>

        </div>

        {donations.length === 0 ? (

          <div className="text-center text-gray-500 text-lg">
            You haven't donated food yet.
          </div>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {donations.map((donation) =>
              donation.donation_items.map((item) => {

                const address = addresses[donation.address_id];

                return (

                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-md border hover:shadow-lg transition overflow-hidden"
                  >

                    {/* Image */}

                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.food_name}
                        className="h-48 w-full object-cover cursor-pointer"
                        onClick={() => setPreviewImage(item.image_url)}
                      />
                    )}

                    <div className="p-5">

                      {/* Food Name */}

                      {editingId === donation.id ? (
                        <input
                          value={editData.food_name}
                          onChange={(e) =>
                            setEditData({ ...editData, food_name: e.target.value })
                          }
                          className="border p-2 rounded w-full"
                        />
                      ) : (
                        <h2 className="text-xl font-semibold text-green-700">
                          🍛 {item.food_name}
                        </h2>
                      )}

                      {/* Category */}

                      {editingId === donation.id ? (
                        <input
                          value={editData.category}
                          onChange={(e) =>
                            setEditData({ ...editData, category: e.target.value })
                          }
                          className="border p-2 rounded w-full mt-2"
                        />
                      ) : (
                        <p className="text-gray-600 mt-2">
                          Category: {item.category}
                        </p>
                      )}

                      {/* Quantity */}

                      {editingId === donation.id ? (
                        <input
                          type="number"
                          value={editData.quantity}
                          onChange={(e) =>
                            setEditData({ ...editData, quantity: e.target.value })
                          }
                          className="border p-2 rounded w-full mt-2"
                        />
                      ) : (
                        <p className="text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      )}

                      {/* Address */}

                      <p className="text-gray-600 mt-2">
                        📍 {address?.house}, {address?.area}, {address?.city}
                      </p>

                      {/* Status */}

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium mt-2 inline-block ${
                          donation.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : donation.status === "claimed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {donation.status}
                      </span>

                      {/* Progress Bar */}

                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div
                          className={`h-2 rounded-full ${
                            donation.status === "pending"
                              ? "bg-yellow-500 w-1/3"
                              : donation.status === "claimed"
                              ? "bg-blue-500 w-2/3"
                              : "bg-green-500 w-full"
                          }`}
                        ></div>
                      </div>

                      <p className="text-gray-400 text-xs mt-2">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </p>

                      {/* Claim Requests */}
                      {claims[donation.id] && claims[donation.id].length > 0 && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold">📋 Claim Requests ({claims[donation.id].length})</h3>
                          </div>
                          <div className="space-y-3">
                            {claims[donation.id].map((claim) => (
                              <div
                                key={claim.id}
                                className="bg-white p-3 rounded-lg border border-gray-200"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="text-sm">
                                    <p className="font-semibold text-gray-800">
                                      {claim.claimer?.name || "Unknown"}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      📞 {claim.claimer?.mobile || "Not provided"}
                                    </p>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                    claim.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                    claim.status === "approved" ? "bg-green-100 text-green-700" :
                                    "bg-red-100 text-red-700"
                                  }`}>
                                    {claim.status?.toUpperCase()}
                                  </span>
                                </div>

                                {donation.status === "pending" && claim.status === "pending" ? (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleApproveClaim(claim)}
                                      className="flex-1 bg-green-600 text-white px-2 py-1.5 rounded text-xs font-semibold hover:bg-green-700"
                                    >
                                      ✅ Approve
                                    </button>
                                    <button
                                      onClick={() => handleRejectClaim(claim)}
                                      className="flex-1 bg-red-500 text-white px-2 py-1.5 rounded text-xs font-semibold hover:bg-red-600"
                                    >
                                      ❌ Reject
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Buttons */}

                      <div className="flex flex-wrap gap-2 mt-4">

                        {editingId === donation.id ? (

                          <button
                            onClick={handleSave}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold"
                          >
                            ✅ Save
                          </button>

                        ) : (

                          <button
                            onClick={() => handleEdit(donation.id, item)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-semibold"
                          >
                            ✏️ Edit
                          </button>

                        )}

                        {donation.status !== "completed" && (
                          <button
                            onClick={() => deleteDonation(donation.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold"
                          >
                            🗑️ Delete
                          </button>
                        )}

                      </div>

                      {/* Status-specific Actions */}
                      {donation.status === "claimed" && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-300 rounded-lg">
                          <p className="text-sm text-blue-800 font-semibold mb-3">
                            📍 Recipient has claimed the food. Confirm once they've picked it up:
                          </p>
                          <button
                            onClick={() => updateDonationStatus(donation.id, "picked_up")}
                            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-semibold transition"
                          >
                            ✓ Mark as Picked Up
                          </button>
                        </div>
                      )}

                      {donation.status === "picked_up" && (
                        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-lg">
                          <p className="text-sm text-emerald-800 font-semibold mb-3">
                            🎉 Food has been picked up! Mark as completed:
                          </p>
                          <button
                            onClick={() => updateDonationStatus(donation.id, "completed")}
                            className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-semibold transition"
                          >
                            ✅ Mark as Completed
                          </button>
                        </div>
                      )}

                      {donation.status === "completed" && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-lg">
                          <p className="text-sm text-green-800 font-semibold">
                            ✨ This donation is complete! Thank you for reducing food waste.
                          </p>
                        </div>
                      )}

                    </div>

                  </div>

                );

              })
            )}

          </div>

        )}

      </div>

      {/* Image Popup */}

      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            className="max-h-[90%] max-w-[90%] rounded-lg"
          />
        </div>
      )}

    </div>
  );
}