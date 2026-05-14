import { useEffect, useState } from "react";

export default function FinanceForm({
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-3"
    >
      {/* CLASS */}
      <select
        className="border p-2 w-full"
        value={form.class_id}
        onChange={(e) =>
          setForm({
            ...form,
            class_id: e.target.value,
          })
        }
      >
        <option value="">Select Class</option>

        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* TERM */}
      <select
        className="border p-2 w-full"
        value={form.term_id}
        onChange={(e) =>
          setForm({
            ...form,
            term_id: e.target.value,
          })
        }
      >
        <option value="">Select Term</option>

        {terms.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {/* FINANCE TYPE */}
      <select
        className="border p-2 w-full"
        value={form.finance_type_id}
        onChange={(e) =>
          setForm({
            ...form,
            finance_type_id: e.target.value,
          })
        }
      >
        <option value="">Select Finance Type</option>

        {financeTypes?.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>

      {/* AMOUNT */}
      <input
        className="border p-2 w-full"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) =>
          setForm({
            ...form,
            amount: e.target.value,
          })
        }
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Save Finance
      </button>
    </form>
  );
}