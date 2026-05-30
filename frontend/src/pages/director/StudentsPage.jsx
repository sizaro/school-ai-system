import { useEffect, useState, useMemo } from "react";
import { useData } from "../../context/DataContext";
import { useNavigate } from "react-router-dom";

export default function StudentsPage() {
  const { students, fetchStudents, deleteStudent } = useData();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [streamFilter, setStreamFilter] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  // ================= NORMALIZER =================
  const normalize = (v) =>
    (v || "")
      .toString()
      .toLowerCase()
      .replace(/\s|\./g, "");

  // ================= ERP SEARCH ENGINE =================
  const filteredStudents = useMemo(() => {
    const q = normalize(search);
    const cls = normalize(classFilter);
    const stream = normalize(streamFilter);

    return students.filter((s) => {
      const searchBlob = normalize(`
        ${s.first_name}
        ${s.last_name}
        ${s.guardian_first_name}
        ${s.guardian_last_name}
        ${s.guardian_phone}
        ${s.class_name}
        ${s.stream}
      `);

      const matchesSearch = searchBlob.includes(q);

      const matchesClass =
        !classFilter || normalize(s.class_name) === cls;

      const matchesStream =
        !streamFilter || normalize(s.stream) === stream;

      return matchesSearch && matchesClass && matchesStream;
    });
  }, [students, search, classFilter, streamFilter]);

  // ================= STATS =================
  const totalStudents = students.length;

  const thisMonth = new Date();

  const studentsThisMonth = students.filter((s) => {
    const d = new Date(s.created_at);
    return (
      d.getMonth() === thisMonth.getMonth() &&
      d.getFullYear() === thisMonth.getFullYear()
    );
  }).length;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Students Management</h1>
        <p className="text-gray-500 text-sm">
          ERP-level student tracking system
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Students</p>
          <p className="text-2xl font-bold text-blue-600">
            {totalStudents}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">New This Month</p>
          <p className="text-2xl font-bold text-green-600">
            {studentsThisMonth}
          </p>
        </div>

      </div>

      {/* SEARCH + FILTERS */}
      <div className="bg-white p-4 rounded shadow flex flex-col md:flex-row gap-3">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search student, guardian, class..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />

        {/* CLASS FILTER (dynamic) */}
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="border p-2 rounded w-full md:w-40"
        >
          <option value="">All Classes</option>
          {[...new Set(students.map(s => s.class_name))]
            .filter(Boolean)
            .map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
        </select>


        {/* CLEAR */}
        <button
          onClick={() => {
            setSearch("");
            setClassFilter("");
            setStreamFilter("");
          }}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Clear
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Photo</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Stream</th>
              <th className="p-3 text-left">Guardian</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredStudents.map((s) => (
              <tr key={s.student_id} className="border-t hover:bg-gray-50">

                {/* PHOTO */}
                <td className="p-3">
                  <img
                    src={s.photo_url || "/images/default-student.png"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>

                {/* NAME */}
                <td className="p-3 font-medium">
                  {s.first_name} {s.last_name}
                </td>

                {/* CLASS */}
                <td className="p-3">
                  {s.class_name || "N/A"}
                </td>

                {/* STREAM */}
                <td className="p-3">
                  {s.stream || "N/A"}
                </td>

                {/* GUARDIAN */}
                <td className="p-3">
                  {s.guardian_first_name} {s.guardian_last_name}
                </td>

                {/* PHONE */}
                <td className="p-3">
                  {s.guardian_phone}
                </td>

                {/* ACTIONS */}
                <td className="p-3 space-x-2">

                  <button
                    className="text-blue-600"
                    onClick={() =>
                      navigate(`/director/students/${s.student_id}`)
                    }
                  >
                    View
                  </button>

                  <button
                    className="text-red-600"
                    onClick={async () => {
                      if (confirm("Delete this student?")) {
                        await deleteStudent(s.student_id);
                      }
                    }}
                  >
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