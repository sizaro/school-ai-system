import { useState, useEffect } from 'react';

export default function ExpenseForm({ onSubmit, onClose, expenseData }) {
  const [form, setForm] = useState({
    id: '',
    name: '',
    amount: '',
    description: ''
  });

  // Prefill when editing
  useEffect(() => {
    if (expenseData) {
      setForm({
        id: expenseData.id || '',
        name: expenseData.name || '',
        amount: expenseData.amount || '',
        description: expenseData.description || ''
      });
    }
  }, [expenseData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id: form.id || undefined,
      name: form.name.trim(),
      amount: Number(form.amount),
      description: form.description.trim()
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded shadow-md max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        {form.id ? "Edit Expense" : "Add Expense"}
      </h2>

      {/* Expense Name */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Expense Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter expense name"
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Amount */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Amount</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Enter amount"
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional description"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
      >
        {form.id ? "Update Expense" : "Add Expense"}
      </button>
    </form>
  );
}
