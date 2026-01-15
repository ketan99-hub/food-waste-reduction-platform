import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import DonateFood from "./pages/DonateFood";
import About from "./pages/About";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
         <Route path="/about" element={<About />} />
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
