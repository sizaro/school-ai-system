import { useState, useEffect } from "react";

export default function GradeForm({
  initialData,
  onSubmit,
  classes = [],
  terms = [],
}) {
  const [form, setForm] = useState({
    class_id: "",
    grade: "",
    min_score: "",
    max_score: "",
    remarks: "",
    term_id: "",
    academic_year: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        class_id: initialData.class_id || "",
        grade: initialData.grade || "",
        min_score: initialData.min_score || "",
        max_score: initialData.max_score || "",
        remarks: initialData.remarks || "",
        term_id: initialData.term_id || "",
        academic_year: initialData.academic_year || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      min_score: Number(form.min_score),
      max_score: Number(form.max_score),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[80vh]">

      {/* CLASS (dropdown) */}
      <div>
        <label className="block text-sm font-medium">Class</label>
        <select
          name="class_id"
          value={form.class_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* GRADE */}
      <div>
        <label className="block text-sm font-medium">Grade</label>
        <input
          name="grade"
          value={form.grade}
          onChange={handleChange}
          placeholder="A, B, C..."
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* MIN SCORE */}
      <div>
        <label className="block text-sm font-medium">Min Score</label>
        <input
          type="number"
          name="min_score"
          value={form.min_score}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* MAX SCORE */}
      <div>
        <label className="block text-sm font-medium">Max Score</label>
        <input
          type="number"
          name="max_score"
          value={form.max_score}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* TERM (dropdown) */}
      <div>
        <label className="block text-sm font-medium">Term</label>
        <select
          name="term_id"
          value={form.term_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Term</option>
          {terms.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* ACADEMIC YEAR */}
      <div>
        <label className="block text-sm font-medium">Academic Year</label>
        <input
          name="academic_year"
          value={form.academic_year}
          onChange={handleChange}
          placeholder="e.g 2026"
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* REMARKS */}
      <div>
        <label className="block text-sm font-medium">Remarks</label>
        <textarea
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Optional notes about this grade"
        />
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {initialData ? "Update Grade" : "Create Grade"}
      </button>
    </form>
  );
}