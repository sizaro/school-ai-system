import { useEffect, useState } from "react";

export default function SubjectForm({ initialData, classes, onSubmit }) {
  const [form, setForm] = useState({
    subject_name: "",
    class_id: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        subject_name: initialData.subject_name || "",
        class_id: initialData.class_id || "",
      });
    }
  }, [initialData]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-3"
    >
      {/* SUBJECT NAME */}
      <input
        placeholder="Subject name"
        value={form.subject_name}
        onChange={(e) =>
          setForm({ ...form, subject_name: e.target.value })
        }
        className="border p-2 w-full rounded"
      />

      {/* CLASS */}
      <select
        value={form.class_id}
        onChange={(e) =>
          setForm({ ...form, class_id: e.target.value })
        }
        disabled={!!initialData}
        className={`border p-2 w-full rounded ${
          initialData
            ? "bg-gray-100 cursor-not-allowed"
            : ""
        }`}
      >
        <option value="">Select class</option>

        {classes?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* OPTIONAL MESSAGE */}
      {initialData && (
        <p className="text-sm text-gray-500">
          Class cannot be changed after subject creation.
        </p>
      )}

      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Save
      </button>
    </form>
  );
}