
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function MyDonations() {

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {

    setLoading(true);

    // current user
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    // fetch donations
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .eq("donor_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setDonations(data);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="pt-28 text-center">
        <p>Loading donations...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-6">

        <h1 className="text-3xl font-bold text-green-700 mb-6">
          My Donations
        </h1>

        {donations.length === 0 ? (

          <p className="text-gray-500">
            You haven't donated food yet.
          </p>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {donations.map((donation) => (

              <div
                key={donation.id}
                className="bg-white shadow-md rounded-xl p-5 border"
              >

                <h2 className="text-xl font-semibold text-green-700">
                  🍛 {donation.food_type}
                </h2>

                <p className="text-gray-600 mt-2">
                  📍 {donation.location}
                </p>

                <p className="text-gray-600">
                  📦 {donation.quantity} meals
                </p>

                <p className="text-gray-600">
                  ⏰ {donation.pickup_time}
                </p>

                <div className="mt-3 text-sm text-gray-500">
                  Status: {donation.status}
                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}