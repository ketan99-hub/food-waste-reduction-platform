import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function RequestFood() {

  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    people: "",
    foodType: "Any",
    urgency: "Normal",
    notes: "",
    latitude: null,
    longitude: null
  });

  // 📍 Get Current Location
const getLocation = () => {

  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {

      setForm((prev) => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }));

      console.log("Location:", position.coords.latitude, position.coords.longitude);

    },
    (error) => {
      console.log(error);
      alert("Location permission denied or unavailable");
    }
  );
};

  const sendOtp = () => {
    if (!phone) {
      alert("Enter mobile number");
      return;
    }
    setStep("otp");
  };

  const verifyOtp = () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }
    setStep("form");
  };

  const submitRequest = async (e) => {
    e.preventDefault();

if (!form.name || !form.address || !form.people || !form.latitude) {
        alert("Please fill all required fields");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("Please login to submit a request");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("food_requests")
      .insert([
        {
          phone,
          name: form.name,
          address: form.address,
          people_count: Number(form.people),
          food_type: form.foodType,
          urgency: form.urgency,
          notes: form.notes,
          latitude: form.latitude,
          longitude: form.longitude,
          user_id: user.id
        }
      ]);

    setLoading(false);

    if (error) {
      alert("Submission failed ❌");
      console.log(error);
    } else {
      alert("Request submitted successfully ✅");

      setStep("phone");
      setPhone("");
      setOtp("");

      setForm({
        name: "",
        address: "",
        people: "",
        foodType: "Any",
        urgency: "Normal",
        notes: "",
        latitude: null,
        longitude: null
      });
    }
  };

  // ================= UI =================

 

console.log("RequestFood component loaded");
  return (

    
    <section className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-green-200 py-16 px-4">
<h1 style={{color:"red"}}>REQUEST PAGE WORKING</h1>
      {/* HERO SECTION */}

      <div className="max-w-4xl mx-auto text-center mb-14">

        <h1 className="text-5xl font-bold text-green-700">
          Need Food Assistance?
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          We connect people in need with nearby NGOs and volunteers who
          can provide food support.
        </p>

      </div>


      {/* EMERGENCY BANNER */}

      <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center mb-12">
        ⚠️ If your situation is urgent, please select <b>Urgent</b> in the form so volunteers can prioritize your request.
      </div>


      {/* HOW IT WORKS */}

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-14">

        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h3 className="text-xl font-semibold">1️⃣ Submit Request</h3>
<p className="text-center text-gray-500 mb-4">Current Step: {step}
              Enter your details and request food support.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h3 className="text-xl font-semibold">2️⃣ NGO Review</h3>
<p className="text-center text-gray-500 mb-4">Current Step: {step}
            Nearby NGOs and volunteers receive your request.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h3 className="text-xl font-semibold">3️⃣ Get Support</h3>
<p className="text-center text-gray-500 mb-4">Current Step: {step}
              Volunteers will arrange food if available.
          </p>
        </div>

      </div>


      {/* REQUEST CARD */}

      <div className="max-w-md mx-auto backdrop-blur-md bg-white/80 border border-white/40 shadow-2xl rounded-3xl p-8">

        {/* STEP INDICATOR */}

        <div className="flex justify-between text-sm mb-6">

          <span className={step === "phone" ? "font-bold text-green-600" : ""}>
            Phone
          </span>

          <span className={step === "otp" ? "font-bold text-green-600" : ""}>
            OTP
          </span>

          <span className={step === "form" ? "font-bold text-green-600" : ""}>
            Details
          </span>

        </div>


        {/* PHONE STEP */}

        {step === "phone" && (

          <div className="space-y-4">

            <input
              type="tel"
              placeholder="Enter Mobile Number"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500"
            />

            <button
              onClick={sendOtp}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition shadow"
            >
              Send OTP
            </button>

          </div>

        )}


        {/* OTP STEP */}

        {step === "otp" && (

          <div className="space-y-4">

            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e)=>setOtp(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500"
            />

            <button
              onClick={verifyOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Verify OTP
            </button>

          </div>

        )}


        {/* FORM STEP */}

        {step === "form" && (
          
          <form onSubmit={submitRequest} className="space-y-4">

            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e)=>setForm({...form,name:e.target.value})}
              className="w-full p-3 border rounded-xl"
            />

            <input
              placeholder="Full Address"
              value={form.address}
              onChange={(e)=>setForm({...form,address:e.target.value})}
              className="w-full p-3 border rounded-xl"
            />
              <button
              type="button"
              onClick={getLocation}
              className="bg-green-500 text-white px-3 py-2 rounded"
              >
              Use Current Location
            </button>
        {form.latitude && form.longitude && (
<p className="text-sm text-green-700 mt-2">
📍 Location detected: {form.latitude.toFixed(5)}, {form.longitude.toFixed(5)}
</p>
)}

            <input
              type="number"
              placeholder="Number of People"
              value={form.people}
              onChange={(e)=>setForm({...form,people:e.target.value})}
              className="w-full p-3 border rounded-xl"
            />

            <select
              value={form.foodType}
              onChange={(e)=>setForm({...form,foodType:e.target.value})}
              className="w-full p-3 border rounded-xl"
            >
              <option>Any</option>
              <option>Veg</option>
              <option>Non-Veg</option>
            </select>

            <select
              value={form.urgency}
              onChange={(e)=>setForm({...form,urgency:e.target.value})}
              className="w-full p-3 border rounded-xl"
            >
              <option>Normal</option>
              <option>Urgent</option>
            </select>

            <textarea
              placeholder="Additional Notes"
              value={form.notes}
              onChange={(e)=>setForm({...form,notes:e.target.value})}
              className="w-full p-3 border rounded-xl"
            />

            <button
              type="submit"
              disabled={loading}
className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300">
            
              {loading ? "Submitting..." : "Submit Request"}
            </button>
            {step !== "phone" && step !== "otp" && step !== "form" && (
  <p className="text-center text-red-500">
    Unknown step: {step}
  </p>
)}

          </form>

        )}

        {/* TRUST */}

        <div className="text-center text-xs text-gray-500 mt-6 border-t pt-4">
          🔐 Your information is secure <br/>
          🤝 Powered by local NGOs and volunteers
        </div>

      </div>

    </section>
  );
}
