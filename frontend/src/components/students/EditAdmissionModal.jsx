import { useData } from "../../context/DataContext";

export default function EditAdmissionModal({ student, onClose, onUpdated }) {
  const { updateAdmission } = useData();
  const [formData, setFormData] = useState({
    classLevel: student.class_level,
    stream: student.stream,
    admissionDate: student.admission_date,
    registrationFee: student.registration_fee,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateAdmission(student.id, formData);
    const updated = await updateAdmission(student.id, formData);
    onUpdated(updated);
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
            placeholder="Admission Date"
            className="border p-2 w-full rounded"
          />
          <input
            type="number"
            name="registrationFee"
            value={formData.registrationFee}
            onChange={handleChange}
            placeholder="Registration Fee"
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