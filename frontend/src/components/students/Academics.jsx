import { useEffect, useState } from "react";
import SectionCard from "../../components/SectionCard";
import EditAcademicModal from "../../components/students/EditAcademicModal";
import { useData } from "../../context/DataContext";

export default function Academics({ studentId }) {
  const {
    user,
    fetchStudentPerformance,
    createPerformance,
    updatePerformance,
    deletePerformance,
    fetchSubjects,
    fetchClasses,
    fetchTerms,
    fetchGrades,
    classes,
    subjects,
    terms,
    grades,
  } = useData();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeRecord, setActiveRecord] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  // ================= ACADEMIC YEARS =================
  const academicYears = [
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
  ];

  // ================= FILTERS =================
  const [filters, setFilters] = useState({
    class_id: "",
    subject_id: "",
    term_id: "",
    academic_year: "",
    grade_letter: "",
  });

  // ================= LOAD PERFORMANCE =================
  useEffect(() => {
    const load = async () => {
      if (!studentId) return;

      try {
        setLoading(true);

        const data =
          await fetchStudentPerformance(studentId);

        setRecords(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [studentId]);

  // ================= LOAD DROPDOWNS =================
  useEffect(() => {
    fetchSubjects();
    fetchClasses();
    fetchTerms();
    fetchGrades();
  }, []);

  // ================= FILTER LOGIC =================
  const filteredRecords = records.filter((r) => {
    return (
      (!filters.class_id ||
        String(r.class_id) ===
          String(filters.class_id)) &&

      (!filters.subject_id ||
        String(r.subject_id) ===
          String(filters.subject_id)) &&

      (!filters.term_id ||
        String(r.term_id) ===
          String(filters.term_id)) &&

      (!filters.academic_year ||
        String(r.academic_year) ===
          String(filters.academic_year)) &&

      (!filters.grade_letter ||
        String(r.grade_letter) ===
          String(filters.grade_letter))
    );
  });

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await deletePerformance(id);

      setRecords((prev) =>
        prev.filter((r) => r.id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ================= CREATE =================
  const handleCreate = async (data) => {
    try {
      await createPerformance(data);

      const updatedRecords =
        await fetchStudentPerformance(studentId);

      setRecords(updatedRecords || []);

      setOpenForm(false);
    } catch (err) {
      console.error("CREATE ERROR:", err);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async (data) => {
    try {
      await updatePerformance(activeRecord.id, data);

      const updatedRecords =
        await fetchStudentPerformance(studentId);

      setRecords(updatedRecords || []);

      setActiveRecord(null);
    } catch (err) {
      console.error("UPDATE ERROR:", err);
    }
  };

  if (loading)
    return <p>Loading academic records...</p>;

  return (
    <div className="space-y-6">

      {/* ================= FILTERS ================= */}
      <div className="grid md:grid-cols-5 gap-3">

        {/* CLASS */}
        <select
          value={filters.class_id}
          onChange={(e) =>
            setFilters({
              ...filters,
              class_id: e.target.value,
            })
          }
          className="border p-2 rounded"
        >
          <option value="">All Classes</option>

          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* SUBJECT */}
        <select
          value={filters.subject_id}
          onChange={(e) =>
            setFilters({
              ...filters,
              subject_id: e.target.value,
            })
          }
          className="border p-2 rounded"
        >
          <option value="">All Subjects</option>

          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.subject_name}
            </option>
          ))}
        </select>

        {/* TERM */}
        <select
          value={filters.term_id}
          onChange={(e) =>
            setFilters({
              ...filters,
              term_id: e.target.value,
            })
          }
          className="border p-2 rounded"
        >
          <option value="">All Terms</option>

          {terms.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* GRADE */}
        <select
          value={filters.grade_letter}
          onChange={(e) =>
            setFilters({
              ...filters,
              grade_letter: e.target.value,
            })
          }
          className="border p-2 rounded"
        >
          <option value="">All Grades</option>

          {[...new Set(grades.map((g) => g.grade))].map(
            (grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            )
          )}
        </select>

        {/* ACADEMIC YEAR */}
        <select
          value={filters.academic_year}
          onChange={(e) =>
            setFilters({
              ...filters,
              academic_year: e.target.value,
            })
          }
          className="border p-2 rounded"
        >
          <option value="">
            All Academic Years
          </option>

          {academicYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

      </div>

      {/* ================= ADD BUTTON ================= */}
      <button
        onClick={() => setOpenForm(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Add Performance
      </button>

      {/* ================= TABLE ================= */}
      <SectionCard title="Academic Performance">

        {filteredRecords.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full border mt-2">

              <thead>
                <tr className="bg-gray-100">

                  <th className="p-2 border">
                    Subject
                  </th>

                  <th className="p-2 border">
                    Class
                  </th>

                  <th className="p-2 border">
                    Term
                  </th>

                  <th className="p-2 border">
                    Marks
                  </th>

                  <th className="p-2 border">
                    %
                  </th>

                  <th className="p-2 border">
                    Grade
                  </th>

                  <th className="p-2 border">
                    Remarks
                  </th>

                  <th className="p-2 border">
                    Evidence
                  </th>

                  <th className="p-2 border">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredRecords.map((r) => {
                  const percent =
                    (r.marks_obtained /
                      r.marks_total) *
                    100;

                  return (
                    <tr key={r.id}>

                      <td className="border p-2">
                        {r.subject_name}
                      </td>

                      <td className="border p-2">
                        {r.class_name}
                      </td>

                      <td className="border p-2">
                        {r.term_name}
                      </td>

                      <td className="border p-2">
                        {r.marks_obtained}/
                        {r.marks_total}
                      </td>

                      <td className="border p-2">
                        {percent.toFixed(1)}%
                      </td>

                      <td className="border p-2 font-bold">
                        {r.grade_letter || "N/A"}
                      </td>

                      <td className="border p-2">
                        {r.remarks}
                      </td>

                      {/* EVIDENCE */}
                      <td className="border p-2">

                        {r.file_url ? (
                          <a
                            href={`http://localhost:5500/${r.file_url.replace(
                              /\\/g,
                              "/"
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-green-600 underline"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-gray-400">
                            None
                          </span>
                        )}

                      </td>

                      {/* ACTIONS */}
                      <td className="border p-2">

                        <div className="flex flex-wrap gap-2">

                          <button
                            onClick={() =>
                              setActiveRecord(r)
                            }
                            className="text-blue-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(r.id)
                            }
                            className="text-red-600"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </SectionCard>

      {/* ================= CREATE MODAL ================= */}
      {openForm && (
        <EditAcademicModal
          mode="create"
          user={user}
          studentId={studentId}
          classes={classes}
          subjects={subjects}
          terms={terms}
          grades={grades}
          onClose={() => setOpenForm(false)}
          onSubmit={handleCreate}
        />
      )}

      {/* ================= EDIT MODAL ================= */}
      {activeRecord && (
        <EditAcademicModal
          mode="edit"
          user={user}
          record={activeRecord}
          studentId={studentId}
          classes={classes}
          subjects={subjects}
          terms={terms}
          grades={grades}
          onClose={() => setActiveRecord(null)}
          onSubmit={handleUpdate}
        />
      )}

    </div>
  );
}