import { motion } from "framer-motion";

const features = [
  {
    title: "Smart Matching",
    desc: "Location-based matching between donors and NGOs.",
  },
  {
    title: "Real-Time Tracking",
    desc: "Track food status from donation to delivery.",
  },
  {
    title: "Impact Analytics",
    desc: "Visual insights on food waste reduction.",
  },
];

export default function Features() {
  return (
    <section className="py-20 px-8 bg-white">
      <h3 className="text-4xl font-bold text-center mb-14">
        Why <span className="text-green-600">FoodSave</span>?
      </h3>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {features.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -10 }}
            className="p-8 rounded-2xl shadow-md hover:shadow-xl transition"
          >
            <h4 className="text-xl font-semibold mb-3">
              {item.title}
            </h4>
            <p className="text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
