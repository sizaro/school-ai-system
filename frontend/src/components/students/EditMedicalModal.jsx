import { useState } from "react";
import { useData } from "../../context/DataContext";

export default function EditMedicalModal({ student, onClose, onUpdated }) {
  const { updateMedical } = useData();
  const [formData, setFormData] = useState({
    bloodGroup: student.blood_group,
    medicalConditions: student.medical_conditions,
    allergies: student.allergies,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateMedical(student.user_id, formData, student.id);
    const updated = await updateMedical(student.user_id, formData, student.id);
    onUpdated(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-lg font-bold mb-4">Edit Medical Info</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            placeholder="Blood Group"
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            name="medicalConditions"
            value={formData.medicalConditions}
            onChange={handleChange}
            placeholder="Medical Conditions"
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="Allergies"
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