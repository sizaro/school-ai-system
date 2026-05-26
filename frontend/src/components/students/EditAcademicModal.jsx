import { useState, useEffect } from "react";

export default function EditAcademicModal({
  record,
  studentId,
  classes = [],
  subjects = [],
  terms = [],
  grades = [],
  onClose,
  onSubmit, // IMPORTANT: now used instead of fake update logic
}) {
  const isNew = !record?.id;

  const [form, setForm] = useState({
    subject_id: "",
    class_id: "",
    term_id: "",
    academic_year: "",
    assessment_type: "",
    marks_obtained: "",
    marks_total: "",
    remarks: "",
    grade_id: "",
    file: null,
  });

  // ================= POPULATE ON EDIT =================
  useEffect(() => {
    if (record?.id) {
      setForm({
        subject_id: record.subject_id || "",
        class_id: record.class_id || "",
        term_id: record.term_id || "",
        academic_year: record.academic_year || "",
        assessment_type: record.assessment_type || "",
        marks_obtained: record.marks_obtained || "",
        marks_total: record.marks_total || "",
        remarks: record.remarks || "",
        grade_id: record.grade_id || "",
        file: null,
      });
    }
  }, [record]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ================= AUTO % =================
  const calculatePercentage = () => {
    const m = Number(form.marks_obtained);
    const t = Number(form.marks_total);

    if (!m || !t) return 0;
    return ((m / t) * 100).toFixed(2);
  };

  // ================= SUBMIT =================
  const handleSave = () => {
    const payload = {
      ...form,
      student_id: studentId,
      percentage: calculatePercentage(),
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-2xl shadow-lg overflow-auto max-h-[90vh]">

        <h2 className="text-xl font-bold mb-4">
          {isNew ? "Add Performance" : "Edit Performance"}
        </h2>

        {/* CLASS */}
        <select
          name="class_id"
          value={form.class_id}
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* SUBJECT */}
        <select
          name="subject_id"
          value={form.subject_id}
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.subject_name}
            </option>
          ))}
        </select>

        {/* TERM */}
        <select
          name="term_id"
          value={form.term_id}
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        >
          <option value="">Select Term</option>
          {terms.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* ACADEMIC YEAR */}
        <input
          name="academic_year"
          placeholder="Academic Year (e.g 2026)"
          value={form.academic_year}
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        />

        {/* ASSESSMENT TYPE */}
        <input
          name="assessment_type"
          placeholder="Assessment Type (Test, Exam, Assignment)"
          value={form.assessment_type}
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        />

        {/* MARKS */}
        <div className="grid grid-cols-2 gap-3">
          <input
            name="marks_obtained"
            type="number"
            placeholder="Marks Obtained"
            value={form.marks_obtained}
            onChange={handleChange}
            className="border p-2"
          />

          <input
            name="marks_total"
            type="number"
            placeholder="Total Marks"
            value={form.marks_total}
            onChange={handleChange}
            className="border p-2"
          />
        </div>

        {/* GRADE */}
        <select
          name="grade_id"
          value={form.grade_id}
          onChange={handleChange}
          className="w-full border p-2 mt-3"
        >
          <option value="">Select Grade</option>
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              {g.grade} ({g.min_score}-{g.max_score})
            </option>
          ))}
        </select>

        {/* REMARKS */}
        <textarea
          name="remarks"
          placeholder="Remarks"
          value={form.remarks}
          onChange={handleChange}
          className="w-full border p-2 mt-3"
        />

        {/* FILE UPLOAD */}
        <input
          type="file"
          name="file"
          onChange={handleChange}
          className="w-full border p-2 mt-3"
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}