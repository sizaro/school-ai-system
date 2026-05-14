import { useEffect, useState } from "react";

export default function FinanceStructureForm({
  initialData,
  classes,
  terms,
  financeTypes,
  onSubmit,
}) {
  const [form, setForm] = useState({
    class_id: "",
    term_id: "",
    finance_type_id: "",
    amount: "",
  });

  // ---------------- EDIT LOAD ----------------
  useEffect(() => {
    if (initialData) {
      setForm({
        class_id: initialData.class_id || "",
        term_id: initialData.term_id || "",
        finance_type_id: initialData.finance_type_id || "",
        amount: initialData.amount || "",
      });
    }
  }, [initialData]);

  const isEdit = !!initialData;

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.class_id ||
      !form.term_id ||
      !form.finance_type_id ||
      !form.amount
    ) {
      alert("Please fill all fields");
      return;
    }

    onSubmit({
      class_id: Number(form.class_id),
      term_id: Number(form.term_id),
      finance_type_id: Number(form.finance_type_id),
      amount: Number(form.amount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

      {/* CLASS (LOCKED ON EDIT) */}
      <select
        className={`border p-2 w-full ${isEdit ? "bg-gray-100" : ""}`}
        value={form.class_id}
        disabled={isEdit}
        onChange={(e) => handleChange("class_id", e.target.value)}
      >
        <option value="">Select Class</option>
        {classes?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* TERM (LOCKED ON EDIT) */}
      <select
        className={`border p-2 w-full ${isEdit ? "bg-gray-100" : ""}`}
        value={form.term_id}
        disabled={isEdit}
        onChange={(e) => handleChange("term_id", e.target.value)}
      >
        <option value="">Select Term</option>
        {terms?.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {/* FINANCE TYPE (LOCKED ON EDIT) */}
      <select
        className={`border p-2 w-full ${isEdit ? "bg-gray-100" : ""}`}
        value={form.finance_type_id}
        disabled={isEdit}
        onChange={(e) => handleChange("finance_type_id", e.target.value)}
      >
        <option value="">Select Finance Type</option>
        {financeTypes?.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>

      {/* AMOUNT (ONLY EDITABLE) */}
      <input
        className="border p-2 w-full"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
      />

      {/* SUBMIT */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {isEdit ? "Update Finance Structure" : "Save Finance Structure"}
      </button>
    </form>
  );
}