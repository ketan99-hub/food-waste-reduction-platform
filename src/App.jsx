import { Routes, Route } from "react-router-dom";
import DonationMap from "./pages/DonationMap";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import MyDonations from "./pages/MyDonations";
import MyRequests from "./pages/MyRequests";
import MyClaims from "./pages/MyClaims";
import Home from "./pages/Home";
import DonateFood from "./pages/DonateFood";
import RequestFood from "./pages/RequestFood";
import RequestDetail from "./pages/RequestDetail";
import DonationDetail from "./pages/DonationDetail";
import ClaimsForm from "./pages/ClaimsForm";
import ClaimDetail from "./pages/ClaimDetail";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Login from "./pages/Login";
import NGODashboard from "./pages/NGODashboard";
import AdminDashboard from "./pages/AdminDashboard";



function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/donate" element={<DonateFood />} />
        <Route path="/request-food" element={<RequestFood />} />
        <Route path="/login" element={<Login />} />
<Route path="/profile" element={<Profile />} />
<Route path="/my-donations" element={<MyDonations />} />
<Route path="/my-requests" element={<MyRequests />} />     
   <Route path="/requests/:id" element={<RequestDetail />} />
        <Route path="/donation/:id" element={<DonationDetail />} />
        <Route path="/claim/:id" element={<ClaimsForm />} />
        <Route path="/my-claims" element={<MyClaims />} />
        <Route path="/claim-detail/:id" element={<ClaimDetail />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;