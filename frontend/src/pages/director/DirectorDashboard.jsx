import React, { useState } from "react";
import FlexibleUpload from "../../components/forms/FlexibleUpload";
import StudentWizard from "../../components/students/StudentWizard";

export default function DirectorDashboard() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // 🔥 MOCKED STUDENTS (temporary)
  const [students] = useState([
    { id: 1, name: "Amina K.", class: "P.3" },
    { id: 2, name: "Daniel O.", class: "S.1" },
    { id: 3, name: "Grace N.", class: "P.6" },
  ]);

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

      {/* ================= ACTION BUTTONS ================= */}
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

      {/* ================= STUDENT COUNT ================= */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold">Students</h2>
        <p className="text-3xl font-bold text-blue-600 mt-2">
          {students.length}
        </p>
        <p className="text-sm text-gray-500">
          Total registered students
        </p>
      </div>

      {/* ================= RECENT STUDENTS ================= */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4">
          Recent Students
        </h2>

        <ul className="space-y-3 text-sm">
          {students.map((student) => (
            <li
              key={student.id}
              className="flex justify-between border-b pb-2 last:border-none"
            >
              <span>
                <span className="font-medium">{student.name}</span>{" "}
                <span className="text-gray-500">({student.class})</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ================= FILE UPLOAD (KEEP IT) ================= */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4">
          Upload Media (Video / PDF / Word)
        </h2>
        <FlexibleUpload />
      </div>

      {/* ================= STUDENT WIZARD DRAWER ================= */}
      <StudentWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />

    </div>
  );
}