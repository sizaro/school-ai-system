import { useState, useEffect } from "react";



export default function ClockForm({ onSubmit, onClose, employees}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [formData, setFormData] = useState({
    employee_id: "",
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEmployeeChange = (e) => {
    setFormData((prev) => ({ ...prev, employee_id: e.target.value }));
  };

  const handleClockIn = () => { 
    onSubmit("clockin", formData); 
    onClose();             
  };

  const handleClockOut = () => {
    onSubmit("clockout", formData); 
    onClose();       
  };

  return (
    <div className="space-y-6">
      {/* Digital Clock */}
      <div className="text-center text-2xl font-bold">
        {currentTime.toLocaleTimeString()}
      </div>

      <h2 className="text-xl font-bold">Employee Clock In / Clock Out</h2>

      {/* Employee dropdown */}
      <select
        name="employeeName"
        value={formData.employee_id}
        onChange={handleEmployeeChange}
        required
        className="w-full border px-2 py-1"
      >
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.first_name} {emp.last_name}
          </option>
        ))}
      </select>

      {/* Clock in/out buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleClockIn}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Clock In
        </button>
        <button
          type="button"
          onClick={handleClockOut}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Clock Out
        </button>
      </div>

      {/* Cancel */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onClose}
          className="btn bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
