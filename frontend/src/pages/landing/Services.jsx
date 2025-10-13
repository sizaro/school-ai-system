// src/pages/Landing/Services.jsx
import React from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

const services = [
  { title: "Bridal Hair Styling", desc: "Elegant hairstyles tailored to your wedding theme.", price: "From 150,000 UGX" },
  { title: "Makeup & Glam", desc: "Natural or bold — our artists bring your vision to life.", price: "From 100,000 UGX" },
  { title: "Hair Coloring", desc: "Premium dyes for long-lasting vibrant shades.", price: "From 120,000 UGX" },
  { title: "Mobile Services", desc: "Beauty services delivered to your location.", price: "Custom pricing" },
  { title: "Spa & Relaxation", desc: "Rejuvenating massages and skin care treatments.", price: "From 80,000 UGX" },
];

export default function Services() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Our Full Service Menu</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div key={i} className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-3">{service.desc}</p>
              <p className="text-gray-800 font-medium">{service.price}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
