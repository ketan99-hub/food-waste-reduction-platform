import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [donations, setDonations] = useState({});
  const [donors, setDonors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyClaims();

    // Real-time subscription
    const claimsChannel = supabase
      .channel("my_claims")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "claims" },
        () => fetchMyClaims()
      )
      .subscribe();

    return () => supabase.removeChannel(claimsChannel);
  }, []);

  const fetchMyClaims = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        setError("Please login to view claims");
        return;
      }

      const { data: claimsData, error: claimsError } = await supabase
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
        .eq("claimer_id", sessionData.session.user.id)
        .order("created_at", { ascending: false });

      if (claimsError) throw claimsError;

      setClaims(claimsData || []);

      // Fetch donor info for each donation
      const donorMap = {};
      for (const claim of claimsData || []) {
        if (claim.donations?.user_id) {
          const { data: donorData } = await supabase
            .from("profiles")
            .select("id, name, email, mobile")
            .eq("id", claim.donations.user_id)
            .single();

          if (donorData) {
            donorMap[claim.donations.user_id] = donorData;
          }
        }
      }
      setDonors(donorMap);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching claims:", err);
      setError("Unable to load claims");
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "approved":
        return "✅";
      case "rejected":
        return "❌";
      case "completed":
        return "🎉";
      default:
        return "📦";
    }
  };

  if (loading) {
    return (
      <div className="pt-28 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading your claims...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 min-h-screen bg-gray-50 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-2">🛒 My Food Claims</h1>
          <p className="text-gray-600">Track your claimed food donations</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}

        {claims.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-xl text-gray-500 mb-4">No claims yet</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Browse Donations
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {claims.map((claim) => {
              const donation = claim.donations;
              const donor = donation?.user_id ? donors[donation.user_id] : null;
              const address = donation?.addresses;
              const foodItems = donation?.donation_items || [];
              const firstItem = foodItems[0];

              return (
                <div
                  key={claim.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  <div className="md:flex">
                    {/* Left: Food Image */}
                    {firstItem?.image_url && (
                      <div className="md:w-48 h-48">
                        <img
                          src={firstItem.image_url}
                          alt={firstItem.food_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Right: Details */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">
                            🍛 {firstItem?.food_name || "Food Donation"}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            📦 {firstItem?.quantity || "?"} meals
                          </p>
                        </div>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${getStatusColor(claim.status)}`}>
                          {getStatusEmoji(claim.status)} {claim.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Timing */}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        {firstItem?.cooked_time && (
                          <p className="text-gray-700">
                            <span className="font-semibold">⏰ Cooked:</span> {firstItem.cooked_time}
                          </p>
                        )}
                        {firstItem?.expiry_time && (
                          <p className="text-red-600 font-semibold">
                            ⏳ Expires: {firstItem.expiry_time}
                          </p>
                        )}
                      </div>

                      {/* Location */}
                      {address && (
                        <p className="text-gray-700 mb-4">
                          📍 {address.house}, {address.area}, {address.city} - {address.pincode}
                        </p>
                      )}

                      {/* Donor Info - Show only if approved */}
                      {claim.status === "approved" && donor && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <h4 className="font-bold text-green-800 mb-2">👤 Donor Contact</h4>
                          <p className="text-gray-700">
                            <span className="font-semibold">Name:</span> {donor.name}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Phone:</span> {donor.mobile || "Not provided"}
                          </p>
                          <p className="text-gray-700 mt-2">
                            <span className="font-semibold">📍 Pickup Location:</span>
                            <br /> {address.house}, {address.area}, {address.city}
                          </p>
                          <div className="mt-4 bg-blue-50 p-3 rounded border border-blue-200">
                            <p className="text-sm text-blue-800 font-semibold mb-2">📋 Pickup Instructions:</p>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li>✓ Bring a container/bag for the food</li>
                              <li>✓ Call the donor before arriving</li>
                              <li>✓ Arrive before expiry time</li>
                              <li>✓ Confirm pickup with donor</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Status Messages */}
                      {claim.status === "pending" && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                          <p className="text-yellow-800">
                            ⏳ <span className="font-semibold">Waiting for donor approval...</span>
                            <br />
                            <span className="text-sm">You'll get notified once they approve your claim.</span>
                          </p>
                        </div>
                      )}

                      {claim.status === "rejected" && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                          <p className="text-red-800">
                            ❌ <span className="font-semibold">Your claim was rejected</span>
                            <br />
                            <span className="text-sm">Try claiming other available donations.</span>
                          </p>
                        </div>
                      )}

                      {claim.status === "completed" && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <p className="text-blue-800">
                            🎉 <span className="font-semibold">Food pickup completed!</span>
                            <br />
                            <span className="text-sm">Thank you for helping reduce food waste.</span>
                          </p>
                        </div>
                      )}

                      {/* Claim Details */}
                      <div className="flex gap-4 text-sm text-gray-600 mb-4">
                        <span> {new Date(claim.created_at).toLocaleDateString()}</span>
                      </div>

                      {/* Action Button */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/claim-detail/${claim.id}`)}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold transition"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
