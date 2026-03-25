import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

export default function DonationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [donationItems, setDonationItems] = useState([]);
  const [donor, setDonor] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDonationDetails();
  }, [id]);

  const fetchDonationDetails = async () => {
    try {
      setLoading(true);

      // Fetch donation with items and donor info
      const { data: donationData, error: donationError } = await supabase
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
            image_url,
            cooked_time,
            expiry_time
          ),
          user_id
        `)
        .eq("id", id)
        .single();

      if (donationError) throw donationError;

      setDonation(donationData);
      setDonationItems(donationData.donation_items || []);

      // Fetch donor separately
      if (donationData.user_id) {
        const { data: donorData, error: donorError } = await supabase
          .from("profiles")
          .select("id, name, email, mobile")
          .eq("id", donationData.user_id)
          .single();

        if (!donorError && donorData) {
          setDonor(donorData);
        }
      }

      // Fetch address
      const { data: addressData, error: addressError } = await supabase
        .from("addresses")
        .select("*")
        .eq("id", donationData.address_id)
        .single();

      if (!addressError) {
        setAddress(addressData);
      }
    } catch (err) {
      console.error("Error fetching donation:", err);
      setError("Unable to load donation details");
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = () => {
    navigate(`/claim/${id}`);
  };

  const handleContact = () => {
    if (donor?.mobile) {
      window.location.href = `tel:${donor.mobile}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading donation details...</p>
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error || "Donation not found"}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-green-600 hover:text-green-700 font-semibold"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Details */}
          <div className="space-y-6">
            {/* Food Items */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🍛 Food Items</h2>
              <div className="space-y-4">
                {donationItems.map((item) => (
                  <div key={item.id} className="border-l-4 border-green-600 pl-4 py-2">
                    <h3 className="text-lg font-semibold text-gray-800">{item.food_name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      📦 Category: <span className="font-medium">{item.category}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      📊 Quantity: <span className="font-medium">{item.quantity} meals</span>
                    </p>
                    {item.cooked_time && (
                      <p className="text-sm text-gray-600">
                        ⏰ Cooked at: <span className="font-medium">{item.cooked_time}</span>
                      </p>
                    )}
                    {item.expiry_time && (
                      <p className="text-sm text-red-600 font-medium">
                        ⏳ Expires at: {item.expiry_time}
                      </p>
                    )}
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.food_name}
                        className="mt-3 w-full h-40 object-cover rounded-lg"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Donor Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">👤 Donor Information</h3>
              {donor ? (
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <span className="font-semibold">Name:</span> {donor.name}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Phone:</span> {donor.mobile || "Not provided"}
                  </p>
                  <button
                    onClick={handleContact}
                    disabled={!donor.mobile}
                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                  >
                    📞 Contact Donor
                  </button>
                </div>
              ) : (
                <p className="text-gray-600">Donor information not available</p>
              )}
            </div>

            {/* Pickup Location */}
            {address && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">📍 Pickup Location</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">{address.house}</p>
                  <p className="text-gray-700">{address.area}</p>
                  <p className="text-gray-700">
                    {address.city}, {address.pincode}
                  </p>
                </div>
              </div>
            )}

            {/* Claim Button */}
            <button
              onClick={handleClaim}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold text-lg"
            >
              🛒 Claim Food
            </button>
          </div>

          {/* Right Side: Map */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-fit sticky top-24">
            {address && address.latitude && address.longitude ? (
              <MapContainer
                center={[address.latitude, address.longitude]}
                zoom={16}
                style={{ height: "500px", width: "100%" }}
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
              <div className="h-80 flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">Location map not available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
