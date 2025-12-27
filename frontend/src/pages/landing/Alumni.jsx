// src/pages/Landing/Alumni.jsx
import React from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export default function Alumni() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20 text-center">
        <h1 className="md:text-5xl text-2xl font-bold mb-4">Alumni</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Celebrate the achievements of our former students and connect with our alumni community.
        </p>
      </header>

      <main className="flex-1 px-6 py-16 max-w-6xl mx-auto space-y-16">
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Success Stories</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Meet our accomplished alumni and learn how our school shaped their journey.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
