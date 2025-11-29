import { useState, useEffect } from "react";
import { useData } from "../context/DataContext";

export default function LateFeeForm({ onSubmit, onClose, feeData = null, employees = [] }) {

  const {
       users =[],
       fetchUsers,
     } = useData();
  // Fixed Late Fee Object
  const LATE_FEE = {
    reason: "Late Arrival Fee",
    amount: 3000,
  };

  const [form, setForm] = useState({
    id: "",
    employee_id: "",
    reason: LATE_FEE.reason,
    amount: LATE_FEE.amount,
    created_at: "",
  });

  console.log("data for late fee to be edited", feeData)
  console.log("employees in the late fee form", employees)

  // Prefill when editing
  useEffect(() => {
    if (feeData) {
      setForm({
        id: feeData.id || "",
        employee_id: feeData.employee_id || "",
        reason: feeData.reason || LATE_FEE.reason,
        amount: feeData.amount || LATE_FEE.amount,
        created_at: feeData.created_at || "",
      });
    }
  }, [feeData]);

  const handleChange = (e) => {
    setForm({ ...form, employee_id: e.target.value });
  };

   useEffect(()=>{
    fetchUsers()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id: form.id || undefined,
      employee_id: form.employee_id,
      reason: form.reason,
      amount: form.amount,
      created_at:form.created_at
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
        {feeData ? "Edit Late Fee" : "Add Late Fee"}
      </h2>

      {/* Employee Select */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Select Employee</label>
        <select
          name="employee_id"
          value={form.employee_id}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">-- Select Employee --</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.first_name} {emp.last_name}
            </option>
          ))}
        </select>
      </div>

      {/* Fee Details */}
      <div className="bg-gray-100 p-3 rounded-md">
        <p><strong>Reason:</strong> {form.reason}</p>
        <p><strong>Amount:</strong> UGX {form.amount}</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
      >
        {form.id ? "Update Late Fee" : "Add Late Fee"}
      </button>
    </form>
  );
}
