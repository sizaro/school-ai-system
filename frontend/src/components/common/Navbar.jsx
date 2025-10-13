import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-700">
          Salehish Beauty Salon
        </Link>

        {/* Hamburger Button */}
        <button
          className="sm:hidden text-blue-700 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Nav Links */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } absolute sm:static top-16 left-0 w-full sm:w-auto bg-white sm:flex sm:space-x-6 shadow sm:shadow-none`}
        >
          <Link to="/" className="block px-4 py-2 hover:text-blue-600 font-medium">
            Home
          </Link>
          <Link to="/about" className="block px-4 py-2 hover:text-blue-600 font-medium">
            About
          </Link>
          <Link to="/services" className="block px-4 py-2 hover:text-blue-600 font-medium">
            Services
          </Link>
          <Link to="/contact" className="block px-4 py-2 hover:text-blue-600 font-medium">
            Contact
          </Link>
          <Link
            to="/login"
            className="block bg-blue-600 text-white mx-4 my-2 px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
