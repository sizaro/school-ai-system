import { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";

export default function TermForm({ initialData, onSubmit }) {
  const { user, checkAuth } = useData();

  const [form, setForm] = useState({
    name: "",
    academic_year: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        academic_year: initialData.academic_year || "",
        start_date: initialData.start_date
          ? initialData.start_date.split("T")[0]
          : "",
        end_date: initialData.end_date
          ? initialData.end_date.split("T")[0]
          : "",
      });
    }

    checkAuth()
  }, [initialData]);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      recorded_by: user?.id, // 🔥 HERE is the fix
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

      {/* TERM NAME */}
      <input
        className="border p-2 w-full"
        placeholder="Term name"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      {/* ACADEMIC YEAR */}
      <input
        className="border p-2 w-full"
        placeholder="Academic Year"
        value={form.academic_year}
        onChange={(e) => handleChange("academic_year", e.target.value)}
      />

      {/* START DATE */}
      <input
        type="date"
        className="border p-2 w-full"
        value={form.start_date}
        onChange={(e) => handleChange("start_date", e.target.value)}
      />

      {/* END DATE */}
      <input
        type="date"
        className="border p-2 w-full"
        value={form.end_date}
        onChange={(e) => handleChange("end_date", e.target.value)}
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Save Term
      </button>
    </form>
  );
}