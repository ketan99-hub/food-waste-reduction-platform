import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

export default function ClaimDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [donation, setDonation] = useState(null);
  const [donor, setDonor] = useState(null);
  const [address, setAddress] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    fetchClaimDetails();

    // Real-time subscription
    const claimChannel = supabase
      .channel(`claim_${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "claims", filter: `id=eq.${id}` },
        () => fetchClaimDetails()
      )
      .subscribe();

    return () => supabase.removeChannel(claimChannel);
  }, [id]);

  const fetchClaimDetails = async () => {
    try {
      const { data: claimData, error: claimError } = await supabase
        .from("claims")
        .select(`
          id,
          donation_id,
          status,
          created_at,
          donations (
            id,
            status,
            address_id,
            user_id,
            donation_items (
              id,
              food_name,
              category,
              quantity,
              image_url,
              cooked_time,
              expiry_time
            ),
            addresses (
              id,
              house,
              area,
              city,
              pincode,
              latitude,
              longitude
            )
          )
        `)
        .eq("id", id)
        .single();

      if (claimError) throw claimError;

      setClaim(claimData);
      setDonation(claimData.donations);
      setAddress(claimData.donations?.addresses);
      setFoodItems(claimData.donations?.donation_items || []);

      // Fetch donor separately
      if (claimData.donations?.user_id) {
        const { data: donorData, error: donorError } = await supabase
          .from("profiles")
          .select("id, name, mobile, email")
          .eq("id", claimData.donations.user_id)
          .single();

        if (!donorError && donorData) {
          setDonor(donorData);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching claim:", err);
      setError("Unable to load claim details");
      setLoading(false);
    }
  };

  const handleConfirmPickup = async () => {
    if (!confirm("Did you pick up the food? This cannot be undone.")) return;

    setConfirming(true);
    try {
      // Update claim status to completed
      const { error: claimError } = await supabase
        .from("claims")
        .update({ status: "completed" })
        .eq("id", id);

      if (claimError) throw claimError;

      // Update donation status to completed
      const { error: donationError } = await supabase
        .from("donations")
        .update({ status: "completed" })
        .eq("id", claim.donation_id);

      if (donationError) throw donationError;

      alert("✅ Thank you for picking up the food!\n\nYou've helped reduce food waste. 🌍");
      await fetchClaimDetails();
    } catch (err) {
      console.error("Error confirming pickup:", err);
      alert("Failed to confirm pickup. Please try again.");
    } finally {
      setConfirming(false);
    }
  };

  const handleContactDonor = () => {
    if (donor?.mobile) {
      window.location.href = `tel:${donor.mobile}`;
    }
  };

  if (loading) {
    return (
      <div className="pt-28 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading claim details...</p>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="pt-28 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error || "Claim not found"}</p>
          <button
            onClick={() => navigate("/my-claims")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to My Claims
          </button>
        </div>
      </div>
    );
  }

  const firstItem = foodItems[0];
  const isApproved = claim.status === "approved";
  const isCompleted = claim.status === "completed";
  const isPending = claim.status === "pending";
  const isRejected = claim.status === "rejected";

  return (
    <div className="pt-28 min-h-screen bg-gray-50 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => navigate("/my-claims")}
          className="mb-6 text-green-600 hover:text-green-700 font-semibold"
        >
          ← Back to My Claims
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-3">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  🛒 Claim #{claim.id.slice(0, 8).toUpperCase()}
                </h1>
                <p className="text-gray-600">
                  Claimed on {new Date(claim.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className={`inline-block px-4 py-2 rounded-full font-bold text-lg ${
                  isPending ? "bg-yellow-100 text-yellow-800" :
                  isApproved ? "bg-green-100 text-green-800" :
                  isCompleted ? "bg-blue-100 text-blue-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {isPending && "⏳ PENDING"}
                  {isApproved && "✅ APPROVED"}
                  {isCompleted && "🎉 COMPLETED"}
                  {isRejected && "❌ REJECTED"}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                <span>Claim Progress</span>
                <span>{
                  isPending ? "25%" :
                  isApproved ? "50%" :
                  isCompleted ? "100%" : "0%"
                }</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    isPending ? "bg-yellow-500 w-1/4" :
                    isApproved ? "bg-green-500 w-1/2" :
                    isCompleted ? "bg-blue-500 w-full" :
                    "bg-red-500 w-0"
                  }`}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Pending</span>
                <span>Approved</span>
                <span>Picked Up</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Food & Details */}
          <div className="space-y-6">
            {/* Food Items */}
            {firstItem && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {firstItem.image_url && (
                  <img
                    src={firstItem.image_url}
                    alt={firstItem.food_name}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800">🍛 {firstItem.food_name}</h2>
                  <div className="mt-4 space-y-2 text-gray-700">
                    <p>📦 Quantity: <span className="font-semibold">{firstItem.quantity} meals</span></p>
                    <p>🏷️ Category: <span className="font-semibold">{firstItem.category}</span></p>
                    {firstItem.cooked_time && (
                      <p>⏰ Cooked: <span className="font-semibold">{firstItem.cooked_time}</span></p>
                    )}
                    {firstItem.expiry_time && (
                      <p className="text-red-600">
                        ⏳ Expires: <span className="font-bold">{firstItem.expiry_time}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Claim Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Claim Info</h3>
              <div className="space-y-3 text-gray-700">
                <p>📅 Claimed on: <span className="font-semibold">{new Date(claim.created_at).toLocaleDateString()}</span></p>
              </div>
            </div>
          </div>

          {/* Right: Donor Info & Map */}
          <div className="space-y-6">
            {/* Donor Contact - Only if Approved */}
            {isApproved && donor && (
              <div className="bg-green-50 border-2 border-green-500 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">👤 Donor Contact</h3>
                <div className="space-y-3 text-gray-800 mb-4">
                  <p>
                    <span className="font-semibold">Name:</span> {donor.name}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> {donor.mobile || "Not provided"}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {donor.email || "Not provided"}
                  </p>
                </div>

                {donor.mobile && (
                  <button
                    onClick={handleContactDonor}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold transition mb-4"
                  >
                    📞 Call Donor
                  </button>
                )}

                <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                  <p className="text-sm font-bold text-blue-900 mb-3">📋 Pickup Instructions:</p>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>✓ Bring a container/bag for the food</li>
                    <li>✓ Call the donor before arriving</li>
                    <li>✓ Arrive before {firstItem?.expiry_time || "expiry time"}</li>
                    <li>✓ Follow all food safety guidelines</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Pending Status */}
            {isPending && (
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-yellow-800 mb-3">⏳ Waiting for Approval</h3>
                <p className="text-yellow-700 mb-4">
                  The donor is reviewing your claim. You'll be notified once they approve.
                </p>
              </div>
            )}

            {/* Rejected Status */}
            {isRejected && (
              <div className="bg-red-50 border-2 border-red-400 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-red-800 mb-3">❌ Claim Rejected</h3>
                <p className="text-red-700 mb-4">
                  Unfortunately, the donor rejected your claim. Try claiming other available donations.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-semibold"
                >
                  Browse More Donations
                </button>
              </div>
            )}

            {/* Completed Status */}
            {isCompleted && (
              <div className="bg-blue-50 border-2 border-blue-500 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-3">🎉 Pickup Completed!</h3>
                <p className="text-blue-700 mb-4">
                  Thank you for helping reduce food waste! Your contribution makes a difference.
                </p>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-800 font-semibold">Impact Summary:</p>
                  <p className="text-sm text-blue-700 mt-2">
                    ✓ {firstItem?.quantity || "1"} meals saved from waste
                    <br/>
                    ✓ Supporting sustainable food distribution
                  </p>
                </div>
              </div>
            )}

            {/* Map */}
            {address && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-bold text-gray-800">📍 Pickup Location</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {address.house}, {address.area}, {address.city} - {address.pincode}
                  </p>
                </div>
                {address.latitude && address.longitude ? (
                  <MapContainer
                    center={[address.latitude, address.longitude]}
                    zoom={16}
                    style={{ height: "300px", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap contributors'
                    />
                    <Marker
                      position={[address.latitude, address.longitude]}
                      icon={L.icon({
                        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
                        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41],
                      })}
                    >
                      <Popup>
                        <div className="text-sm font-semibold">
                          {address.house}
                          <br />
                          {address.area}
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500">Location map not available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Confirm Pickup Button - Only if Approved and Not Completed */}
        {isApproved && !isCompleted && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Have you picked up the food?
            </h3>
            <button
              onClick={handleConfirmPickup}
              disabled={confirming}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold text-lg transition"
            >
              {confirming ? "Confirming..." : "✅ Confirm Food Pickup"}
            </button>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Only click this after you've picked up the food. Once confirmed, the donation will be marked as completed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
