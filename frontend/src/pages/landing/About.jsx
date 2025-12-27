import React, { useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { useData } from "../../context/DataContext";
import { motion } from "framer-motion";

export default function About() {
  const { users = [], fetchUsers } = useData();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Identify principal, vice principal, and teachers/staff
  const principal = users.find((u) => u.role === "principal") || {};
  const vicePrincipal = users.find((u) => u.role === "vice_principal") || {};
  const staff = users.filter(
    (u) => !["principal", "vice_principal", "student"].includes(u.role)
  );

  const fullName = (user) => `${user.first_name || ""} ${user.last_name || ""}`;
  const getImage = (user, fallback) => (!user?.image_url || user.image_url === "-" ? fallback : user.image_url);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20 text-center">
        <h1 className="md:text-5xl text-2xl font-bold mb-4">
          About Our School
        </h1>
        <p className="max-w-2xl mx-auto text-lg">
          Where education meets excellence — led by{" "}
          <span className="font-semibold">{fullName(principal)}</span>, 
          dedicated to nurturing young minds and building a strong community.
        </p>
      </header>

      <main className="flex-1 px-6 py-16 max-w-6xl mx-auto space-y-16">
        {/* Principal Section */}
        {principal.id && (
          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div className="m-5">
              <img
                src={getImage(principal, "/images/default_principal.jpg")}
                alt={fullName(principal)}
                className="rounded-xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {fullName(principal)}
              </h2>
              <p className="text-blue-600 font-medium mb-4">{principal.title || "Principal"}</p>
              <p className="text-gray-700 leading-relaxed">{principal.bio || ""}</p>
            </div>
          </section>
        )}

        {/* About the School */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed mb-6">
            Established in 2005, our school has grown into a hub of academic excellence
            and holistic development. We nurture every student to achieve their
            full potential in academics, arts, sports, and leadership.
          </p>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Our faculty and staff are dedicated to creating a safe, inclusive, and
            inspiring environment. We believe in preparing students not only for
            exams but for life, instilling values of integrity, curiosity, and
            lifelong learning.
          </p>
        </section>

        {/* Vice Principal Section */}
        {vicePrincipal.id && (
          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {fullName(vicePrincipal)}
              </h2>
              <p className="text-blue-600 font-medium mb-4">{vicePrincipal.title || "Vice Principal"}</p>
              <p className="text-gray-700 leading-relaxed">{vicePrincipal.bio || ""}</p>
            </div>
            <img
              src={getImage(vicePrincipal, "/images/default_vice_principal.jpg")}
              alt={fullName(vicePrincipal)}
              className="rounded-2xl shadow-lg w-80 h-auto object-cover order-1 md:order-2"
            />
          </section>
        )}

        {/* Staff Section */}
        {staff.length > 0 && (
          <motion.section
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="py-12 bg-gray-50"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
              Meet Our Teachers & Staff
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
              {staff.map((emp, index) => {
                const isFirst = index === 0;
                return (
                  <motion.div
                    key={emp.id}
                    initial={isFirst ? { opacity: 1, x: 0 } : { opacity: 0, x: -80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: isFirst ? 0 : index * 0.2 }}
                    whileHover={{ scale: 1.05, y: -8, boxShadow: "0px 10px 25px rgba(0,0,0,0.15),0px 5px 10px rgba(0,0,0,0.1)", transition: { type: "spring", stiffness: 220, damping: 14 } }}
                    className="bg-white shadow-md rounded-xl overflow-hidden transition-transform"
                  >
                    <motion.img
                      src={getImage(emp, "/images/default_teacher.jpg")}
                      alt={fullName(emp)}
                      className="w-full h-auto md:h-[400px] object-cover rounded-t-xl"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                    <motion.div
                      initial={{ opacity: isFirst ? 1 : 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: isFirst ? 0 : 0.1 }}
                      className="p-4 text-center"
                    >
                      <h3 className="text-lg font-semibold text-gray-800">{fullName(emp)}</h3>
                      <p className="text-gray-500 text-sm mt-1">{emp.specialty || ""}</p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}
      </main>

      <Footer />
    </div>
  );
}
