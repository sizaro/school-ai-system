import { useState, useEffect } from 'react';
import { useData } from "../context/DataContext";

export default function AdvanceForm({ onSubmit, onClose, advanceData }) {
  const [form, setForm] = useState({
    id: '',
    employee_id: '',
    amount: '',
    description: '',
    created_at: '',
  });

   const {
     users =[],
     fetchUsers,
   } = useData();

   const Employees = users.filter((user)=> `${user.first_name} ${user.last_name}`.toLowerCase() !== 'saleh ntege' && user.role !== 'customer')

  // Prefill form when editing
  useEffect(() => {
    if (advanceData) {
      setForm({
        id: advanceData.id || '',
        employee_id: advanceData.employee_id || '',
        amount: advanceData.amount || '',
        description: advanceData.description || '',
        created_at: advanceData.created_at,
      });
    }
  }, [advanceData]);

  useEffect(()=>{
    fetchUsers()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id: form.id || undefined,
      employee_id: form.employee_id,
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
          name="employee_id"
          value={form.employee_id}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Select Employee</option>
          {Employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
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
