// src/components/common/Navbar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Modal from "../../components/Modal.jsx";
import LoginForm from "../../components/auth/login.jsx";
import { useData } from "../../context/DataContext.jsx";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const { loginUser, checkAuth, user } = useData();
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setLoginError(null);
    try {
      const res = await loginUser({ email, password });
      console.log("this is from the backend", res);

      await checkAuth();
      setLoginOpen(false);

      if (res.role === "owner") navigate("/owner");
      else if (res.role === "manager") navigate("/manager");
      else if (res.role === "employee") navigate("/employee");
      else if (res.role === "customer") navigate("/customer");
      else navigate("/"); // fallback
    } catch (err) {
      setLoginError(err?.response?.data?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-blue-700">
          Salehish Beauty Parlour & Spa
        </NavLink>

        {/* Hamburger for small screens */}
        <button
          className="sm:hidden text-blue-700 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } absolute sm:static top-16 left-0 w-full sm:w-auto bg-white sm:flex sm:space-x-6 shadow sm:shadow-none`}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-2 py-2 rounded-md font-medium transition ${
                isActive
                  ? "text-blue-700 bg-blue-100 shadow-sm"
                  : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `block px-2 py-2 rounded-md font-medium transition ${
                isActive
                  ? "text-blue-700 bg-blue-100 shadow-sm"
                  : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/services"
            className={({ isActive }) =>
              `block px-2 py-2 rounded-md font-medium transition ${
                isActive
                  ? "text-blue-700 bg-blue-100 shadow-sm"
                  : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            Services
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `block px-2 py-2 rounded-md font-medium transition ${
                isActive
                  ? "text-blue-700 bg-blue-100 shadow-sm"
                  : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            Contact
          </NavLink>

          <button
            onClick={() => setLoginOpen(true)}
            className="block bg-blue-600 text-white mx-4 my-2 px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </div>

      {/* ---- Login Modal ---- */}
      <Modal isOpen={loginOpen} onClose={() => setLoginOpen(false)}>
        <LoginForm
          onSubmit={handleLogin}
          onCancel={() => setLoginOpen(false)}
          loading={loading}
          error={loginError}
        />
      </Modal>
    </nav>
  );
}
