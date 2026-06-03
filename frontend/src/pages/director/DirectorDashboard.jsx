import React, { useState, useEffect, useMemo } from "react";
import StudentWizard from "../../components/students/StudentWizard";
import { useData } from "../../context/DataContext";

export default function DirectorDashboard() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const { students, fetchStudents } = useData();

  useEffect(() => {
    fetchStudents();
  }, []);

  // ================= STATS =================
  const stats = useMemo(() => {
    const total = students.length;

    const boys = students.filter(s => s.gender === "Male").length;
    const girls = students.filter(s => s.gender === "Female").length;

    const classes = new Set(
      students.map(s => s.class_name).filter(Boolean)
    ).size;

    return { total, boys, girls, classes };
  }, [students]);

  // ================= RECENT =================
  const recentStudents = students.slice(0, 5);

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Director Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Overview of school operations & student management
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button
          onClick={() => setIsWizardOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
        >
          + Add Student
        </button>

        <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow">
          + Add Staff
        </button>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Students</p>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Boys</p>
          <p className="text-2xl font-bold text-green-600">{stats.boys}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Girls</p>
          <p className="text-2xl font-bold text-pink-600">{stats.girls}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Active Classes</p>
          <p className="text-2xl font-bold text-purple-600">{stats.classes}</p>
        </div>

      </div>

      {/* ================= STUDENT CARDS ================= */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Students</h2>

        <div className="grid md:grid-cols-2 gap-4">

          {recentStudents.map(student => (
            <div
              key={student.student_id}
              className="bg-white shadow rounded-xl p-4 flex gap-4"
            >

              {/* PHOTO */}
              <img
                src={import.meta.env.MODE === "development"
                  ? `http://localhost:5500${student.photo_url}`
                  : `https://medanfoafricacommunityschool.onrender.com${student.photo_url}`}
                alt="student"
                className="w-14 h-14 rounded-full object-cover border"
              />

              {/* INFO */}
              <div className="flex-1">

                <p className="font-semibold text-gray-800">
                  {student.first_name} {student.last_name}
                </p>

                <p className="text-sm text-gray-500">
                  {student.class_name || "No Class"} • {student.stream || "N/A"}
                </p>

                <p className="text-xs text-gray-500">
                  Guardian: {student.guardian_first_name} {student.guardian_last_name}
                </p>

                <p className="text-xs text-gray-400">
                  Blood Group: {student.blood_group || "N/A"}
                </p>

                <p className="text-xs text-gray-400">
                  Registered:{" "}
                  {student.created_at
                    ? new Date(student.created_at).toLocaleDateString()
                    : "N/A"}
                </p>

              </div>
            </div>
          ))}

        </div>
      </div>

      {/* ================= ADMISSIONS TABLE ================= */}
      <div className="bg-white p-5 rounded-xl shadow">

        <h2 className="text-lg font-semibold mb-4">
          Recent Admissions
        </h2>

        <table className="w-full text-sm">

          <thead className="text-left text-gray-500 border-b">
            <tr>
              <th className="py-2">Student</th>
              <th>Class</th>
              <th>Guardian</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {recentStudents.map(s => (
              <tr key={s.student_id} className="border-b last:border-none">

                <td className="py-2 font-medium">
                  {s.first_name} {s.last_name}
                </td>

                <td>{s.class_name || "N/A"}</td>

                <td>
                  {s.guardian_first_name} {s.guardian_last_name}
                </td>

                <td>
                  {s.admission_date
                    ? new Date(s.admission_date).toLocaleDateString()
                    : "N/A"}
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>

      {/* WIZARD */}
      <StudentWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />

    </div>
  );
}