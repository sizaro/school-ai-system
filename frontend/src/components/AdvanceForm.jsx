import { useState, useEffect } from 'react';

export default function AdvanceForm({ onSubmit, onClose, advanceData }) {
  const [form, setForm] = useState({
    id: '',
    employee_name: '',
    amount: '',
    description: ''
  });

  const mockEmployees = [
    { id: 1, first_name: "Tagoole", last_name: "Nathan", phone: "705715763" },
    { id: 2, first_name: "Mukungu", last_name: "Ismail", phone: "755686550" },
    { id: 3, first_name: "Direse", last_name: "Arafat", phone: "742259330" },
    { id: 4, first_name: "Nambi", last_name: "Aisha", phone: "753541883" },
    { id: 5, first_name: "Mutesi", last_name: "Shamina", phone: "745930298" },
    { id: 6, first_name: "Nantongo", last_name: "Jazimin", phone: "703093092" },
    { id: 7, first_name: "Nakaibale", last_name: "Sharon", phone: "752272415" },
    { id: 8, first_name: "Kyewayenda", last_name: "Brenda", phone: "752853209" },
    { id: 9, first_name: "Tusubira", last_name: "David tobex", phone: "788517650" },
    { id: 10, first_name: "Kwikiriza", last_name: "Phinnah", phone: "742927521" },
    { id: 11, first_name: "Muzale Grace", last_name: "innocent", phone: "754954054" },
    { id: 12, first_name: "Tendo", last_name: "Mirembe", phone: "750795036" },
    { id: 13, first_name: "Nakato", last_name: "Hilda", phone: "700465015" },
    { id: 14, first_name: "Bazibu", last_name: "Nickolas", phone: "750411158" },
  ];

  // Prefill form when editing
  useEffect(() => {
    if (advanceData) {
      setForm({
        id: advanceData.id || '',
        employee_name: advanceData.employee_name || '',
        amount: advanceData.amount || '',
        description: advanceData.description || ''
      });
    }
  }, [advanceData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id: form.id || undefined,
      employee_name: form.employee_name,
      amount: Number(form.amount),
      description: form.description
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded shadow-md max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-800">
        {form.id ? "Edit Advance" : "Give Advance"}
      </h2>

      {/* Employee Field */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Employee</label>
        <select
          name="employee_name"
          value={form.employee_name}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Select Employee</option>
          {mockEmployees.map((emp) => (
            <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`}>
              {emp.first_name} {emp.last_name}
            </option>
          ))}
        </select>
      </div>

      {/* Amount Field */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Amount</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter amount"
          required
        />
      </div>

      {/* Description Field */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Optional description"
        />
      </div>

      {/* Submit Button */}
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
        type="submit"
      >
        {form.id ? "Update Advance" : "Add Advance"}
      </button>
    </form>
  );
}
