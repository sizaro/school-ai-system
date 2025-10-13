// src/pages/Landing/About.jsx
import React from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export default function About() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 px-6 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">At Salehish Beauty Salon</h1>
        <p className="text-gray-700 mb-4">
          At Salehish Beauty Salon, we believe beauty is more than appearance—it’s confidence, grace, and empowerment.
          Founded in 2020, we have grown into a trusted destination for modern styling, exceptional care, and
          memorable experiences.
        </p>
        <p className="text-gray-700 mb-4">
          Our expert stylists and beauty professionals specialize in a range of services including bridal hair,
          custom makeup, spa treatments, and personalized grooming. Every session is a step toward expressing
          your best self.
        </p>
        <p className="text-gray-700">
          We also offer mobile services and event packages designed for comfort and convenience.
        </p>
      </main>
      <Footer />
    </div>
  );
}
