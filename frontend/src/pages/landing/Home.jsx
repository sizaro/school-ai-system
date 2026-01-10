import React from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export default function Home() {
  // Mocked programs data
  const programs = [
    {
      name: "Science & Technology",
      description: "Explore the wonders of science and technology through hands-on experiments and projects.",
      image_url: "/images/program1.jpg",
    },
    {
      name: "Arts & Music",
      description: "Develop creativity and self-expression through visual arts, music, and performing arts programs.",
      image_url: "/images/program2.jpg",
    },
    {
      name: "Sports & Athletics",
      description: "Encouraging teamwork, fitness, and sportsmanship in a variety of athletic activities.",
      image_url: "/images/program3.jpg",
    },
    {
      name: "Leadership & Community",
      description: "Building leadership skills and community awareness through service projects and student initiatives.",
      image_url: "/images/program4.jpg",
    },
    {
      name: "Language & Literature",
      description: "Enhancing reading, writing, and communication skills in a supportive environment.",
      image_url: "/images/program5.jpg",
    },
  ];

  const featuredPrograms = programs.slice(0, 4);

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <header className="relative w-full h-[80vh] overflow-hidden">
  <img
    src="/images/hero1.jpg"
    alt="School Hero"
    className="w-full h-full object-cover brightness-75"
  />

  <div
    className="absolute inset-0 flex items-center relative"
    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
  >
    {/* TEXT CONTAINER */}
    <div className="max-w-2xl ml-8 md:ml-20 px-4 text-bottom text-white absolute bottom-3">

      <h3 className="text-2xl md:text-3xl font-semibold mb-4">
        Excellence in Education & Growth
      </h3>

      <p className="mb-6 text-base md:text-lg">
        Providing quality education and a nurturing environment for students from all walks of life.
      </p>

      <a
        href="/admissions"
        className="inline-block bg-blue-600 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-blue-700 transition"
      >
        Apply Now
      </a>
    </div>
  </div>
</header>


      {/* ================= FEATURED PROGRAMS ================= */}
      <section className="py-16 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Our Featured Programs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPrograms.map((program, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  src={program.image_url || "/images/program_placeholder.jpg"}
                  alt={program.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{program.name}</h3>
                <p className="text-gray-600 text-sm">{program.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SCHOOL FACILITIES ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Our Facilities</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-10 text-center">
            Modern classrooms, science labs, libraries, playgrounds, and extracurricular spaces to provide a well-rounded education.
          </p>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <img
                src="/images/classroom.jpg"
                alt="Classroom"
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold mb-2">Classrooms</h3>
                <p className="text-gray-600 text-sm">
                  Spacious and bright classrooms designed for focused learning and interaction.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <img
                src="/images/library.jpg"
                alt="Library"
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold mb-2">Library & Resources</h3>
                <p className="text-gray-600 text-sm">
                  A rich collection of books, digital resources, and study areas to foster curiosity and research skills.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <img
                src="/images/playground.jpg"
                alt="Playground"
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold mb-2">Playgrounds & Sports</h3>
                <p className="text-gray-600 text-sm">
                  Outdoor and indoor sports areas to promote physical development and team spirit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">What Our Students & Parents Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Alice", feedback: "Excellent teachers and supportive environment.", img: "/images/student1.jpg" },
              { name: "Brian", feedback: "My child loves learning here!", img: "/images/student2.jpg" },
              { name: "Clara", feedback: "Great facilities and extracurricular activities.", img: "/images/student3.jpg" },
            ].map((c, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <p className="text-gray-700 italic mb-3">“{c.feedback}”</p>
                <h4 className="font-semibold text-gray-800">{c.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ADMISSIONS CTA ================= */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our School Today</h2>
        <p className="text-lg mb-6">
          Apply for admissions and become a part of our thriving school community.
        </p>
        <a
          href="/admissions"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-100 transition"
        >
          Apply Now
        </a>
      </section>

      <Footer />
    </div>
  );
}
