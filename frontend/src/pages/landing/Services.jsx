import React from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

// Service Data
const serviceMap = {
  "7000-service": { title: "Standard Haircut", serviceAmount: 7000, salonAmount: 4000, barberAmount: 2000, barberAssistantAmount: 1000 },
  "6000-service": { title: "Gentlemen's Cut", serviceAmount: 6000, salonAmount: 3000, barberAmount: 2000, barberAssistantAmount: 1000 },
  "5000-service": { title: "Basic Trim", serviceAmount: 5000, salonAmount: 3000, barberAmount: 2000 },
  "child-service": { title: "Children’s Haircut", serviceAmount: 3000, salonAmount: 2000, barberAmount: 1000 },
  "beard-service": { title: "Beard Shaping & Trim", serviceAmount: 3000, salonAmount: 2000, barberAmount: 1000 },
  "haircut-blackmask-12000": { title: "Haircut + Black Mask", serviceAmount: 12000, salonAmount: 4000, barberAmount: 2000, barberAssistantAmount: 1000 },
  "haircut-blackshampoo-12000": { title: "Haircut + Black Shampoo (Premium)", serviceAmount: 12000, salonAmount: 4000, barberAmount: 2000, barberAssistantAmount: 1000 },
  "haircut-blackshampoo-10000": { title: "Haircut + Black Shampoo (Standard)", serviceAmount: 10000, salonAmount: 4000, barberAmount: 2000, barberAssistantAmount: 1000 },
  "haircut-superblack-15000": { title: "Haircut + Super Black", serviceAmount: 15000, salonAmount: 4000, barberAmount: 2000, barberAssistantAmount: 1000 },
  "trimming-scrub-5000": { title: "Trimming + Scrub", serviceAmount: 5000, salonAmount: 3000, barberAmount: 1000, barberAssistantAmount: 1000 },
  "haircut-honey-10000": { title: "Haircut + Honey Treatment", serviceAmount: 10000, salonAmount: 6000, barberAmount: 2000, barberAssistantAmount: 2000 },
  "haircut-women": { title: "Ladies’ Haircut", serviceAmount: 10000, salonAmount: 6000, barberAmount: 4000 },
  "scrub-only-3000": { title: "Facial Scrub (Basic)", serviceAmount: 3000, salonAmount: 2000 },
  "scrub-only-5000": { title: "Facial Scrub (Premium)", serviceAmount: 5000, salonAmount: 4000 },
  "blackshampoo-only-3000": { title: "Black Shampoo (Basic)", serviceAmount: 3000 },
  "blackshampoo-only-5000": { title: "Black Shampoo (Premium)", serviceAmount: 5000 },
  "superblack-only-8000": { title: "Super Black Treatment", serviceAmount: 8000, salonAmount: 6000 },
};

// Convert object into an array
const services = Object.entries(serviceMap).map(([key, value]) => ({
  key,
  title: value.title,
  price: `${value.serviceAmount.toLocaleString()} UGX`,
}));

export default function Services() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Our Full Service Menu
        </h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div
              key={i}
              className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition flex flex-col"
            >
              <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-500">
                {/* Placeholder image container */}
                Image Coming Soon
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-800 font-bold text-lg">{service.price}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
