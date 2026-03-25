import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ClaimsForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    people_count: 1,
    urgency: "medium",
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [existingClaim, setExistingClaim] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        navigate("/login");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, mobile")
        .eq("id", sessionData.session.user.id)
        .single();

      if (!profileError && profileData) {
        setUser(profileData);
        setFormData((prev) => ({
          ...prev,
          name: profileData.name || "",
          phone: profileData.mobile || "",
        }));
      }

      // Check if user already has a claim for this donation
      const { data: existingClaimData } = await supabase
        .from("claims")
        .select("id, status")
        .eq("donation_id", id)
        .eq("claimer_id", sessionData.session.user.id)
        .single();

      if (existingClaimData) {
        setExistingClaim(existingClaimData);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "people_count" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        setError("Please login to claim food");
        navigate("/login");
        return;
      }

      // Double-check for existing claim before submit (race condition prevention)
      const { data: latestClaim } = await supabase
        .from("claims")
        .select("id, status")
        .eq("donation_id", id)
        .eq("claimer_id", sessionData.session.user.id)
        .single();

      if (latestClaim) {
        setError(`You already have a ${latestClaim.status} claim for this donation.`);
        setExistingClaim(latestClaim);
        setLoading(false);
        return;
      }

      if (!sessionData.session) {
        setError("Please login to claim food");
        navigate("/login");
        return;
      }

      // Update user profile with name and phone
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name: formData.name,
          mobile: formData.phone,
        })
        .eq("id", sessionData.session.user.id);

      if (profileError) throw profileError;

      // Create claim entry with all fields
      const { data: claimData, error: claimError } = await supabase
        .from("claims")
        .insert([
          {
            donation_id: id,
            claimer_id: sessionData.session.user.id,
            claimer_name: formData.name,
            claimer_phone: formData.phone,
            people_count: formData.people_count,
            urgency: formData.urgency,
            status: "pending",
          },
        ])
        .select();

      if (claimError) throw claimError;

      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Error submitting claim:", err);
      
      // Handle duplicate claim error
      if (err.message && err.message.includes("unique_claim")) {
        setError("You already have a claim for this donation. Check your claims in 'My Claims'.");
        setExistingClaim({ id: "unknown", status: "pending" });
      } else if (err.code === "23505") {
        // PostgreSQL unique constraint violation
        setError("You already have a claim for this donation. Check your claims in 'My Claims'.");
        setExistingClaim({ id: "unknown", status: "pending" });
      } else {
        setError(err.message || "Failed to submit claim. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-28 pb-10">
      <div className="max-w-md mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-green-600 hover:text-green-700 font-semibold"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">🛒 Claim Food</h1>

          {existingClaim && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 font-semibold">ℹ️ Already Claimed</p>
              <p className="text-yellow-600 text-sm mt-1">
                You have a <span className="font-bold">{existingClaim.status}</span> claim for this donation.
              </p>
              <button
                onClick={() => navigate("/my-claims")}
                className="mt-3 text-yellow-700 underline text-sm font-semibold hover:text-yellow-800"
              >
                View your claims →
              </button>
            </div>
          )}

          {success ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Claim Submitted!</h2>
              <p className="text-gray-600 mb-4">Your claim has been sent to the donor for approval.</p>
              <p className="text-sm text-gray-500">Redirecting to home...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              {/* Number of People */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  👥 Number of People *
                </label>
                <input
                  type="number"
                  name="people_count"
                  value={formData.people_count}
                  onChange={handleInputChange}
                  min="1"
                  max="50"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="How many people to feed?"
                />
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🚨 Urgency Level *
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="low">Low - Regular meal</option>
                  <option value="medium">Medium - Needed soon</option>
                  <option value="high">High - Emergency/Urgent</option>
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-semibold">⚠️ {error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || existingClaim}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold text-lg mt-6"
              >
                {existingClaim ? "❌ Already Claimed" : loading ? "Submitting..." : "✅ Submit Claim"}
              </button>

              <p className="text-center text-sm text-gray-600">
                The donor will review your claim and contact you soon.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
