import { useState } from "react";
import { useData } from "../../context/DataContext";

export default function EditStudentModal({ student, onClose, onUpdated }) {
  const { updateStudent } = useData();
  const [formData, setFormData] = useState({
    firstName: student.first_name,
    lastName: student.last_name,
    gender: student.gender,
    dateOfBirth: student.date_of_birth,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateStudent(student.id, { student: formData });
    onUpdated(await updateStudent(student.id, { student: formData }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-lg font-bold mb-4">Edit Student Info</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="border p-2 w-full rounded"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}