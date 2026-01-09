import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SidebarFooter from "../common/SidebarFooter";

export default function DirectorSidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `block px-4 py-2 rounded transition-colors ${
      isActive(path) ? "bg-blue-700 font-semibold" : "hover:bg-blue-700"
    }`;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden bg-blue-900 p-4 flex justify-between items-center text-white fixed top-0 left-0 right-0 z-50">
        <span className="font-bold text-lg">Director Panel</span>
        <button
          onClick={() => setMenuOpen(true)}
          className="text-2xl focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex w-64 h-screen bg-blue-900 text-white fixed top-0 left-0 flex-col shadow-lg pt-16">
        <div className="px-6 font-bold text-xl mb-4">Director Panel</div>

        <div className="flex-1 overflow-y-auto px-2">
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                to="/director/dashboard"
                className={linkClass("/director/dashboard")}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/director/overview"
                className={linkClass("/director/overview")}
              >
                School Overview
              </Link>
            </li>
            <li>
              <Link
                to="/director/staff"
                className={linkClass("/director/staff")}
              >
                Staff Management
              </Link>
            </li>
            <li>
              <Link
                to="/director/reports"
                className={linkClass("/director/reports")}
              >
                Reports
              </Link>
            </li>

            <li className="mt-10">
              <SidebarFooter />
            </li>
          </ul>
        </div>
      </aside>

      {/* ================= MOBILE SLIDE MENU ================= */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-screen w-full bg-blue-900 text-white z-50 transform transition-transform duration-300 pt-16 px-4 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 font-bold text-xl">Director Panel</div>
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-xl focus:outline-none"
        >
          ✕
        </button>

        <div className="h-full overflow-y-auto mt-6 mb-10">
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                to="/director/dashboard"
                onClick={() => setMenuOpen(false)}
                className={linkClass("/director/dashboard")}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/director/overview"
                onClick={() => setMenuOpen(false)}
                className={linkClass("/director/overview")}
              >
                School Overview
              </Link>
            </li>
            <li>
              <Link
                to="/director/staff"
                onClick={() => setMenuOpen(false)}
                className={linkClass("/director/staff")}
              >
                Staff Management
              </Link>
            </li>
            <li>
              <Link
                to="/director/reports"
                onClick={() => setMenuOpen(false)}
                className={linkClass("/director/reports")}
              >
                Reports
              </Link>
            </li>

            <li className="mt-10">
              <SidebarFooter />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
