// src/pages/Landing/Contact.jsx
import React from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export default function Contact() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Get in Touch</h1>
        <p className="text-gray-700 mb-8">
          Have questions or want to book an appointment? Reach out to us!
        </p>

        <form className="bg-white shadow-md rounded-xl p-8 text-left space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input type="text" className="w-full border rounded p-2" placeholder="Your name" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input type="email" className="w-full border rounded p-2" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Message</label>
            <textarea className="w-full border rounded p-2" rows="5" placeholder="How can we help?" required></textarea>
          </div>
          <button className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition">
            Send Message
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
