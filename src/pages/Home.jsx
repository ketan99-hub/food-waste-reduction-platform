import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import RequestCard from "../components/RequestCard";
import DonationCard from "../components/DonationCard";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [addresses, setAddresses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalView, setModalView] = useState(null); // 'requests' or 'donations' or null

  const navigate = useNavigate();

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("food_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching requests:", error);
      setError("Unable to load requests");
    } else {
      setRequests(data || []);
    }
  };

  const fetchDonations = async () => {
    const { data, error } = await supabase
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
          image_url
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching donations:", error);
      setError("Unable to load donations");
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
      console.error("Error fetching addresses:", error);
      setError("Unable to load addresses");
    } else {
      const addressMap = {};
      (data || []).forEach((addr) => {
        addressMap[addr.id] = addr;
      });
      setAddresses(addressMap);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchRequests(), fetchDonations(), fetchAddresses()]);
      setLoading(false);
    })();
  }, []);
const handleClaimDonation = async (donationId) => {
  try {
    const { data, error } = await supabase
      .from("claims")
      .insert([
        {
          donation_id: donationId,
          claimer_id: "USER_ID_HERE", // replace with logged-in user
        },
      ]);

    if (error) throw error;

    alert("✅ Donation claimed successfully!");
  } catch (err) {
    console.error(err);
    alert("❌ Failed to claim donation");
  }
};
  useEffect(() => {
    const requestChannel = supabase
      .channel("food_requests_home")
      .on("postgres_changes", { event: "*", schema: "public", table: "food_requests" }, () => {
        fetchRequests();
      })
      .subscribe();

    const donationChannel = supabase
      .channel("donations_home")
      .on("postgres_changes", { event: "*", schema: "public", table: "donations" }, () => {
        fetchDonations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(requestChannel);
      supabase.removeChannel(donationChannel);
    };
  }, []);

  const isBlurred = Boolean(modalView);

  return (
    <div
      className="bg-fixed bg-cover bg-center min-h-screen"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <Hero />

      <section className="relative z-10 -mt-40 px-6 py-16">
        <div className={`max-w-4xl mx-auto ${isBlurred ? "filter blur-sm" : ""}`}>

          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Live Food Requests</h2>

              {loading ? (
                <p className="text-white">Loading requests and donations...</p>
              ) : error ? (
                <p className="text-red-200">{error}</p>
              ) : requests.length === 0 ? (
                <p className="text-white">No requests found yet. Please add one.</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    {requests.slice(0, 2).map((request) => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>

                  {requests.length > 2 && (
                    <button
                      onClick={() => setModalView("requests")}
                      className="w-full mt-4 bg-white text-green-700 border border-green-600 py-2 rounded-lg font-semibold hover:bg-green-50"
                    >
                      View All Requests
                    </button>
                  )}
                </>
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Available Donations</h2>

              {loading ? (
                <p className="text-white">Collecting donations ...</p>
              ) : donations.length === 0 ? (
                <p className="text-white">No donations are available yet.</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {donations.slice(0, 2).map((donation) => {
                      const item = donation.donation_items?.[0] || {};
                      const location = addresses[donation.address_id]?.city || "Unknown";
                      return (
                        <DonationCard
                          key={donation.id}
                          donation={{
                            id: donation.id,
                            food_type: item.food_name,
                            location,
                            quantity: item.quantity || "N/A",
                            status: donation.status,
                          }}
                          onClaim={handleClaimDonation}
                        />
                      );
                    })}
                  </div>

                  {donations.length > 2 && (
                    <button
                      onClick={() => setModalView("donations")}
                      className="w-full mt-4 bg-white text-purple-700 border border-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-50"
                    >
                      View All Donations
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {modalView && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-200 relative">
                <button
                  onClick={() => setModalView(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
                >
                  ✕ Close
                </button>

                <h3 className="text-2xl font-bold mb-4">
                  {modalView === "requests" ? "All Requests" : "All Donations"}
                </h3>

                <div className="space-y-4">
                  {modalView === "requests" ? (
                    requests.length === 0 ? (
                      <p>No requests available.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {requests.map((request) => (
                          <RequestCard key={request.id} request={request} />
                        ))}
                      </div>
                    )
                  ) : donations.length === 0 ? (
                    <p>No donations available.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {donations.map((donation) => {
                        const item = donation.donation_items?.[0] || {};
                        const location = addresses[donation.address_id]?.city || "Unknown";
                        return (
                          <DonationCard
                            key={donation.id}
                            donation={{
                              id: donation.id,
                              food_type: item.food_name,
                              location,
                              quantity: item.quantity || "N/A",
                              status: donation.status,
                            }}
                            onClaim={handleClaimDonation}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}