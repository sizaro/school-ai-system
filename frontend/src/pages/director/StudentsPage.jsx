import { useEffect, useState } from "react";
import { useData } from "../../context/DataContext";

export default function StudentsPage() {

  const { students, fetchStudents } = useData();

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  // 🔥 Filter students
  const filteredStudents = students.filter((student) => {

    const fullName =
      `${student.first_name} ${student.last_name}`.toLowerCase();

    const matchesSearch = fullName.includes(search.toLowerCase());

    const matchesClass =
      classFilter === "" || student.class_level === classFilter;

    return matchesSearch && matchesClass;

  });

  // 🔥 Statistics
  const totalStudents = students.length;

  const today = new Date();

  const studentsThisWeek = students.filter((s) => {
    const created = new Date(s.created_at);
    const diff = (today - created) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  const studentsThisMonth = students.filter((s) => {
    const created = new Date(s.created_at);
    return (
      created.getMonth() === today.getMonth() &&
      created.getFullYear() === today.getFullYear()
    );
  }).length;

  return (
    <div className="space-y-6">

      {/* ================= PAGE HEADER ================= */}

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Students Management
        </h1>

        <p className="text-sm text-gray-500">
          View and manage all registered students
        </p>
      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-2xl font-bold text-blue-600">
            {totalStudents}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Registered This Week</p>
          <p className="text-2xl font-bold text-green-600">
            {studentsThisWeek}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Registered This Month</p>
          <p className="text-2xl font-bold text-purple-600">
            {studentsThisMonth}
          </p>
        </div>

      </div>

      {/* ================= SEARCH + FILTER ================= */}

      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-64"
        />

        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="border p-2 rounded w-full md:w-40"
        >
          <option value="">All Classes</option>
          <option>P.1</option>
          <option>P.2</option>
          <option>P.3</option>
          <option>P.4</option>
          <option>P.5</option>
          <option>P.6</option>
          <option>P.7</option>
          <option>S.1</option>
          <option>S.2</option>
          <option>S.3</option>
          <option>S.4</option>
        </select>

      </div>

      {/* ================= STUDENTS TABLE ================= */}

      <div className="bg-white shadow rounded-lg overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-700">

            <tr>

              <th className="p-3 text-left">Photo</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Guardian</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Admission</th>
              <th className="p-3 text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredStudents.map((student) => (

              <tr
                key={student.student_id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-3">

                  <img
                    src={student.photo_url || "/images/default-student.png"}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                </td>

                <td className="p-3 font-medium">
                  {student.first_name} {student.last_name}
                </td>

                <td className="p-3">
                  {student.class_level}
                </td>

                <td className="p-3">
                  {student.guardian_first_name} {student.guardian_last_name}
                </td>

                <td className="p-3">
                  {student.guardian_phone}
                </td>

                <td className="p-3">
                  {student.admission_date}
                </td>

                <td className="p-3 space-x-2">

                  <button className="text-blue-600 hover:underline">
                    View
                  </button>

                  <button className="text-red-600 hover:underline">
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}