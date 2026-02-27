import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import DonateFood from "./pages/DonateFood";
import RequestFood from "./pages/RequestFood";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<HowItWorks />} />
        <Route path="/donate" element={<DonateFood />} />
        <Route path="/request-food" element={<RequestFood />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;