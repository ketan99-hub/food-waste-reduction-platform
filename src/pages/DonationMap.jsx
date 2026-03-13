import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

export default function DonationMap() {

  const [donations, setDonations] = useState([]);
  const [addresses, setAddresses] = useState({});
  const [selectedDonation, setSelectedDonation] = useState(null);

  const markerPoints = useMemo(() => {
    return donations
      .map((d) => {
        const addr = addresses[d.address_id];
        if (!addr?.latitude || !addr?.longitude) return null;
        return {
          donation: d,
          lat: Number(addr.latitude),
          lng: Number(addr.longitude),
        };
      })
      .filter(Boolean);
  }, [donations, addresses]);

  const bounds = useMemo(() => {
    if (!markerPoints.length) return null;
    const lats = markerPoints.map((p) => p.lat);
    const lngs = markerPoints.map((p) => p.lng);
    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ];
  }, [markerPoints]);

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

      const items = donation.donation_items || [];
      const firstItem = items[0];
      const address = addresses[donation.address_id];

      if (!firstItem) return null;

      return (

        <div
          key={donation.id}
          onClick={() => setSelectedDonation(donation)}
          className="bg-white p-5 rounded-xl shadow-md border cursor-pointer hover:shadow-lg transition"
        >

          {firstItem.image_url && (
            <img
              src={firstItem.image_url}
              alt={firstItem.food_name}
              className="h-40 w-full object-cover rounded"
            />
          )}

          <h2 className="text-xl font-semibold text-green-700 mt-3">
            🍛 {firstItem.food_name}
          </h2>

          <p className="text-gray-600">
            📦 {firstItem.quantity} meals{items.length > 1 ? ` • +${items.length - 1} more item${items.length - 1 === 1 ? "" : "s"}` : ""}
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

        const items = selectedDonation.donation_items || [];
        const address = addresses[selectedDonation.address_id];

        return (

          <>
            <h2 className="text-2xl font-bold text-green-700">
              🍛 {items[0]?.food_name}
            </h2>

            <div className="text-gray-600 mt-3">
              {items.map((itm, idx) => (
                <p key={idx}>
                  📦 {itm.quantity} × {itm.food_name}
                </p>
              ))}
            </div>

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
      bounds={bounds}
      center={
        selectedDonation
          ? [
              addresses[selectedDonation.address_id]?.latitude || 21.1458,
              addresses[selectedDonation.address_id]?.longitude || 79.0882
            ]
          : [
              addresses[donations[0]?.address_id]?.latitude || 21.1458,
              addresses[donations[0]?.address_id]?.longitude || 79.0882
            ]
      }
      zoom={12}
      style={{ height: "400px", width: "100%" }}
    >

      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markerPoints.map((point, index) => {
        const addr = addresses[point.donation.address_id];
        const items = point.donation.donation_items || [];
        const firstItem = items[0];

        // Offset markers slightly if multiple donations share the same coords
        const offset = (index % 5) * 0.00006;
        const lat = point.lat + offset;
        const lng = point.lng + offset;

        return (
          <Marker key={point.donation.id} position={[lat, lng]}>
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold">{firstItem?.food_name || "Donation"}</div>
                <div className="text-xs text-gray-600">
                  {items.length} item{items.length === 1 ? "" : "s"}
                </div>
                <div className="text-xs">
                  {addr?.city}, {addr?.area}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

    </MapContainer>

  </div>

)}

    </div>
  );
}