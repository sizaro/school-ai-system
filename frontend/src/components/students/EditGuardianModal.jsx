import { useState } from "react";
import { useData } from "../../context/DataContext";

export default function EditGuardianModal({ student, onClose }) {
  const { updateGuardian } = useData();

  const [form, setForm] = useState({
    first_name: student.guardian_first_name || "",
    last_name: student.guardian_last_name || "",
    phone: student.guardian_phone || "",
    alternative_phone: student.guardian_alternative_phone || "",
    email: student.guardian_email || "",
    occupation: student.guardian_occupation || "",
    address: student.guardian_address || "",
    district: student.guardian_district || "",
    gender: student.guardian_gender || "",
    national_id_number: student.guardian_national_id_number || "",
  });

  const handleSubmit = async () => {
    try {
      await updateGuardian(student.student_id, form);
      onClose();
    } catch (err) {
      console.error("Guardian update failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-[500px] max-h-[90vh] overflow-y-auto">

        <h2 className="font-bold mb-4">Edit Guardian</h2>

        <input placeholder="First Name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          className="border p-2 w-full mb-2"
        />

        <input placeholder="Last Name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          className="border p-2 w-full mb-2"
        />

        <input placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border p-2 w-full mb-2"
        />

        <input placeholder="Alternative Phone"
          value={form.alternative_phone}
          onChange={(e) => setForm({ ...form, alternative_phone: e.target.value })}
          className="border p-2 w-full mb-2"
        />

        <input placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 w-full mb-2"
        />

        <input placeholder="Occupation"
          value={form.occupation}
          onChange={(e) => setForm({ ...form, occupation: e.target.value })}
          className="border p-2 w-full mb-2"
        />

        <input placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="border p-2 w-full mb-2"
        />

        <input placeholder="District"
          value={form.district}
          onChange={(e) => setForm({ ...form, district: e.target.value })}
          className="border p-2 w-full mb-2"
        />

        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          className="border p-2 w-full mb-2"
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <input placeholder="National ID Number"
          value={form.national_id_number}
          onChange={(e) =>
            setForm({ ...form, national_id_number: e.target.value })
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