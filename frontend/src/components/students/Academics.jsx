import { useEffect, useState } from "react";
import SectionCard from "../../components/SectionCard";
import EditAcademicModal from "../../components/students/EditAcademicModal";
import { useData } from "../../context/DataContext";

export default function Academics({ studentId }) {
  const {
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

  console.log("classes:", classes);
console.log("subjects:", subjects);
console.log("terms:", terms);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeRecord, setActiveRecord] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  // ================= FILTERS =================
  const [filters, setFilters] = useState({
    class_id: "",
    subject_id: "",
    term_id: "",
    academic_year: "",
  });

  // ================= LOAD =================
  useEffect(() => {
    const load = async () => {
      if (!studentId) return;

      try {
        setLoading(true);
        const data = await fetchStudentPerformance(studentId);
        setRecords(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [studentId]);

  useEffect(()=>{
    fetchSubjects()
    fetchClasses()
    fetchTerms()
    fetchGrades()
  }, [])

  // ================= FILTER LOGIC =================
  const filteredRecords = records.filter((r) => {
    return (
      (!filters.class_id || String(r.class_id) === String(filters.class_id)) &&
      (!filters.subject_id || String(r.subject_id) === String(filters.subject_id)) &&
      (!filters.term_id || String(r.term_id) === String(filters.term_id)) &&
      (!filters.academic_year || String(r.academic_year) === String(filters.academic_year))
    );
  });

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await deletePerformance(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= CREATE =================
  const handleCreate = async (data) => {
    try {
      const newRecord = await createPerformance({
        ...data,
        student_id: studentId,
      });

      setRecords((prev) => [newRecord, ...prev]);
      setOpenForm(false);
    } catch (err) {
      console.error("CREATE ERROR:", err);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async (data) => {
    try {
      const updated = await updatePerformance(activeRecord.id, data);

      setRecords((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );

      setActiveRecord(null);
    } catch (err) {
      console.error("UPDATE ERROR:", err);
    }
  };

  if (loading) return <p>Loading academic records...</p>;

  return (
    <div className="space-y-6">

      {/* ================= FILTERS ================= */}
      <div className="grid grid-cols-4 gap-3">

        <select
          onChange={(e) =>
            setFilters({ ...filters, class_id: e.target.value })
          }
          className="border p-2"
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) =>
            setFilters({ ...filters, subject_id: e.target.value })
          }
          className="border p-2"
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.subject_name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) =>
            setFilters({ ...filters, term_id: e.target.value })
          }
          className="border p-2"
        >
          <option value="">All Terms</option>
          {terms.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Academic Year"
          className="border p-2"
          onChange={(e) =>
            setFilters({
              ...filters,
              academic_year: e.target.value,
            })
          }
        />
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
          <table className="w-full border mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Subject</th>
                <th className="p-2 border">Class</th>
                <th className="p-2 border">Term</th>
                <th className="p-2 border">Marks</th>
                <th className="p-2 border">%</th>
                <th className="p-2 border">Grade</th>
                <th className="p-2 border">Remarks</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((r) => {
                const percent =
                  (r.marks_obtained / r.marks_total) * 100;

                return (
                  <tr key={r.id}>
                    <td className="border p-2">{r.subject_name}</td>
                    <td className="border p-2">{r.class_name}</td>
                    <td className="border p-2">{r.term_name}</td>
                    <td className="border p-2">
                      {r.marks_obtained}/{r.marks_total}
                    </td>
                    <td className="border p-2">
                      {percent.toFixed(1)}%
                    </td>
                    <td className="border p-2 font-bold">
                      {r.grade_letter}
                    </td>
                    <td className="border p-2">{r.remarks}</td>

                    {/* ✅ ACTIONS INSIDE ROW */}
                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={() => setActiveRecord(r)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(r.id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </SectionCard>

      {/* ================= CREATE MODAL ================= */}
      {openForm && (
        <EditAcademicModal
          mode="create"
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