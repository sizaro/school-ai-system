import { useEffect, useState } from "react";
import { useData } from "../../context/DataContext";

export default function EditAdmissionModal({ student, onClose, onUpdated }) {
  const { updateAdmission, fetchClasses } = useData();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    class_id: "",
    stream: "",
    admission_date: "",
  });

  // ✅ LOAD CLASSES FIRST
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchClasses();
        setClasses(data);
      } catch (err) {
        console.error("Failed to load classes:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ✅ SET FORM VALUES AFTER BOTH STUDENT + CLASSES ARE READY
  useEffect(() => {
    if (!student) return;

    setFormData({
      class_id: student.class_id || "",
      stream: student.stream || "",
      admission_date: student.admission_date
        ? student.admission_date.split("T")[0]
        : "",
    });
  }, [student]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateAdmission(student.student_id, formData);

    onUpdated && onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">

        <h2 className="text-lg font-bold mb-4">
          Edit Admission Info
        </h2>

        {loading ? (
          <p>Loading classes...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* CLASS DROPDOWN */}
            <select
              name="class_id"
              value={formData.class_id}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="">Select Class</option>

              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>

            {/* STREAM */}
            <input
              name="stream"
              value={formData.stream}
              onChange={handleChange}
              placeholder="Stream"
              className="border p-2 w-full rounded"
            />

            {/* DATE */}
            <input
              type="date"
              name="admission_date"
              value={formData.admission_date}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 mt-3">

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
        )}

      </div>
    </div>
  );
}