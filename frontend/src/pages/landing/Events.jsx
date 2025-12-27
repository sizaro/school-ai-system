// src/pages/Landing/Events.jsx
import React from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export default function Events() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20 text-center">
        <h1 className="md:text-5xl text-2xl font-bold mb-4">Events</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Stay updated on upcoming school events, activities, and programs.
        </p>
      </header>

      <main className="flex-1 px-6 py-16 max-w-6xl mx-auto space-y-16">
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Upcoming Events</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Explore our calendar of upcoming events, including sports, cultural activities, and school programs.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
