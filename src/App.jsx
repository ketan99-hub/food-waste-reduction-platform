import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import DonateFood from "./pages/DonateFood";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Features />
            </>
          }
        />
        <Route path="/donate" element={<DonateFood />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
