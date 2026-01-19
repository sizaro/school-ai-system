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
  const [moreOpen, setMoreOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [authForm, setAuthForm] = useState("login");
  const [toast, setToast] = useState({ message: "", type: "success" });

  const { loginUser, createUser, checkAuth, forgotPassword } = useData();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
  `block px-2 py-2 rounded-md font-medium transition border-b-2 md:text-sm ${
    isActive
      ? "border-blue-500 text-blue-600"
      : "border-transparent text-gray-700 hover:border-blue-500 hover:text-blue-600"
  }`;


  const accountRef = useRef(null);
  const newsRef = useRef(null);
  const moreRef = useRef(null);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target))
        setAccountOpen(false);
      if (newsRef.current && !newsRef.current.contains(e.target))
        setNewsOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target))
        setMoreOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= AUTH ================= */
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
      else if (res.role === "teacher") navigate("/teacher");
      else navigate("/");
    } catch (err) {
      setLoginError(err?.response?.data?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data) => {
    await createUser(data);
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  const handleForgotPasswordSubmit = async (email) => {
    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);

    if (res.success) {
      setToast({ message: `Reset link sent to ${email}`, type: "success" });
      setTimeout(() => setToast({ message: "", type: "success" }), 5000);
    }
  };

  /* ================= TOGGLES ================= */
  const toggleAccount = (e) => {
    e.stopPropagation();
    setAccountOpen((p) => !p);
    setNewsOpen(false);
    setMoreOpen(false);
  };

  const toggleNews = (e) => {
    e.stopPropagation();
    setNewsOpen((p) => !p);
    setAccountOpen(false);
    setMoreOpen(false);
  };

  const toggleMore = (e) => {
    e.stopPropagation();
    setMoreOpen((p) => !p);
    setAccountOpen(false);
    setNewsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LOGO */}
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src="/images/medanfo_log.png"
            alt="School Logo"
            className="h-20 w-20 object-cover"
          />
          <span className="md:text-sm text-lg font-bold text-blue-700">
            Medanfo Africa Community School
          </span>
        </NavLink>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden text-blue-700 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* NAV LINKS */}
        <div
          className={`${menuOpen ? "block" : "hidden"} absolute md:static top-24 left-0 w-full md:w-auto bg-white md:flex md:items-center md:gap-4 shadow md:shadow-none z-40`}
        >
          {/* ALWAYS VISIBLE */}
          {[
            ["/", "Home"],
            ["/about", "About"],
            ["/admissions", "Admissions"],
            ["/academics", "Academics"],
          ].map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              {label}
            </NavLink>
          ))}

          {/* LG ONLY LINKS */}
          <div className="hidden lg:flex gap-4">
            <NavLink to="/tuition">School Fees</NavLink>
            <NavLink to="/school-life">School Life</NavLink>
            <NavLink to="/alumni">Alumni</NavLink>
            <NavLink to="/contact">Contact</NavLink>

            {/* NEWS */}
            <div className="relative" ref={newsRef}>
              <button onClick={toggleNews}>News & Events ▼</button>
              {newsOpen && (
                <div className="absolute bg-white shadow rounded mt-1">
                  <NavLink to="/news" className="block px-4 py-2">News</NavLink>
                  <NavLink to="/events" className="block px-4 py-2">Events</NavLink>
                </div>
              )}
            </div>
          </div>

          {/* MD ONLY MORE */}
          <div className="hidden md:block lg:hidden relative" ref={moreRef}>
            <button onClick={toggleMore} className="px-3 py-2">
              More ▼
            </button>

            {moreOpen && (
              <div className="absolute bg-white shadow rounded mt-1 w-48">
                <NavLink to="/tuition">School Fees</NavLink>
                <NavLink to="/school-life" className="block px-4 py-2">School Life</NavLink>
                <NavLink to="/alumni" className="block px-4 py-2">Alumni</NavLink>
                <NavLink to="/contact" className="block px-4 py-2">Contact</NavLink>
                <NavLink to="/news" className="block px-4 py-2">News</NavLink>
                <NavLink to="/events" className="block px-4 py-2">Events</NavLink>
              </div>
            )}
          </div>

          {/* ACCOUNT */}
          <div className="relative ml-4" ref={accountRef}>
            <button
              onClick={toggleAccount}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Account
            </button>

            {accountOpen && (
              <div className="absolute bg-white shadow rounded mt-1 w-35">
                <button
                  className="block w-full text-left px-4 py-2"
                  onClick={() => setLoginOpen(true)}
                >
                  Sign In
                </button>
                <button
                  className="block w-full text-left px-4 py-2"
                  onClick={() => setRegisterOpen(true)}
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      <Modal isOpen={loginOpen} onClose={() => setLoginOpen(false)}>
        {authForm === "login" ? (
          <LoginForm
            onSubmit={handleLogin}
            onForgotPassword={() => setAuthForm("forgot")}
            loading={loading}
            error={loginError}
          />
        ) : (
          <ForgotPasswordForm
            onSubmit={handleForgotPasswordSubmit}
            onCancel={() => setAuthForm("login")}
            loading={loading}
          />
        )}
      </Modal>

      <Modal isOpen={registerOpen} onClose={() => setRegisterOpen(false)}>
        <UserForm role="student" onSubmit={handleRegister} />
      </Modal>

      {toast.message && (
        <ToastModal
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: toast.type })}
        />
      )}
    </nav>
  );
}
