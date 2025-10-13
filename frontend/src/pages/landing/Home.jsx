// src/pages/Landing/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-center py-24">
        <h1 className="text-5xl font-bold mb-4">Welcome to Salehish Beauty Salon</h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Redefining beauty and confidence through professional styling,
          creativity, and care — your transformation starts here.
        </p>
        <Link
          to="/services"
          className="bg-white text-blue-700 px-6 py-3 font-semibold rounded-lg shadow hover:bg-gray-100"
        >
          Explore Our Services
        </Link>
      </header>

      {/* Services Preview */}
      <section className="py-16 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Our Popular Services</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Bridal Hair Styling",
              desc: "Elegant, timeless looks for your special day.",
              img: "https://images.unsplash.com/photo-1600180758890-6c95a5473f3f?auto=format&fit=crop&w=800&q=60",
            },
            {
              title: "Makeup & Glam",
              desc: "Flawless makeup that enhances your natural beauty.",
              img: "https://images.unsplash.com/photo-1600180758989-04c4c55f2fa3?auto=format&fit=crop&w=800&q=60",
            },
            {
              title: "Hair Coloring",
              desc: "Vibrant shades & highlights customized for you.",
              img: "https://images.unsplash.com/photo-1599940075373-87e4f7c43b0e?auto=format&fit=crop&w=800&q=60",
            },
            {
              title: "Mobile Salon Services",
              desc: "Professional care right at your doorstep.",
              img: "https://images.unsplash.com/photo-1599940075472-5e5c7b447c6e?auto=format&fit=crop&w=800&q=60",
            },
          ].map((service, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <img src={service.img} alt={service.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/services"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            See More Services
          </Link>
        </div>
      </section>

      {/* About Teaser */}
      <section className="bg-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">About Us</h2>
          <p className="text-gray-600 mb-6">
            At Salehish Beauty Salon, we combine passion, precision, and creativity to bring out your best look.
            Whether it’s a simple trim or a glamorous makeover, our professional team ensures you leave looking
            and feeling amazing.
          </p>
          <Link
            to="/about"
            className="text-blue-700 font-medium hover:underline"
          >
            Learn more about us →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
