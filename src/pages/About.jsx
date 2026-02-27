import React from "react";
import { FaBullseye, FaLightbulb, FaUsers, FaGlobe } from "react-icons/fa";

export default function About() {
  return (
    <div className="pt-28 pb-20 min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100 via-white to-green-200">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-4">
          About Our Platform
        </h1>
        <p className="text-gray-600 text-lg">
          A technology-driven initiative focused on reducing food waste and
          connecting surplus food with communities in need.
        </p>
      </div>

      {/* Cards Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">

        {/* Problem */}
        <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl mb-6 group-hover:bg-green-600 group-hover:text-white transition">
            <FaBullseye />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            The Problem
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Large amounts of edible food are wasted daily while millions
            struggle with hunger. The lack of real-time coordination leads
            to unnecessary food disposal instead of redistribution.
          </p>
        </div>

        {/* Solution */}
        <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl mb-6 group-hover:bg-green-600 group-hover:text-white transition">
            <FaLightbulb />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Our Solution
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our platform provides a centralized digital system where surplus
            food can be listed, discovered, and redistributed efficiently
            through verified NGOs and volunteers.
          </p>
        </div>

        {/* Vision */}
        <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl mb-6 group-hover:bg-green-600 group-hover:text-white transition">
            <FaGlobe />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Our Vision
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            We envision a sustainable future where food waste is minimized
            and hunger is addressed through collaboration, transparency,
            and smart technology.
          </p>
        </div>

        {/* Team */}
        <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl mb-6 group-hover:bg-green-600 group-hover:text-white transition">
            <FaUsers />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Our Team
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Built by passionate developers dedicated to solving real-world
            problems using modern web technologies and social innovation.
          </p>
        </div>

      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Join the Movement 🌱
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Be part of the change. Together we can reduce hunger and
          prevent food waste.
        </p>

        <a
          href="/donate"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition"
        >
          Start Donating
        </a>
      </div>

    </div>
  );
}