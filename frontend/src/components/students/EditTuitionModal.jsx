import { useState, useEffect } from "react";

export default function EditTuitionModal({ payment, studentId, onClose, onUpdated }) {
  const [form, setForm] = useState({
    receipt_number: "",
    payment_date: "",
    amount: "",
    payment_method: "Cash",
  });

  useEffect(() => {
    if (payment) {
      setForm({
        receipt_number: payment.receipt_number || "",
        payment_date: payment.payment_date || "",
        amount: payment.amount || "",
        payment_method: payment.payment_method || "Cash",
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedPayment = { ...payment, ...form, payment_type: "tuition" };
    const updater = (prev) => prev.map((p) => (p.id === payment.id ? updatedPayment : p));
    onUpdated(updater);
  };

  const handleDelete = () => {
    onUpdated((prev) => prev.filter((p) => p.id !== payment.id));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Tuition Payment</h2>

        <input
          name="receipt_number"
          value={form.receipt_number}
          onChange={handleChange}
          placeholder="Receipt Number"
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="date"
          name="payment_date"
          value={form.payment_date}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="w-full border p-2 mb-3 rounded"
        />

        <select
          name="payment_method"
          value={form.payment_method}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded"
        >
          <option>Cash</option>
          <option>Mobile Money</option>
          <option>Bank</option>
        </select>

        <div className="flex justify-between gap-2">
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}