// src/components/common/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Modal from "../../components/Modal.jsx";
import LoginForm from "../../components/auth/login.jsx";
import UserForm from "../../components/UserForm.jsx";
import { useData } from "../../context/DataContext.jsx";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm.jsx";
import ToastModal from "../../components/ToastModal.jsx";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [authForm, setAuthForm] = useState("login");
  const [toast, setToast] = useState({ message: "", type: "success" });

  const { loginUser, createUser, checkAuth, forgotPassword } = useData();
  const navigate = useNavigate();

  const accountRef = useRef(null);
  const newsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
      if (newsRef.current && !newsRef.current.contains(event.target)) {
        setNewsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns when modals open
  useEffect(() => {
    if (loginOpen || registerOpen) {
      setAccountOpen(false);
      setNewsOpen(false);
    }
  }, [loginOpen, registerOpen]);

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setLoginError(null);
    try {
      const res = await loginUser({ email, password });
      await checkAuth();
      setLoginOpen(false);
      navigate("/dashboard");
    } catch (err) {
      setLoginError(err?.response?.data?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    try {
      await createUser(formData);
      setRegisterOpen(false);
      setLoginOpen(true);
    } catch {
      alert("Account creation failed");
    }
  };

  const handleForgotPasswordSubmit = async (email) => {
    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);
    if (res.success) {
      setToast({ message: `Reset link sent to ${email}`, type: "success" });
      setTimeout(() => {
        setLoginOpen(false);
        setAuthForm("login");
        setToast({ message: "", type: "success" });
      }, 5000);
    } else {
      setToast({ message: res.message || "Something went wrong", type: "error" });
      setTimeout(() => setToast({ message: "", type: "error" }), 5000);
    }
  };

  const handleForgotPassword = () => setAuthForm("forgot");
  const handleBackToLogin = () => setAuthForm("login");

  // Toggle helpers so only one dropdown opens at a time
  const toggleAccount = () => {
    setAccountOpen(!accountOpen);
    if (!accountOpen) setNewsOpen(false);
  };
  const toggleNews = () => {
    setNewsOpen(!newsOpen);
    if (!newsOpen) setAccountOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <NavLink to="/" className="md:text-2xl text-l font-bold text-blue-700">
          Your School Name
        </NavLink>

        {/* Hamburger Mobile */}
        <button className="sm:hidden text-blue-700 text-2xl" onClick={() => setMenuOpen(!menuOpen)}>☰</button>

        {/* Nav Links */}
        <div className={`${menuOpen ? "block" : "hidden"} absolute sm:static top-13 left-0 w-full sm:w-auto bg-white sm:flex sm:space-x-6 shadow sm:shadow-none`}>
          <NavLink to="/" className={({ isActive }) =>
            `block px-2 py-2 rounded-md font-medium transition border-b-2 ${
              isActive ? "border-blue-500" : "border-transparent hover:border-blue-500"
            } text-gray-700 hover:text-blue-600`
          }>Home</NavLink>

          <NavLink to="/about" className={({ isActive }) =>
            `block px-2 py-2 rounded-md font-medium transition border-b-2 ${
              isActive ? "border-blue-500" : "border-transparent hover:border-blue-500"
            } text-gray-700 hover:text-blue-600`
          }>About</NavLink>

          <NavLink to="/admissions" className={({ isActive }) =>
            `block px-2 py-2 rounded-md font-medium transition border-b-2 ${
              isActive ? "border-blue-500" : "border-transparent hover:border-blue-500"
            } text-gray-700 hover:text-blue-600`
          }>Admissions</NavLink>

          <NavLink to="/academics" className={({ isActive }) =>
            `block px-2 py-2 rounded-md font-medium transition border-b-2 ${
              isActive ? "border-blue-500" : "border-transparent hover:border-blue-500"
            } text-gray-700 hover:text-blue-600`
          }>Academics</NavLink>

          <NavLink to="/fees" className={({ isActive }) =>
            `block px-2 py-2 rounded-md font-medium transition border-b-2 ${
              isActive ? "border-blue-500" : "border-transparent hover:border-blue-500"
            } text-gray-700 hover:text-blue-600`
          }>Fees</NavLink>

          {/* News & Events Dropdown */}
          <div className="relative" ref={newsRef}>
            <button
              className="block px-2 py-2 rounded-md font-medium transition text-gray-700 hover:text-blue-600"
              onClick={toggleNews}
            >
              News & Events ▼
            </button>
            {newsOpen && (
              <div className="absolute left-0 w-40 bg-white shadow rounded mt-1 origin-top scale-95 opacity-0 animate-scaleIn">
                <NavLink to="/news" className="block px-4 py-2 hover:bg-gray-100">News</NavLink>
                <NavLink to="/events" className="block px-4 py-2 hover:bg-gray-100">Events</NavLink>
              </div>
            )}
          </div>

          <NavLink to="/gallery" className={({ isActive }) =>
            `block px-2 py-2 rounded-md font-medium transition border-b-2 ${
              isActive ? "border-blue-500" : "border-transparent hover:border-blue-500"
            } text-gray-700 hover:text-blue-600`
          }>Gallery</NavLink>

          <NavLink to="/alumni" className={({ isActive }) =>
            `block px-2 py-2 rounded-md font-medium transition border-b-2 ${
              isActive ? "border-blue-500" : "border-transparent hover:border-blue-500"
            } text-gray-700 hover:text-blue-600`
          }>Alumni</NavLink>

          <NavLink to="/contact" className={({ isActive }) =>
            `block px-2 py-2 rounded-md font-medium transition border-b-2 ${
              isActive ? "border-blue-500" : "border-transparent hover:border-blue-500"
            } text-gray-700 hover:text-blue-600`
          }>Contact</NavLink>

          {/* Account Dropdown */}
          <div className="relative ml-4" ref={accountRef}>
            <button onClick={toggleAccount} className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Account</button>
            {accountOpen && (
              <div className="absolute left-0 w-44 bg-white shadow rounded mt-1 origin-top scale-95 opacity-0 animate-scaleIn">
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => setLoginOpen(true)}>Sign In</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => setRegisterOpen(true)}>Create Account</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={loginOpen} onClose={() => setLoginOpen(false)}>
        {authForm === "login" ? (
          <LoginForm onSubmit={handleLogin} onCancel={() => setLoginOpen(false)} loading={loading} error={loginError} onForgotPassword={handleForgotPassword} />
        ) : (
          <ForgotPasswordForm onSubmit={handleForgotPasswordSubmit} onCancel={handleBackToLogin} loading={loading} message={null} error={null} />
        )}
      </Modal>

      <Modal isOpen={registerOpen} onClose={() => setRegisterOpen(false)}>
        <UserForm role="student" onSubmit={handleRegister} onClose={() => setRegisterOpen(false)} />
      </Modal>

      {toast.message && <ToastModal message={toast.message} type={toast.type} duration={5000} onClose={() => setToast({ message: "", type: toast.type })} />}
    </nav>
  );
}
