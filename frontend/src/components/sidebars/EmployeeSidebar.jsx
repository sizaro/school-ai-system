import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SidebarFooter from "../common/SidebarFooter";
import { useData } from "../../context/DataContext";

export default function EmployeeSidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [workersOpen, setWorkersOpen] = useState(false);
  const [lateFeesOpen, setLateFeesOpen] = useState(false);
  const [tagFeesOpen, setTagFeesOpen] = useState(false);

  const { user, loading } = useData();

  const menuRef = useRef();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) =>
    `block px-4 py-2 rounded transition-colors ${
      isActive(path) ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"
    }`;

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Wait for user to load
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading user...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        No user found. Please login.
      </div>
    );
  }

  return (
    <>
      {/* Top Mobile Header */}
      <div className="md:hidden bg-gray-900 p-4 flex justify-between items-center text-white fixed top-0 left-0 right-0 z-50">
        <span className="font-bold text-lg">{user.last_name} Dashboard</span>
        <button onClick={() => setMenuOpen(true)} className="text-2xl focus:outline-none">
          ☰
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen bg-gray-900 text-white fixed top-0 left-0 flex-col shadow-lg pt-16">
        <div className="px-6 font-bold text-xl mb-4">{user.last_name} Dashboard</div>
        <div className="flex-1 overflow-y-auto px-2">
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/employee/dashboard" className={linkClass("/employee/dashboard")}>
                Dashboard
              </Link>
            </li>

            {/* Income */}
            <li>
              <div
                onClick={() => setIncomeOpen(!incomeOpen)}
                className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between"
              >
                <span>Income Reports</span>
                <span>{incomeOpen ? "▾" : "▸"}</span>
              </div>
              {incomeOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li>
                    <Link to="/employee/income/daily" className={linkClass("/employee/income/daily")}>
                      Daily
                    </Link>
                  </li>
                  <li>
                    <Link to="/employee/income/weekly" className={linkClass("/employee/income/weekly")}>
                      Weekly
                    </Link>
                  </li>
                  <li>
                    <Link to="/employee/income/monthly" className={linkClass("/employee/income/monthly")}>
                      Monthly
                    </Link>
                  </li>
                  <li>
                    <Link to="/employee/income/yearly" className={linkClass("/employee/income/yearly")}>
                      Yearly
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Staff Performance */}
            <li>
              <div
                onClick={() => setWorkersOpen(!workersOpen)}
                className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between"
              >
                <span>Work Performance</span>
                <span>{workersOpen ? "▾" : "▸"}</span>
              </div>
              {workersOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li>
                    <Link to="/employee/report/daily" className={linkClass("/employee/report/daily")}>
                      Daily
                    </Link>
                  </li>
                  <li>
                    <Link to="/employee/report/weekly" className={linkClass("/employee/report/weekly")}>
                      Weekly
                    </Link>
                  </li>
                  <li>
                    <Link to="/employee/report/monthly" className={linkClass("/employee/report/monthly")}>
                      Monthly
                    </Link>
                  </li>
                  <li>
                    <Link to="/employee/report/yearly" className={linkClass("/employee/report/yearly")}>
                      Yearly
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Late Fees */}
            <li>
              <div
                onClick={() => setLateFeesOpen(!lateFeesOpen)}
                className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between"
              >
                <span>Late Fees Reports</span>
                <span>{lateFeesOpen ? "▾" : "▸"}</span>
              </div>
              {lateFeesOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li>
                    <Link to="/employee/late-fees/daily" className={linkClass("/employee/late-fees/daily")}>
                      Daily
                    </Link>
                  </li>
                  <li>
                    <Link to="/employee/late-fees/weekly" className={linkClass("/employee/late-fees/weekly")}>
                      Weekly
                    </Link>
                  </li>
                  <li>
                    <Link to="/employee/late-fees/monthly" className={linkClass("/employee/late-fees/monthly")}>
                      Monthly
                    </Link>
                  </li>
                  <li>
                    <Link to="/employee/late-fees/yearly" className={linkClass("/employee/late-fees/yearly")}>
                      Yearly
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Tag Fees */}
            <li className="mb-[120px]">
              <div
                onClick={() => setTagFeesOpen(!tagFeesOpen)}
                className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between"
              >
                <span>Tag Fees Reports</span>
                <span>{tagFeesOpen ? "▾" : "▸"}</span>
              </div>
              {tagFeesOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li>
                    <Link to="/employee/tag-fees/daily" className={linkClass("/employee/tag-fees/daily")}>
                      Daily
                    </Link>
                  </li>
                  <li>
                    <Link to="/employee/tag-fees/weekly" className={linkClass("/employee/tag-fees/weekly")}>
                      Weekly
                    </Link>
                  </li>
                  <li>
                    <Link to="/employee/tag-fees/monthly" className={linkClass("/employee/tag-fees/monthly")}>
                      Monthly
                    </Link>
                  </li>
                  <li>
                    <Link to="/employee/tag-fees/yearly" className={linkClass("/employee/tag-fees/yearly")}>
                      Yearly
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <SidebarFooter />
          </ul>
        </div>
      </aside>

      {/* Mobile Slide-Out Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-screen w-full bg-gray-900 text-white z-50 transform transition-transform duration-300 pt-16 px-4 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 font-bold text-xl mt-0">{user.first_name} Dashboard</div>
        <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-xl focus:outline-none">
          ✕
        </button>

        <div className="h-full overflow-y-auto mt-6 mb-10">
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/employee/dashboard" onClick={() => setMenuOpen(false)} className={linkClass("/employee/dashboard")}>
                Dashboard
              </Link>
            </li>

            {/* Income */}
            <li>
              <div
                onClick={() => setIncomeOpen(!incomeOpen)}
                className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between"
              >
                <span>Income Reports</span>
                <span>{incomeOpen ? "▾" : "▸"}</span>
              </div>
              {incomeOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li>
                    <Link
                      to="/employee/income/daily"
                      onClick={() => setMenuOpen(false)}
                      className={linkClass("/employee/income/daily")}
                    >
                      Daily
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/employee/income/weekly"
                      onClick={() => setMenuOpen(false)}
                      className={linkClass("/employee/income/weekly")}
                    >
                      Weekly
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/employee/income/monthly"
                      onClick={() => setMenuOpen(false)}
                      className={linkClass("/employee/income/monthly")}
                    >
                      Monthly
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/employee/income/yearly"
                      onClick={() => setMenuOpen(false)}
                      className={linkClass("/employee/income/yearly")}
                    >
                      Yearly
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Staff Performance */}
            <li>
              <div
                onClick={() => setWorkersOpen(!workersOpen)}
                className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between"
              >
                <span>Work Performance</span>
                <span>{workersOpen ? "▾" : "▸"}</span>
              </div>
              {workersOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li>
                    <Link
                      to="/employee/report/daily"
                      onClick={() => setMenuOpen(false)}
                      className={linkClass("/employee/report/daily")}
                    >
                      Daily
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/employee/report/weekly"
                      onClick={() => setMenuOpen(false)}
                      className={linkClass("/employee/report/weekly")}
                    >
                      Weekly
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/employee/report/monthly"
                      onClick={() => setMenuOpen(false)}
                      className={linkClass("/employee/report/monthly")}
                    >
                      Monthly
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/employee/report/yearly"
                      onClick={() => setMenuOpen(false)}
                      className={linkClass("/employee/report/yearly")}
                    >
                      Yearly
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Late Fees */}
            <li>
              <div
                onClick={() => setLateFeesOpen(!lateFeesOpen)}
                className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between"
              >
                <span>Late Fees Reports</span>
                <span>{lateFeesOpen ? "▾" : "▸"}</span>
              </div>
              {lateFeesOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li>
                    <Link
                      to="/employee/late-fees/daily"
                      onClick={() => setMenuOpen(false)}
                      className={linkClass("/employee/late-fees/daily")}
                    >
                      Daily
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/employee/late-fees/weekly"
                      onClick={() => setMenuOpen(false)}
                      className={linkClass("/employee/late-fees/weekly")}
                    >
                      Weekly
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/employee/late-fees/monthly"
                      onClick={() => setMenuOpen(false)}
                      className={linkClass("/employee/late-fees/monthly")}
                    >
                      Monthly
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/employee/late-fees/yearly"
                      onClick={() => setMenuOpen(false)}
                      className={linkClass("/employee/late-fees/yearly")}
                    >
                      Yearly
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Tag Fees */}
            <li className="mb-[120px]">
              <div
                onClick={() => setTagFeesOpen(!tagFeesOpen)}
                className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between"
              >
                <span>Tag Fees Reports</span>
                <span>{tagFeesOpen ? "▾" : "▸"}</span>
              </div>
              {tagFeesOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li>
                    <Link
                      to="/employee/tag-fees/daily"
                      onClick={() => setMenuOpen(false)}
                      className={linkClass("/employee/tag-fees/daily")}
                    >
                      Daily
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/employee/tag-fees/weekly"
                      onClick={() => setMenuOpen(false)}
                      className={linkClass("/employee/tag-fees/weekly")}
                    >
                      Weekly
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/employee/tag-fees/monthly"
                      onClick={() => setMenuOpen(false)}
                      className={linkClass("/employee/tag-fees/monthly")}
                    >
                      Monthly
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/employee/tag-fees/yearly"
                      onClick={() => setMenuOpen(false)}
                      className={linkClass("/employee/tag-fees/yearly")}
                    >
                      Yearly
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <SidebarFooter />
          </ul>
        </div>
      </div>
    </>
  );
}
