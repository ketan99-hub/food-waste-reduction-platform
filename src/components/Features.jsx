import { motion } from "framer-motion";

export default function Features() {
 const features = [
  {
    img: "/images/gallery3.jpeg",
    title: "Save Surplus Food",
    desc: "Good food should never go to waste. We help redirect surplus food to those in need.",
  },
  {
    img: "/images/gallery1.jpeg",
    title: "Feed Hungry Families",
    desc: "Your donation helps provide meals to hungry families and children.",
  },
  {
    img: "/images/gallery4.jpeg",
    title: "Community Support",
    desc: "NGOs, volunteers, and donors working together for a better tomorrow.",
  },
];

  return (
<section className="py-20  bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
        
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-4"
        >
          How We Make an Impact
        </motion.h2>

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16">
          Every small effort matters. Together, we can reduce food waste and fight hunger.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 rounded-3xl overflow-hidden shadow-md hover:shadow-xl"
            >
              {/* Image */}
              <div className="h-60 w-full">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/images/gallery1.jpg"; // fallback
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
