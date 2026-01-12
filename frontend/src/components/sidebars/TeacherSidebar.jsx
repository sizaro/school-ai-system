import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SidebarFooter from "../common/SidebarFooter";

export default function TeacherSidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `block px-4 py-2 rounded transition-colors font-medium ${
      isActive(path)
        ? "bg-purple-700 text-white"
        : "hover:bg-purple-700 hover:text-white"
    }`;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden bg-purple-900 p-4 flex justify-between items-center text-white fixed top-0 left-0 right-0 z-50">
        <div>
          <div className="font-bold text-lg">Teacher Panel</div>
          <div className="text-xs text-purple-200">My School</div>
        </div>

        <button
          onClick={() => setMenuOpen(true)}
          className="text-2xl focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex w-64 h-screen bg-purple-900 text-white fixed top-0 left-0 flex-col shadow-lg pt-16">
        {/* Header */}
        <div className="px-6 mb-4">
          <h2 className="text-xl font-bold">Teacher Panel</h2>
          <p className="text-sm text-purple-200">My School</p>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-2">
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                to="/teacher/dashboard"
                className={linkClass("/teacher/dashboard")}
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/teacher/classes"
                className={linkClass("/teacher/classes")}
              >
                My Classes
              </Link>
            </li>

            <li>
              <Link
                to="/teacher/results"
                className={linkClass("/teacher/results")}
              >
                Results
              </Link>
            </li>

            <li className="mt-10">
              <SidebarFooter />
            </li>
          </ul>
        </div>
      </aside>

      {/* ================= MOBILE SLIDE-OUT MENU ================= */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-screen w-full bg-purple-900 text-white z-50 transform transition-transform duration-300 pt-16 px-4 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6">
          <h2 className="text-xl font-bold">Teacher Panel</h2>
          <p className="text-sm text-purple-200">My School</p>
        </div>

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
                to="/teacher/dashboard"
                onClick={() => setMenuOpen(false)}
                className={linkClass("/teacher/dashboard")}
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/teacher/classes"
                onClick={() => setMenuOpen(false)}
                className={linkClass("/teacher/classes")}
              >
                My Classes
              </Link>
            </li>

            <li>
              <Link
                to="/teacher/results"
                onClick={() => setMenuOpen(false)}
                className={linkClass("/teacher/results")}
              >
                Results
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
