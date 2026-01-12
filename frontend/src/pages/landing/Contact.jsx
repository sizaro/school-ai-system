import React from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export default function Contact() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <header className="relative w-full h-[50vh] overflow-hidden bg-blue-700">
        <img
          src="/images/contact_hero.jpg"
          alt="Contact School"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">Contact Our School</h1>
          <p className="max-w-xl mb-4 text-lg md:text-xl">
            We’re here to answer your questions and guide you through enrollment, events, or general inquiries.
          </p>
        </div>
      </header>

      <main className="flex-1 py-16 px-6 max-w-4xl mx-auto space-y-12 text-center">

        {/* Contact Methods */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Reach Us Easily</h2>
          <p className="text-gray-700 mb-6">
            For inquiries, admissions, or any school-related information, you can contact us through multiple channels. We respond promptly and are happy to assist you.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 flex-wrap">
            <a
              href="tel:+256700000000"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Call Us
            </a>
            <a
              href="mailto:info@medanfo.ac.ug"
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
            >
              Email
            </a>
            <a
              href="https://wa.me/256700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition"
            >
              WhatsApp
            </a>
            <a
              href="https://facebook.com/MedanfoAfricaCommunitySchool"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-800 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-900 transition"
            >
              Facebook
            </a>
            <a
              href="https://www.linkedin.com/school/medanfo-africa-community-school"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-800 transition"
            >
              LinkedIn
            </a>
            <a
              href="https://www.youtube.com/channel/YourSchoolChannel"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 text-white px-6 py-3 rounded-lg shadow hover:bg-red-700 transition"
            >
              YouTube
            </a>
          </div>
        </section>

        {/* School Location */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Visit Us</h2>
          <p className="text-gray-700">
            Our school campus is open for visits during office hours. Come and meet our staff, explore our classrooms, and see our vibrant learning environment.
          </p>
          <p className="text-gray-700 font-semibold">Address:</p>
          <p className="text-gray-700">123 School Lane, Kampala, Uganda</p>

          {/* Google Map iframe placeholder */}
          <div className="w-full h-80 mt-4">
            <iframe
              title="School Location"
              src="https://www.google.com/maps/embed?pb=!1m18!..." // Replace with real Google Maps embed after claiming place
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <p className="text-gray-700 mt-2">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Medanfo+Africa+Community+School"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Get Directions on Google Maps
            </a>
          </p>
        </section>

        {/* Quick Info */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Quick Info</h2>
          <p className="text-gray-700">Office Hours: Mon – Fri, 8:00 AM – 5:00 PM</p>
          <p className="text-gray-700">Phone: +256 700 000 000</p>
          <p className="text-gray-700">Email: info@medanfo.ac.ug</p>
        </section>

      </main>

      <Footer />
    </div>
  );
}
