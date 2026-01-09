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

  /* ================= CLICK OUTSIDE HANDLER ================= */
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

  /* ================= CLOSE DROPDOWNS WHEN MODALS OPEN ================= */
  useEffect(() => {
    if (loginOpen || registerOpen) {
      setAccountOpen(false);
      setNewsOpen(false);
    }
  }, [loginOpen, registerOpen]);

  /* ================= AUTH HANDLERS ================= */
  
  // -------------------
  // LOGIN
  // -------------------
  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setLoginError(null);
    try {
      const res = await loginUser({ email, password });
      await checkAuth();
      setLoginOpen(false);

      if (res.role === "director") navigate("/director");
      else if (res.role === "headmaster") navigate("/headmaster");
      else if (res.role === "bursar") navigate("/bursar");
      else if (res.role === "student") navigate("/student");
      else navigate("/");
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

  /* ================= DROPDOWN TOGGLES ================= */
  const toggleAccount = (e) => {
    e.stopPropagation();
    setAccountOpen((prev) => !prev);
    setNewsOpen(false);
  };

  const toggleNews = (e) => {
    e.stopPropagation();
    setNewsOpen((prev) => !prev);
    setAccountOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
         <NavLink
    to="/"
    className="flex items-center gap-3"
  >
    {/* SCHOOL LOGO */}
    <img
      src="/logo.png"        // 🔹 put logo in /public/logo.png
      alt="School Logo"
      className="h-10 w-10 object-contain"
    />

    {/* SCHOOL NAME */}
    <span className="md:text-1xl text-lg font-bold text-blue-700 leading-tight">
      Your School Name
    </span>
  </NavLink>

        {/* ================= MOBILE HAMBURGER ================= */}
        <button
          className="sm:hidden text-blue-700 text-2xl"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
        >
          ☰
        </button>

        {/* ================= NAV LINKS ================= */}
        <div
          className={`${menuOpen ? "block" : "hidden"} absolute sm:static top-14 left-0 w-full sm:w-auto bg-white sm:flex sm:space-x-6 shadow sm:shadow-none z-40`}
          onClick={(e) => e.stopPropagation()}
        >
          {[
            ["/", "Home"],
            ["/about", "About"],
            ["/admissions", "Admissions"],
            ["/academics", "Academics"],
            ["/tuition", "school Fees"],
            ["/school-life", "School Life"],
            ["/alumni", "Alumni"],
            ["/contact", "Contact"],
          ].map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `block px-2 py-2 rounded-md font-medium transition border-b-2 ${
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-700 hover:border-blue-500 hover:text-blue-600"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* ================= NEWS & EVENTS DROPDOWN ================= */}
          <div className="relative" ref={newsRef}>
            <button
              onClick={toggleNews}
              className="block px-2 py-2 font-medium text-gray-700 hover:text-blue-600"
            >
              News & Events ▼
            </button>

            {newsOpen && (
              <div className="absolute left-0 mt-1 w-40 bg-white shadow-lg rounded z-50">
                <NavLink to="/news" className="block px-4 py-2 hover:bg-gray-100">
                  News
                </NavLink>
                <NavLink to="/events" className="block px-4 py-2 hover:bg-gray-100">
                  Events
                </NavLink>
              </div>
            )}
          </div>

          {/* ================= ACCOUNT DROPDOWN ================= */}
          <div className="relative w-44 right-0 ml-4" ref={accountRef}>
            <button
              onClick={toggleAccount}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Account
            </button>

            {accountOpen && (
              <div className="absolute left-0 mt-1 w-44 bg-white shadow-lg rounded z-50">
                <button
                  className="block w-44 text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => setLoginOpen(true)}
                >
                  Sign In
                </button>
                <button
                  className="block w-44 text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => setRegisterOpen(true)}
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODALS ================= */}
      <Modal isOpen={loginOpen} onClose={() => setLoginOpen(false)}>
        {authForm === "login" ? (
          <LoginForm
            onSubmit={handleLogin}
            onCancel={() => setLoginOpen(false)}
            loading={loading}
            error={loginError}
            onForgotPassword={handleForgotPassword}
          />
        ) : (
          <ForgotPasswordForm
            onSubmit={handleForgotPasswordSubmit}
            onCancel={handleBackToLogin}
            loading={loading}
          />
        )}
      </Modal>

      <Modal isOpen={registerOpen} onClose={() => setRegisterOpen(false)}>
        <UserForm
          role="student"
          onSubmit={handleRegister}
          onClose={() => setRegisterOpen(false)}
        />
      </Modal>

      {toast.message && (
        <ToastModal
          message={toast.message}
          type={toast.type}
          duration={5000}
          onClose={() => setToast({ message: "", type: toast.type })}
        />
      )}
    </nav>
  );
}
