import { useState } from "react";
import { useData } from "../../context/DataContext";

export default function EditMedicalModal({ student, onClose }) {
  const { updateMedical } = useData();

  const [formData, setFormData] = useState({
    blood_group: student.blood_group || "",
    medical_conditions: student.medical_conditions || "",
    allergies: student.allergies || "",
    notes: student.medical_notes || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateMedical(student.student_id, formData);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">

        <h2 className="text-lg font-bold mb-4">
          Edit Medical Info
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            name="blood_group"
            value={formData.blood_group}
            onChange={handleChange}
            placeholder="Blood Group"
            className="border p-2 w-full rounded"
          />

          <input
            name="medical_conditions"
            value={formData.medical_conditions}
            onChange={handleChange}
            placeholder="Medical Conditions"
            className="border p-2 w-full rounded"
          />

          <input
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="Allergies"
            className="border p-2 w-full rounded"
          />

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notes"
            className="border p-2 w-full rounded"
          />

          <div className="flex justify-end gap-2">
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