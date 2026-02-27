import { FaUtensils, FaTruck, FaHandsHelping, FaChartLine } from "react-icons/fa";

export default function HowItWorks() {
  const steps = [
    {
      icon: <FaUtensils />,
      title: "Food Listing",
      description:
        "Restaurants, hotels, and individuals list surplus food on our platform instead of wasting it.",
    },
    {
      icon: <FaTruck />,
      title: "Smart Pickup",
      description:
        "Nearby NGOs and volunteers receive notifications and schedule food pickup instantly.",
    },
    {
      icon: <FaHandsHelping />,
      title: "Safe Distribution",
      description:
        "Collected food is quality-checked and distributed to people in need with dignity.",
    },
    {
      icon: <FaChartLine />,
      title: "Impact Tracking",
      description:
        "Track how much food is saved and how many lives are impacted through real-time data.",
    },
  ];

  return (
<div className="pt-28 pb-20 min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100 via-white to-green-200">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-4">
          How It Works
        </h1>
        <p className="text-gray-600 text-lg">
          A simple, transparent process to reduce food waste and feed communities.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl mb-6 group-hover:bg-green-600 group-hover:text-white transition">
              {step.icon}
            </div>


            <h3 className="text-xl font-semibold text-gray-800 mb-3">
  {step.title}
</h3>


            <p className="text-gray-600 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Be a Part of the Change 🌱
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Whether you are a food donor, volunteer, or organization — together we
          can reduce hunger and food waste.
        </p>

        <a
          href="/donate"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition"
        >
          Donate Food Now
        </a>
      </div>
    </div>
  );
}

