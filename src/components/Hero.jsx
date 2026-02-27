import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
  <section
  className="relative h-screen flex items-center justify-center bg-fixed bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1950&q=80')",
  }}
>

      {/* Gradient overlay for readability & emotional impact */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50"></div>

      {/* Content */}
      <div className="relative text-center px-6 max-w-5xl">
        {/* Small callout */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4 font-semibold text-black"
        >
          Every plate counts — Help feed the needy!
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg"
        >
          Reduce Food Waste, <br />
          <span className="text-green-400">Feed the Needy</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-200 max-w-2xl mx-auto mb-10 drop-shadow-md"
        >
          A smart platform connecting food donors, NGOs, and communities to make
          sure surplus food reaches those who need it the most.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col md:flex-row justify-center gap-6"
        >
          <button
            onClick={() => navigate("/donate")}
            className="bg-green-600 text-white px-8 py-4 rounded-xl shadow-lg hover:bg-green-700 hover:scale-105 transition-transform duration-300"
          >
            Donate Food
          </button>

          <button
            onClick={() => navigate("/request-food")}
            className="border border-green-600 text-green-600 px-8 py-4 rounded-xl hover:bg-green-50 hover:scale-105 transition-transform duration-300"
          >
            Request Food
          </button>
        </motion.div>
      </div>
    </section>
  );
}
