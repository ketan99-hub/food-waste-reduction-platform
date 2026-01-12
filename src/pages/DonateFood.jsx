import { supabase } from "../lib/supabase";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRef } from "react";


export default function DonateFood() {

  const fileInputRef = useRef(null);

  const [donation, setDonation] = useState({
  foodItems: [
    {
      foodName: "",
      category: "",
      quantity: "",
      cookedDate: "",
      cookedTime: "",
      expiryDate: "",
      expiryTime: ""
    }
  ]
});
const addFoodItem = () => {
  setDonation({
    ...donation,
    foodItems: [
      ...donation.foodItems,
      {
        foodName: "",
        category: "",
        quantity: "",
        cookedDate: "",
        cookedTime: "",
        expiryDate: "",
        expiryTime: "",
        image: null 
      }
    ]
  });
};
async function uploadFoodImage(file) {
  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("donation-imagess")   // ✅ SAME bucket
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("donation-imagess")   // ✅ SAME bucket
    .getPublicUrl(fileName);

  return data.publicUrl;
}


const handleFoodChange = (index, field, value) => {
  const updatedFoodItems = [...donation.foodItems];
  updatedFoodItems[index][field] = value;

  setDonation({
    ...donation,
    foodItems: updatedFoodItems
  });
};


  const [images, setImages] = useState([]);
   const [addressMode, setAddressMode] = useState("manual");
  const [detectedAddress, setDetectedAddress] = useState("");

  const finalPayload = {
  donationDetails: donation,
  images,
  addressMode,
  detectedAddress
};


const handleImageUpload = (index, file) => {
  if (!file) return;

  const previewUrl = URL.createObjectURL(file);

  const updatedItems = [...donation.foodItems];
  updatedItems[index] = {
    ...updatedItems[index],
    image: file,
    preview: previewUrl,
  };

  setDonation({
    ...donation,
    foodItems: updatedItems,
  });
};


const detectLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      console.log("LAT :", lat);
      console.log("LNG :", lng);

      setAddress((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
    },
    (error) => {
      console.error(error);
      alert("Location access denied");
    }
  );
};

const [address, setAddress] = useState({
  full_name: "",
  phone: "",
  house: "",
  area: "",
  landmark: "",
  city: "",
  pincode: "",
  latitude: null,
  longitude: null,
});



// detectLocation ke baad

const submitDonation = async (e) => {
  try {
    e.preventDefault();

    // 🔴 safety check (important)
    if (addressMode === "manual" && !address.full_name) {
      alert("Please fill address details");
      return;
    }

    console.log("ADDRESS STATE 👉", address);

    // 1️⃣ Address insert
    const { data: addressData, error: addressError } = await supabase
      .from("addresses")
      .insert({
        full_name: address.full_name,
        phone: address.phone,
        house: address.house,
        area: address.area,
        landmark: address.landmark,
        city: address.city,
        pincode: address.pincode,
        latitude: address.latitude,
        longitude: address.longitude,
      })
      .select()
      .single();

    if (addressError) {
      console.error("ADDRESS ERROR 👉", addressError);
      throw addressError;
    }

    console.log("ADDRESS SAVED ✅", addressData);

    // ❗ Create donation with address_id
    const { data: donationData, error: donationError } = await supabase
      .from("donations")
      .insert({
        address_id: addressData.id,
        status: "pending",
      })
      .select()
      .single();

    if (donationError) {
      console.error("DONATION ERROR 👉", donationError);
      throw donationError;
    }

    console.log("DONATION SAVED ✅", donationData);
    console.log("DONATION ID 👉", donationData?.id);
    console.log("FOOD ITEMS 👉", donation.foodItems);

    const itemsToInsert = [];

    for (const food of donation.foodItems) {
      let imageUrl = null;

      if (food.image) {
        imageUrl = await uploadFoodImage(food.image);
      }

      itemsToInsert.push({
        donation_id: donationData.id,
        food_name: food.foodName,
        category: food.category,
        quantity: Number(food.quantity),
        cooked_date: food.cookedDate,
        cooked_time: food.cookedTime,
        expiry_date: food.expiryDate,
        expiry_time: food.expiryTime,
        image_url: imageUrl,
      });
    }

    const { error: itemsError } = await supabase
      .from("donation_items")
      .insert(itemsToInsert);

    if (itemsError) {
      console.error("DONATION ITEMS ERROR 👉", itemsError);
      throw itemsError;
    }

    alert("Donation saved successfully 🎉");
  } catch (error) {
    console.error("Error submitting donation:", error);
    alert("Error submitting donation. Please try again.");
  }
};


  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-10 border border-gray-100"
      >
       <h2 className="text-4xl font-extrabold text-center mb-3">
   Donate Surplus Food
</h2>

<p className="text-center text-gray-500 mb-10">
  Help reduce food waste by sharing excess food with those in need
</p>

        <form onSubmit={submitDonation} className="space-y-6">

          {/* Food Name */}
 {donation.foodItems.map((food, index) => (
  <div
    key={index}
    className="border border-green-200 rounded-xl p-5 space-y-4"
  >
    
    <h4 className="font-semibold text-green-700">
      Food Item {index + 1}
    </h4>

    <input
      type="text"
      placeholder="Food Name"
      value={food.foodName}
      onChange={(e) =>
        handleFoodChange(index, "foodName", e.target.value)
      }
      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
      required
    />

    <select
      value={food.category}
      onChange={(e) =>
        handleFoodChange(index, "category", e.target.value)
      }
      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
    >
      <option value="">Select Category</option>
<option value="Cooked Food">Cooked Food</option>
<option value="Packed Food">Packed Food</option>
<option value="Raw Food">Raw Food</option>

    </select>

    <input
    
      type="number"
      placeholder="Quantity (Number of People)"
    
      value={food.quantity}
      onChange={(e) =>
handleFoodChange(index, "quantity", Number(e.target.value))
      }
      className="w-full border p-3 rounded-lg focus:ring-green-500 outline-none transition"
      required
    />

    {/* Cooked */}
<div className="grid md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      Cooked Date
    </label>
    <input
      type="date"
      value={food.cookedDate}
      onChange={(e) =>
        handleFoodChange(index, "cookedDate", e.target.value)
      }
      className="border p-3 rounded-lg w-full focus:ring-green-500 outline-none transition"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      Cooked Time
    </label>
    <input
      type="time"
      value={food.cookedTime}
      onChange={(e) =>
        handleFoodChange(index, "cookedTime", e.target.value)
      }
      className="border p-3 rounded-lg w-full focus:ring-green-500 outline-none transition"
      placeholder="When food was cooked"
      required
    />
    <p className="text-xs text-gray-400 mt-1">
      Time when food was prepared
    </p>
  </div>
</div>

{/* Expiry */}
<div className="grid md:grid-cols-2 gap-4 mt-4">
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      Expiry Date
    </label>
    <input
      type="date"
      value={food.expiryDate}
      onChange={(e) =>
        handleFoodChange(index, "expiryDate", e.target.value)
      }
      className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none transition"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      Expiry Time
    </label>
    <input
      type="time"
      value={food.expiryTime}
      onChange={(e) =>
        handleFoodChange(index, "expiryTime", e.target.value)
      }
      className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none transition"
      placeholder="Until food is safe"
      required
    />
    <p className="text-xs text-gray-400 mt-1">
      Food should be consumed before this time
    </p>

  </div>
</div>


     {/* Food Image Upload */}
<div className="flex flex-col gap-2">
  <label
    htmlFor={`food-image-${index}`}
    className="flex items-center gap-2 cursor-pointer bg-gray-100 p-3 rounded-lg hover:bg-gray-200"
  >
    📷 Upload Food Image
  </label>

  <input
    id={`food-image-${index}`}   // 👈 MUST MATCH htmlFor
    type="file"
    accept="image/*"
    capture="environment"
    className="hidden"
    onChange={(e) =>
      handleImageUpload(index, e.target.files[0])
    }
  />
</div>




     {/* Image Preview + Delete */}
{food.preview && (
  <div className="relative mt-3 w-32 h-32">
    <img
      src={food.preview}
      alt="Food Preview"
      className="w-full h-full object-cover rounded-lg border"
    />

    {/* DELETE BUTTON */}
    <button
  type="button"
  onClick={() => {
    const updatedItems = [...donation.foodItems];
    updatedItems[index] = {
      ...updatedItems[index],
      image: null,
      preview: null,
    };

    setDonation({
      ...donation,
      foodItems: updatedItems,
    });

    // 🔥 RESET FILE INPUT
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }}
  className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm"
>
  ✕
</button>

  </div>
)}




          <button
  type="button"
  onClick={addFoodItem}
  className="w-full py-4 border-2 border-dashed border-green-500 rounded-2xl text-green-600 font-semibold hover:bg-green-50 transition"
>
  ➕ Add Another Food Item
</button>

  </div>
))}

         {/* Pickup Address */}
<div className="space-y-4">
 <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
   Pickup Address
</h3>


  

  <div className="space-y-5">
    <h3 className="text-lg font-semibold text-gray-700">
      Pickup Address Details
    </h3>

    {/* Name & Contact */}
    <div className="grid md:grid-cols-2 gap-4">
      <input
  type="text"
  placeholder="Full Name *"
  className="border p-3 rounded-lg w-full focus:ring-green-500 outline-none transition"
  value={address.full_name}
  onChange={(e) =>
    setAddress({ ...address, full_name: e.target.value })
  }
  required
/>


     <input
  type="tel"
  placeholder="Contact Number *"
  className="border p-3 rounded-lg w-full focus:ring-green-500 outline-none transition"
  value={address.phone}
  onChange={(e) =>
    setAddress({ ...address, phone: e.target.value })
  }
  required
/>

    </div>

    <input
  type="text"
  placeholder="House No. / Building Name *"
  className="border p-3 rounded-lg w-full focus:ring-green-500 outline-none transition"
  value={address.house}
  onChange={(e) =>
    setAddress({ ...address, house: e.target.value })
  }
  required
/>


   <input
  type="text"
  placeholder="Road / Area / Colony *"
  className="border p-3 rounded-lg w-full focus:ring-green-500 outline-none transition"
  value={address.area}
  onChange={(e) =>
    setAddress({ ...address, area: e.target.value })
  }
  required
/>


   <input
  type="text"
  placeholder="Nearby Landmark (optional)"
  className="border p-3 rounded-lg w-full focus:ring-green-500 outline-none transition"
  value={address.landmark}
  onChange={(e) =>
    setAddress({ ...address, landmark: e.target.value })
  }
/>


    <input
  type="text"
  placeholder="Pincode *"
  className="border p-3 rounded-lg w-full focus:ring-green-500 outline-none transition"
  value={address.pincode}
  onChange={(e) =>
    setAddress({ ...address, pincode: e.target.value })
  }
  required
/>

    <div className="grid md:grid-cols-2 gap-4">
     <input
  type="text"
  placeholder="City *"
  className="border p-3 rounded-lg w-full focus:ring-green-500 outline-none transition"
  value={address.city}
  onChange={(e) =>
    setAddress({ ...address, city: e.target.value })
  }
  required
/>

    </div>
  </div>


  {/* Auto Location Detection */}
  
    <button
      type="button"
      onClick={detectLocation}
      className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
    >
      Detect Location 📍
    </button>


  {/* Detected Address Display */}


  {/* : show lat/lng */}
{address.latitude && address.longitude && (
  <p className="text-sm text-gray-600 text-center">
    Location detected :   
    <span className="font-medium">
       Latitude:
    </span>{" "}
    {address.latitude},{" "}
    <span className="font-medium">
      Longitude:
    </span>{" "}
    {address.longitude}
  </p>
)}

</div>

          {/* Submit */}
        <button
  type="submit"
  className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:scale-[1.02] transition"
>
  Submit Donation
</button>


        </form>
      </motion.div>
    </div>
  );
}
