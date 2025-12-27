// src/pages/Landing/Admissions.jsx
import React from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export default function Admissions() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20 text-center">
        <h1 className="md:text-5xl text-2xl font-bold mb-4">Admissions</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Learn about our admission process, requirements, and how to enroll at our school.
        </p>
      </header>

      <main className="flex-1 px-6 py-16 max-w-6xl mx-auto space-y-16">
        {/* Admission Process */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Admission Process</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Our process is simple and transparent. Submit your application, attend an interview or assessment, and confirm enrollment.
          </p>
        </section>

        {/* Fee Structure */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Fee Structure</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Tuition fees vary by grade. We offer affordable options and scholarships. Contact us for detailed fee information.
          </p>
        </section>

        {/* How to Apply */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">How to Apply</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Complete our online application form or visit our admissions office. We respond promptly to all inquiries.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
