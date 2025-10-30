import React from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { useData } from "../../context/DataContext";

export default function About() {
  const { users } = useData();

  // Set your backend image base URL
  const imageBaseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5500";


  // Identify owner, manager, and employees
  const owner = users.find((u) => u.role === "owner") || {};
  const manager = users.find((u) => u.role === "manager") || {};
  const employees = users.filter(
    (u) => u.role !== "owner" && u.role !== "manager"
  );

  // Helper to get full name
  const fullName = (user) => `${user.first_name || ""} ${user.last_name || ""}`;

  // Helper to get image or fallback
  const getImage = (user, fallback) =>
    user.image_url && user.image_url !== "-"
      ? `${imageBaseUrl}${user.image_url}`
      : fallback;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section: Salon Owner */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">
          About Salehish Beauty Parlour & Spa
        </h1>
        <p className="max-w-2xl mx-auto text-lg">
          Where skill meets passion — founded and led by{" "}
          <span className="font-semibold">{fullName(owner)}</span>, dedicated to
          redefining beauty, confidence, and class.
        </p>
      </header>

      <main className="flex-1 px-6 py-16 max-w-6xl mx-auto space-y-16">
        {/* Owner Section */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="m-5">
            <img
            src={getImage(owner, "/public/images/default_owner.webp")}

            alt={fullName(owner)}
            className=""
          />
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {fullName(owner)}
            </h2>
            <p className="text-blue-600 font-medium mb-4">{owner.role || "Owner"}</p>
            <p className="text-gray-700 leading-relaxed">{owner.bio || ""}</p>
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
        {manager.id && (
          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {fullName(manager)}
              </h2>
              <p className="text-blue-600 font-medium mb-4">{manager.title || "Manager"}</p>
              <p className="text-gray-700 leading-relaxed">{manager.bio || ""}</p>
            </div>
            <img
              src={getImage(manager, "/public/images/default_manager.webp")}
              alt={fullName(manager)}
              className="rounded-2xl shadow-lg w-80 h-auto object-cover order-1 md:order-2"
            />
          </section>
        )}

        {/* Employee Team Section */}
        {employees.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Meet Our Team</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={getImage(emp, "/public/images/default_employee.webp")}
                    alt={fullName(emp)}
                    className="w-full h-auto"
                  />
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {fullName(emp)}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {emp.specialty || ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
