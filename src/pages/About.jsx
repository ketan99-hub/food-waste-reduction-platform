import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">

      {/* Hero Section */}
      <section className="about-hero">
        <h1>Food Waste Reduction Platform</h1>
        <p>
          A technology-driven initiative focused on reducing food waste by
          connecting surplus food providers with NGOs, shelters, and communities
          in need.
        </p>
      </section>

      {/* Problem Section */}
      <section className="about-section">
        <h2>The Problem</h2>
        <p>
          Every day, large amounts of edible food are wasted by restaurants,
          hotels, events, and households, while millions of people struggle with
          hunger. The lack of a real-time coordination system leads to food being
          discarded instead of redistributed.
        </p>
      </section>

      {/* Solution Section */}
      <section className="about-section light">
        <h2>Our Solution</h2>
        <p>
          Food Waste Reduction Platform provides a centralized digital system
          where surplus food can be listed, discovered, and redistributed
          efficiently. The platform connects food donors with verified NGOs and
          volunteers to ensure safe and responsible distribution.
        </p>
      </section>

      {/* How It Works */}
      <section className="about-section">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step-card">
            <h3>1. List Surplus Food</h3>
            <p>
              Restaurants, hotels, events, and households upload details of
              surplus food available for donation.
            </p>
          </div>

          <div className="step-card">
            <h3>2. Get Connected</h3>
            <p>
              Nearby NGOs and volunteers receive notifications and accept food
              requests in real time.
            </p>
          </div>

          <div className="step-card">
            <h3>3. Safe Distribution</h3>
            <p>
              Food is collected and delivered responsibly, ensuring hygiene and
              quality standards.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="about-section light">
        <h2>Our Vision</h2>
        <p>
          We envision a sustainable future where food waste is minimized and
          hunger is addressed through collaboration, transparency, and smart
          technology. Our platform aligns with global sustainability goals and
          supports responsible consumption.
        </p>
      </section>

      {/* Future Scope */}
      <section className="about-section">
        <h2>Future Goals</h2>
        <ul className="goals-list">
          <li>Expansion across multiple cities and regions</li>
          <li>Integration with logistics and tracking systems</li>
          <li>Advanced analytics to predict and reduce food waste</li>
          <li>Partnerships with NGOs, governments, and social organizations</li>
        </ul>
      </section>

      {/* Team Section */}
      <section className="about-section light">
        <h2>Our Team</h2>
        <p>
          Food Waste Reduction Platform is developed by a group of passionate
          developers committed to solving real-world problems using modern web
          technologies and social innovation.
        </p>
      </section>

    </div>
  );
};

export default About;
