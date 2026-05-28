import { useState, useEffect } from "react";

export default function EditAcademicModal({
  user,
  record,
  studentId,
  classes = [],
  subjects = [],
  terms = [],
  grades = [],
  onClose,
  onSubmit,
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

  // ================= YEARS (TEMP) =================
  const academicYears = ["2024", "2025", "2026", "2027"];

  // ================= CALCULATE PERCENT =================
  const calculatePercentage = () => {
    const m = Number(form.marks_obtained);
    const t = Number(form.marks_total);

    if (!m || !t) return 0;
    return ((m / t) * 100).toFixed(2);
  };

  // ================= SUBMIT (BACKEND SAFE) =================
  const handleSave = () => {
    // ❗ prevent empty submissions that break backend
    if (
      !form.subject_id ||
      !form.class_id ||
      !form.term_id ||
      !form.marks_obtained ||
      !form.marks_total
    ) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();

    formData.append("student_id", studentId);
    formData.append("subject_id", form.subject_id);
    formData.append("class_id", form.class_id);
    formData.append("term_id", form.term_id);
    formData.append("academic_year", form.academic_year);
    formData.append("assessment_type", form.assessment_type || "");
    formData.append("marks_obtained", Number(form.marks_obtained));
    formData.append("marks_total", Number(form.marks_total));
    formData.append("percentage", calculatePercentage());
    formData.append("remarks", form.remarks || "");
    formData.append("recorded_by", user?.id || 1);

    // ✅ FILE HANDLING (THIS FIXES YOUR file_url NULL ISSUE)
    if (form.file) {
      formData.append("file", form.file);
    }

    onSubmit(formData);
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

        {/* YEAR */}
        <select
          name="academic_year"
          value={form.academic_year}
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        >
          <option value="">Select Academic Year</option>
          {academicYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* TYPE */}
        <input
          name="assessment_type"
          placeholder="Assessment Type"
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

        {/* REMARKS */}
        <textarea
          name="remarks"
          placeholder="Remarks"
          value={form.remarks}
          onChange={handleChange}
          className="w-full border p-2 mt-3"
        />

        {/* FILE (EVIDENCE) */}
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