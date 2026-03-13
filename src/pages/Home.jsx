import Hero from "../components/Hero";
import Features from "../components/Features";
import RequestCard from "../components/RequestCard";
import DonationCard from "../components/DonationCard";
import { useNavigate } from "react-router-dom";

export default function Home() {

  const dummyRequests = [
    {
      id: 1,
      name: "Ramesh",
      address: "Andheri",
      people_count: 6,
      notes: "Children included",
    },
    {
      id: 2,
      name: "Sita",
      address: "Bhandara",
      people_count: 2,
    },
  ];

  const dummyDonations = [
    {
      id: 1,
      food_type: "Cooked Rice & Dal",
      location: "Dadar",
      quantity: 15,
    },
  ];
  const navigate = useNavigate();

  return (
    <div
      className="bg-fixed bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <Hero />

      <section className="relative z-10 -mt-40 px-6 py-16">
        <div className="max-w-6xl mx-auto">

         

          <h2 className="text-2xl font-bold text-center mb-6 bg-transparent">
            Food Requests
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyRequests.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
          </div>

          <h2 className="text-2xl font-bold text-center mt-14 mb-6 text-white">
            Available Donations
          </h2>
<button
  onClick={() => navigate("/map")}
  className="bg-purple-600 text-white px-4 py-2 rounded-lg"
>
  View Donation Map
</button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyDonations.map((don) => (
              <DonationCard key={don.id} donation={don} />
            ))}
          </div>

          <Features />

        </div>
      </section>
    </div>
  );
}