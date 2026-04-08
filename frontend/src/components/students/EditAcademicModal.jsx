import { useState, useEffect } from "react";

export default function EditAcademicModal({
  record,
  studentId,
  onClose,
  onUpdated,
}) {
  const isNew = !record?.id;

  const [form, setForm] = useState({
    subject: "",
    score: "",
    max_score: "",
    term: "Term 1",
  });

  // ✅ Populate form when editing
  useEffect(() => {
    if (record && record.id) {
      setForm({
        subject: record.subject || "",
        score: record.score || "",
        max_score: record.max_score || "",
        term: record.term || "Term 1",
      });
    }
  }, [record]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Save (mock logic)
  const handleSave = () => {
    let updatedList;

    if (isNew) {
      const newRecord = {
        ...form,
        id: Date.now(),
        student_id: studentId,
      };

      updatedList = (prev) => [...prev, newRecord];
    } else {
      const updatedRecord = {
        ...record,
        ...form,
      };

      updatedList = (prev) =>
        prev.map((r) => (r.id === record.id ? updatedRecord : r));
    }

    // 🔥 Important: call parent with updater function
    onUpdated((prev) => updatedList(prev));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {isNew ? "Add Academic Record" : "Edit Academic Record"}
        </h2>

        {/* SUBJECT */}
        <div className="mb-3">
          <label className="block text-sm mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* SCORE */}
        <div className="mb-3">
          <label className="block text-sm mb-1">Score</label>
          <input
            type="number"
            name="score"
            value={form.score}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* MAX SCORE */}
        <div className="mb-3">
          <label className="block text-sm mb-1">Max Score</label>
          <input
            type="number"
            name="max_score"
            value={form.max_score}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* TERM */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Term</label>
          <select
            name="term"
            value={form.term}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>Term 1</option>
            <option>Term 2</option>
            <option>Term 3</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}