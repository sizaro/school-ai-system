import { useState } from "react";
import { useData } from "../../context/DataContext";

export default function EditAdmissionModal({ student, onClose, onUpdated }) {
  const { updateAdmission } = useData();

  // ✅ Convert ANY incoming date → YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (!isNaN(date)) {
      return date.toISOString().split("T")[0];
    }

    if (dateString.includes("/")) {
      const [month, day, year] = dateString.split("/");
      if (!month || !day || !year) return "";
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    return "";
  };

  // ✅ Convert back → ISO (best for backend)
  const formatDateForBackend = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString();
  };

  const [formData, setFormData] = useState({
    classLevel: student.class_level,
    stream: student.stream,
    admissionDate: formatDateForInput(student.admission_date),
    registrationFee: student.amount,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      admissionDate: formatDateForBackend(formData.admissionDate),
    };

    await updateAdmission(student.student_id, {
      admission: payload,
    });

    onUpdated && onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-lg font-bold mb-4">Edit Admission Info</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="classLevel"
            value={formData.classLevel}
            onChange={handleChange}
            placeholder="Class Level"
            className="border p-2 w-full rounded"
          />

          <input
            type="text"
            name="stream"
            value={formData.stream}
            onChange={handleChange}
            placeholder="Stream"
            className="border p-2 w-full rounded"
          />

          <input
            type="date"
            name="admissionDate"
            value={formData.admissionDate}
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