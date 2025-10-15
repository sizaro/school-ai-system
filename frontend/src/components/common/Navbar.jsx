// src/components/common/Navbar.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      // Call the loginUser from context
      const res = await loginUser({ email, password });

      console.log("this is from the backend", res)

      // Update session by calling checkAuth
      await checkAuth();

      setLoginOpen(false);

      // Navigate based on role
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
        <Link to="/" className="text-2xl font-bold text-blue-700">
          Salehish Beauty Salon
        </Link>

        {/* Hamburger for small screens */}
        <button
          className="sm:hidden text-blue-700 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Nav Links */}
        <div className={`${
            menuOpen ? "block" : "hidden"
          } absolute sm:static top-16 left-0 w-full sm:w-auto bg-white sm:flex sm:space-x-6 shadow sm:shadow-none`}
        >
          <Link to="/" className="block px-4 py-2 hover:text-blue-600 font-medium">Home</Link>
          <Link to="/about" className="block px-4 py-2 hover:text-blue-600 font-medium">About</Link>
          <Link to="/services" className="block px-4 py-2 hover:text-blue-600 font-medium">Services</Link>
          <Link to="/contact" className="block px-4 py-2 hover:text-blue-600 font-medium">Contact</Link>

          {!user && (
            <button
              onClick={() => setLoginOpen(true)}
              className="block bg-blue-600 text-white mx-4 my-2 px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}

          {user && (
            <span className="block mx-4 my-2 px-4 py-2 font-medium">
              Hi, {user.firstName}
            </span>
          )}
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
