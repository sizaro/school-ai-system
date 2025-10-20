import React from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { useData } from "../../context/DataContext";


export default function About() {

  const {employees} = useData();
  const owner = {
    name: "Saleh Ntege",
    title: "Founder & Owner",
    image:"",
    bio: "Saleh Ntege founded Salehish Beauty Salon in 2020 with a simple but powerful vision — to create a place where confidence, creativity, and care meet. With over a decade in the beauty and grooming industry, Saleh has built a salon known for excellence, precision, and warm customer service.",
  };

  const manager = {
    name: "Nathan",
    title: "Salon Manager & Senior Stylist",
    image:"",
    bio: "Nathan leads the salon team with expertise, mentorship, and professionalism. His hands-on approach ensures each client receives exceptional service. He manages daily operations, supports staff development, and upholds the salon’s values of quality and respect.",
  };


  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section: Salon Owner */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">About Salehish Beauty Parlour & Spa</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Where skill meets passion — founded and led by <span className="font-semibold">{owner.name}</span>,
          dedicated to redefining beauty, confidence, and class.
        </p>
      </header>

      <main className="flex-1 px-6 py-16 max-w-6xl mx-auto space-y-16">
        {/* Owner Section */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <img
            src="/public/images/saleh_ntege.webp"
            alt={owner.name}
            className="rounded-2xl shadow-lg w-full h-96 object-cover"
          />
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{owner.name}</h2>
            <p className="text-blue-600 font-medium mb-4">{owner.title}</p>
            <p className="text-gray-700 leading-relaxed">{owner.bio}</p>
          </div>
        </section>

        {/* About the Salon */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed mb-6">
            Salehish Beauty Salon was established in 2020 as a modern, inclusive, and innovative grooming space.
            Our goal is to blend artistry and professionalism, providing our clients with the highest level of
            satisfaction in every service — from haircuts, nails to skincare. We believe that beauty is not just how you
            look, but how you feel when you leave our salon.
          </p>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Every stylist, aesthetician, and beautician at Salehish Beauty Salon works with dedication to uphold our
            promise — to deliver beauty, comfort, and confidence. Our salon is not just a place for transformation,
            it’s a community of excellence and friendship.
          </p>
        </section>

        {/* Manager Section */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{manager.name}</h2>
            <p className="text-blue-600 font-medium mb-4">{manager.title}</p>
            <p className="text-gray-700 leading-relaxed">{manager.bio}</p>
          </div>
          <img
            src={manager.image}
            alt={manager.name}
            className="rounded-2xl shadow-lg w-full h-96 object-cover order-1 md:order-2"
          />
        </section>

        {/* Employee Team Section */}
        <section>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {employees.map((emp, index) => (
              <div
                key={emp.id}
                className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={``}
                  alt={`${emp.last_name}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {emp.last_name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
