import { useState } from "react";
import { useData } from "../../context/DataContext";

export default function EditGuardianModal({ student, onClose }) {

  const { updateGuardian } = useData();

  const [form, setForm] = useState({
    firstName: student.guardian_first_name,
    lastName: student.guardian_last_name,
    phone: student.guardian_phone,
  });

  const handleSubmit = async () => {
    await updateGuardian(student.guardian_id, form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-96">

        <h2 className="font-bold mb-4">Edit Guardian</h2>

        <input
          value={form.firstName}
          onChange={(e) =>
            setForm({ ...form, firstName: e.target.value })
          }
          className="border p-2 w-full mb-2"
        />

        <input
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
          className="border p-2 w-full mb-2"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}