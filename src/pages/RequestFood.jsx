import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function RequestFood() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    people: "",
    notes: "",
  });

  // SEND OTP
  const sendOtp = async () => {
  if (!phone) {
    alert("Enter mobile number");
    return;
  }

  // TEMPORARY SKIP SMS
  setStep("otp");
};


  // VERIFY OTP
  const verifyOtp = async () => {
  // TEMPORARY SKIP
  if (!otp) {
    alert("Enter any OTP to continue");
    return;
  }

  // Directly move to form step
  setStep("form");
};


  // SUBMIT REQUEST
 const submitRequest = async () => {
  if (!phone || !form.name || !form.address || !form.people) {
    alert("Please fill all required fields");
    return;
  }

  setLoading(true);

  const { data, error } = await supabase
    .from("food_requests")
    .insert([
      {
        phone: phone,
        name: form.name,
        address: form.address,
        people_count: Number(form.people),
        notes: form.notes,
      },
    ]);

  setLoading(false);

  if (error) {
    console.log("Insert Error:", error);
    alert("Failed to submit ❌");
  } else {
    console.log("Inserted Data:", data);
    alert("Request Submitted Successfully ✅");

    // Reset form
    setStep("phone");
    setPhone("");
    setOtp("");
    setForm({
      name: "",
      address: "",
      people: "",
      notes: "",
    });
  }
};


  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4 py-10">
      
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-800">
            Need Food Support?
          </h2>
          <p className="text-gray-500 text-sm">
            We are here to help you 💚
          </p>
        </div>

        {/* STEP 1 - PHONE */}
        {step === "phone" && (
          <div className="space-y-4">
            <input
              type="tel"
              placeholder="Enter Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 - OTP */}
        {step === "otp" && (
          <div className="space-y-4">
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {/* STEP 3 - FORM */}
        {step === "form" && (
          <div className="space-y-4">
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              placeholder="Full Address"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              type="number"
              placeholder="Number of People"
              value={form.people}
              onChange={(e) =>
                setForm({ ...form, people: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />

            <textarea
              placeholder="Additional Notes (Optional)"
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />

            <button
              onClick={submitRequest}
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-semibold transition"
            >
              {loading ? "Submitting..." : "Request Support"}
            </button>
          </div>
        )}

        {/* Trust Info */}
        <div className="text-center text-xs text-gray-500 pt-4 border-t">
          🔐 Your information is safe & secure <br />
          🤝 Community powered initiative
        </div>

      </div>
    </section>
  );
}
