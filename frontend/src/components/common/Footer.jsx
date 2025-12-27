// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
        
        {/* School Info */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-2">Your School Name</h2>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Your School Name. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Providing quality education and a nurturing environment for students.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-2">Quick Links</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/admissions" className="hover:text-white">Admissions</a></li>
            <li><a href="/academics" className="hover:text-white">Academics</a></li>
            <li><a href="/fees" className="hover:text-white">Fees</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-white font-semibold mb-2">Contact Us</h3>
          <p className="text-gray-400 text-sm">Email: <a href="mailto:info@yourschool.com" className="hover:text-white">info@yourschool.com</a></p>
          <p className="text-gray-400 text-sm">Phone: <a href="tel:+1234567890" className="hover:text-white">+1 234 567 890</a></p>
          <div className="flex space-x-4 mt-3">
            <a 
              href="https://www.facebook.com/YourSchoolPage" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Facebook
            </a>
            <a 
              href="https://www.instagram.com/YourSchoolPage" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Instagram
            </a>
            <a 
              href="https://wa.me/YourPhoneNumber" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              WhatsApp
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}
