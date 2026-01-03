import { useState } from "react";
import { motion } from "framer-motion";

export default function DonateFood() {
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files.map(file => URL.createObjectURL(file)));
  };
  const [addressMode, setAddressMode] = useState("manual");
const [detectedAddress, setDetectedAddress] = useState("");

const detectLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      // TEMP (Frontend demo)
      setDetectedAddress(
        `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`
      );
    },
    () => {
      alert("Location access denied");
    }
  );
};


  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-green-600 mb-8">
          Donate Food 🍱
        </h2>

        <form className="space-y-6">

          {/* Food Name */}
          <input
            type="text"
            placeholder="Food Name"
            className="w-full border p-3 rounded-lg"
            required
          />

          {/* Category */}
          <select className="w-full border p-3 rounded-lg">
            <option>Cooked Food</option>
            <option>Packed Food</option>
            <option>Raw Food</option>
          </select>

          {/* Quantity */}
          <input
            type="number"
            placeholder="Quantity (Number of People)"
            className="w-full border p-3 rounded-lg"
            required
          />

          {/* Cooked Date & Time */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      Cooked Date
    </label>
    <input
      type="date"
      className="w-full border p-3 rounded-lg"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      Cooked Time
    </label>
    <input
      type="time"
      className="w-full border p-3 rounded-lg"
      placeholder="e.g. 10:30 AM"
      required
    />
  </div>
</div>

{/* Expiry Date & Time */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      Expiry Date
    </label>
    <input
      type="date"
      className="w-full border p-3 rounded-lg"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      Expiry Time
    </label>
    <input
      type="time"
      className="w-full border p-3 rounded-lg"
      placeholder="e.g. 04:00 PM"
      required
    />
  </div>
</div>


          {/* Image Upload */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
          />

          {/* Image Preview */}
          <div className="flex gap-3 flex-wrap">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-24 h-24 object-cover rounded-lg"
              />
            ))}
          </div>

         {/* Pickup Address */}
<div className="space-y-4">
  <h3 className="text-lg font-semibold text-gray-700">
    Pickup Address
  </h3>

  {/* Address Mode Selection */}
  <div className="flex gap-6">
    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="addressMode"
        value="manual"
        checked={addressMode === "manual"}
        onChange={() => setAddressMode("manual")}
      />
      Enter manually
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="addressMode"
        value="auto"
        checked={addressMode === "auto"}
        onChange={() => setAddressMode("auto")}
      />
      Detect my location
    </label>
  </div>

  {/* Manual Pickup Address */}
{/* Manual Pickup Address */}
{addressMode === "manual" && (
  <div className="space-y-5">
    <h3 className="text-lg font-semibold text-gray-700">
      Pickup Address Details
    </h3>

    {/* Name & Contact */}
    <div className="grid md:grid-cols-2 gap-4">
      <input
        type="text"
        placeholder="Full Name *"
        className="border p-3 rounded-lg w-full"
        required
      />

      <input
        type="tel"
        placeholder="Contact Number *"
        className="border p-3 rounded-lg w-full"
        required
      />
    </div>

    <input
      type="text"
      placeholder="House No. / Building Name *"
      className="border p-3 rounded-lg w-full"
      required
    />

    <input
      type="text"
      placeholder="Road / Area / Colony *"
      className="border p-3 rounded-lg w-full"
      required
    />

    <input
      type="text"
      placeholder="Nearby Landmark (optional)"
      className="border p-3 rounded-lg w-full"
    />

    <input
      type="text"
      placeholder="Pincode *"
      className="border p-3 rounded-lg w-full"
      required
    />

    <div className="grid md:grid-cols-2 gap-4">
      <input
        type="text"
        placeholder="City *"
        className="border p-3 rounded-lg w-full"
        required
      />
    </div>
  </div>
)}

  {/* Auto Location Detection */}
  {addressMode === "auto" && (
    <button
      type="button"
      onClick={detectLocation}
      className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
    >
      Detect Location 📍
    </button>
  )}

  {/* Detected Address Display */}
  {detectedAddress && (
    <div className="p-3 bg-gray-100 rounded-lg text-sm">
      <strong>Detected Address:</strong> {detectedAddress}
    </div>
  )}
</div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
          >
            Submit Donation
          </button>

        </form>
      </motion.div>
    </div>
  );
}
