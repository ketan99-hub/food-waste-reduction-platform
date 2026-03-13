import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function DonationMap() {

  const [donations, setDonations] = useState([]);
  const [addresses, setAddresses] = useState({});
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    fetchDonations();
    fetchAddresses();
  }, []);
const fetchDonations = async () => {
  const { data, error } = await supabase
    .from("donations")
    .select(`
      id,
      status,
      created_at,
      address_id,
      donation_items (
        food_name,
        category,
        quantity,
        image_url
      )
    `);

  if (error) {
    console.error('Error fetching donations:', error.message || error);
  } else {
    setDonations(data || []);
  }
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
    console.error('Error fetching addresses:', error.message || error);
  } else {
    const addressMap = {};
    data.forEach(addr => {
      addressMap[addr.id] = addr;
    });
    setAddresses(addressMap);
  }
};

  return (

    <div className="pt-28 px-6">

      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Available Donations
      </h1>

      {/* Donation List */}


{!selectedDonation && (

  <div className="grid md:grid-cols-3 gap-6">

    {donations.map((donation) => {

      const item = donation.donation_items?.[0];
      const address = addresses[donation.address_id];

      if (!item) return null;

      return (

        <div
          key={donation.id}
          onClick={() => setSelectedDonation(donation)}
          className="bg-white p-5 rounded-xl shadow-md border cursor-pointer hover:shadow-lg transition"
        >

          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.food_name}
              className="h-40 w-full object-cover rounded"
            />
          )}

          <h2 className="text-xl font-semibold text-green-700 mt-3">
            🍛 {item.food_name}
          </h2>

          <p className="text-gray-600">
            📦 {item.quantity} meals
          </p>

          <p className="text-gray-600">
            📍 {address?.city || "Location not available"}
          </p>

        </div>

      );

    })}

  </div>

)}

{/* Split View */}

{selectedDonation && (

  <div className="grid md:grid-cols-2 gap-6">

    {/* Left Side Details */}

    <div className="bg-white p-6 rounded-xl shadow-md border">

      <button
        onClick={() => setSelectedDonation(null)}
        className="mb-4 text-blue-600"
      >
        ← Back to list
      </button>

      {(() => {

        const item = selectedDonation.donation_items?.[0];
        const address = addresses[selectedDonation.address_id];

        return (

          <>
            <h2 className="text-2xl font-bold text-green-700">
              🍛 {item?.food_name}
            </h2>

            <p className="text-gray-600 mt-3">
              📦 Quantity: {item?.quantity}
            </p>

            <p className="text-gray-600">
              📍 Location: {address?.city}
            </p>

            <p className="text-gray-600">
              Status: {selectedDonation.status}
            </p>
          </>

        );

      })()}

    </div>

    {/* Right Side Map */}

    <MapContainer
      center={[
        addresses[selectedDonation.address_id]?.latitude || 21.1458,
        addresses[selectedDonation.address_id]?.longitude || 79.0882
      ]}
      zoom={15}
      style={{ height: "400px", width: "100%" }}
    >

      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={[
          addresses[selectedDonation.address_id]?.latitude || 21.1458,
          addresses[selectedDonation.address_id]?.longitude || 79.0882
        ]}
      >

        <Popup>

          🍛 {selectedDonation.donation_items?.[0]?.food_name} <br />
          📦 {selectedDonation.donation_items?.[0]?.quantity} meals

        </Popup>

      </Marker>

    </MapContainer>

  </div>

)}

    </div>
  );
}