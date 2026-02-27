import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import RequestCard from "../components/RequestCard";
import DonationCard from "../components/DonationCard";


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
    address: "Bandra",
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
  return (
    <>
      <Navbar />
      <Hero />
       {/* Requests */}
<div className="-mt-20 relative z-10 pt-10 pb-20">
          <div className="grid md:grid-cols-3 gap-6">
        {dummyRequests.map((req) => (
          <RequestCard key={req.id} request={req} />
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4">
        Available Donations
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {dummyDonations.map((don) => (
          <DonationCard key={don.id} donation={don} />
        ))}
      </div>
    </div>
    

<div className="h-40 bg-blue-500"></div>
      <Features />
      <Footer />
    </>
  );
}
