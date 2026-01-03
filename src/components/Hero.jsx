import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


export default function Hero() {
  const navigate = useNavigate();
  return (
    
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white pt-24">
      
      <div className="max-w-5xl text-center px-6">
        
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6"
        >
          Reduce Food Waste, <br />
          <span className="text-green-600">Feed the Needy</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 text-lg max-w-2xl mx-auto mb-10"
        >
          A smart digital platform that connects food donors, NGOs and communities 
          to ensure surplus food reaches those who need it the most.
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-6"
        >
        <button
        onClick={() => navigate("/donate")}
         className="bg-green-600 text-white px-8 py-4 rounded-xl shadow-lg hover:bg-green-700"
        >
         Donate Food
        </button>

          <button className="border border-green-600 text-green-600 px-8 py-4 rounded-xl hover:bg-green-50">
            Request Food
          </button>
        </motion.div>

      </div>
    </section>
  );
}
