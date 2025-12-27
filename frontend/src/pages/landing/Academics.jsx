// src/pages/Landing/Academics.jsx
import React from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export default function Academics() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20 text-center">
        <h1 className="md:text-5xl text-2xl font-bold mb-4">Academics</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Explore our curriculum, programs, and educational approach.
        </p>
      </header>

      <main className="flex-1 px-6 py-16 max-w-6xl mx-auto space-y-16">
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Curriculum</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We offer a holistic curriculum with a focus on academics, arts, sports, and life skills.
          </p>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Special Programs</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            STEM, arts, leadership, and sports programs to enhance students' learning and personal growth.
          </p>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Teachers</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Our educators are skilled, experienced, and committed to student success.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
