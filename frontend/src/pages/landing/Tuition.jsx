import React from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";


const tuitionData = [
  {
    level: "Nursery",
    tuition: "50000 UGX per Term",
    registration: "5000 UGX",
    notes: "Includes learning materials and basic activities",
  },
  {
    level: "Primary School",
    tuition: "8000 UGX per Term",
    registration: "5000 UGX",
    notes: "Covers textbooks, assessments, and co-curricular activities",
  },
];

export default function Tuition() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Tuition & Fees Structure
        </h1>
        <p className="max-w-2xl mx-auto text-lg">
          Transparent, affordable, and designed to support quality education
          for every learner.
        </p>
      </header>

      {/* ================= TUITION TABLE ================= */}
      <main className="flex-1 px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Academic Fees Overview
        </h2>

        <div className="overflow-x-auto bg-white shadow-md rounded-xl">
          <table className="min-w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Level</th>
                <th className="px-6 py-4 text-left">Tuition (Per Term)</th>
                <th className="px-6 py-4 text-left">Registration</th>
                <th className="px-6 py-4 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {tuitionData.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {item.level}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {item.tuition}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {item.registration}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {item.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= PAYMENT NOTES ================= */}
        <section className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">
            Payment Information
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Fees are payable at the beginning of each term.</li>
            <li>Payment plans may be arranged upon request.</li>
            <li>Fees exclude uniforms, transport, and boarding (if applicable).</li>
            <li>Payments in installations also acceptable</li>
          </ul>
        </section>

        {/* ================= CTA ================= */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Apply?
          </h3>
          <p className="text-gray-600 mb-6">
            Begin your child’s journey with us today.
          </p>
          <a
            href="/admissions"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Go to Admissions
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
