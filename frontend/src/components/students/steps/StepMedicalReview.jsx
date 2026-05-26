import React from "react";

export default function StepMedicalReview({ formData, setFormData }) {
  const medical = formData.medical;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      medical: {
        ...prev.medical,
        [name]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">

      <div>
        <h3 className="text-lg font-semibold mb-3">
          Medical Information
        </h3>

        <div className="grid grid-cols-2 gap-4">

          {/* BLOOD GROUP (CONTROLLED) */}
          <select
            name="bloodGroup"
            value={medical.bloodGroup || ""}
            onChange={handleChange}
            className="border rounded-lg p-2"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          {/* MEDICAL CONDITIONS */}
          <input
            name="medicalConditions"
            value={medical.medicalConditions || ""}
            onChange={handleChange}
            placeholder="Medical Conditions (e.g. asthma, diabetes)"
            className="border rounded-lg p-2"
          />

        </div>

        {/* ALLERGIES */}
        <div className="mt-4">
          <textarea
            name="allergies"
            value={medical.allergies || ""}
            onChange={handleChange}
            placeholder="Allergies (e.g. peanuts, dust, drugs)"
            className="border rounded-lg p-2 w-full"
            rows={3}
          />
        </div>

        {/* FUTURE READY NOTE */}
        <p className="text-xs text-gray-400 mt-2">
          Medical data is stored as simple records for now. Can be expanded later into structured health tracking.
        </p>

      </div>

    </div>
  );
}