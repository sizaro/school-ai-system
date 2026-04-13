import { useEffect, useState } from "react";

export default function ClassForm({ initialData, onSubmit }) {
  const [form, setForm] = useState({ name: "" });

  // P.1 → P.7 fixed options
  const classes = ["P.1", "P.2", "P.3", "P.4", "P.5", "P.6", "P.7"];

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
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
      {/* DROPDOWN INSTEAD OF INPUT */}
      <select
        className="border p-2 w-full"
        value={form.name}
        onChange={(e) => setForm({ name: e.target.value })}
      >
        <option value="">Select Class</option>

        {classes.map((cls) => (
          <option key={cls} value={cls}>
            {cls}
          </option>
        ))}
      </select>

      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Save Class
      </button>
    </form>
  );
}