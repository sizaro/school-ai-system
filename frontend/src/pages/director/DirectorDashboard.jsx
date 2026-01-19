// src/pages/director/DirectorDashboard.jsx
import React from "react";

const stats = [
  {
    title: "Total Students",
    value: 428,
    note: "Across all classes",
    color: "bg-blue-600",
  },
  {
    title: "Teaching Staff",
    value: 32,
    note: "Active teachers",
    color: "bg-green-600",
  },
  {
    title: "Non-Teaching Staff",
    value: 14,
    note: "Administration & support",
    color: "bg-purple-600",
  },
  {
    title: "Monthly Fee Collection",
    value: "UGX 48,500,000",
    note: "This month",
    color: "bg-emerald-600",
  },
  {
    title: "Outstanding Fees",
    value: "UGX 12,300,000",
    note: "Pending payments",
    color: "bg-red-600",
  },
  {
    title: "Active Classes",
    value: 18,
    note: "Primary & Secondary",
    color: "bg-indigo-600",
  },
];

const recentAdmissions = [
  { name: "Amina K.", class: "P.3", date: "12 Jan 2026" },
  { name: "Daniel O.", class: "S.1", date: "11 Jan 2026" },
  { name: "Grace N.", class: "P.6", date: "10 Jan 2026" },
];

const systemAlerts = [
  { message: "3 students overdue on fee payments", level: "warning" },
  { message: "End-of-term reports due in 5 days", level: "info" },
];

export default function DirectorDashboard() {
  return (
    <div className="p-6 space-y-8">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Director Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Overview of school performance & operations
        </p>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`rounded-xl p-5 text-white shadow ${item.color}`}
          >
            <div className="text-sm opacity-90">{item.title}</div>
            <div className="text-2xl font-bold mt-2">{item.value}</div>
            <div className="text-xs opacity-80 mt-1">{item.note}</div>
          </div>
        ))}
      </div>

      {/* ================= LOWER SECTIONS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Admissions */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">
            Recent Admissions
          </h2>
          <ul className="space-y-3 text-sm">
            {recentAdmissions.map((student, index) => (
              <li
                key={index}
                className="flex justify-between border-b pb-2 last:border-none"
              >
                <span>
                  <span className="font-medium">{student.name}</span>{" "}
                  <span className="text-gray-500">({student.class})</span>
                </span>
                <span className="text-gray-400">{student.date}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">
            Alerts & Reminders
          </h2>
          <ul className="space-y-3 text-sm">
            {systemAlerts.map((alert, index) => (
              <li
                key={index}
                className={`p-3 rounded ${
                  alert.level === "warning"
                    ? "bg-red-50 text-red-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {alert.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
