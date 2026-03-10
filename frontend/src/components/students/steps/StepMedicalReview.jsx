import React from "react";

export default function StepMedicalReview({ formData, setFormData }) {

  const medical = formData.medical;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      medical: {
        ...prev.medical,
        [name]: value
      }
    }));
  };

  return (
    <div className="space-y-6">

      <div>
        <h3 className="text-lg font-semibold mb-3">
          Medical Information
        </h3>

        <div className="grid grid-cols-2 gap-4">

          <input
            name="bloodGroup"
            value={medical.bloodGroup}
            onChange={handleChange}
            placeholder="Blood Group (e.g. O+, A-)"
            className="border rounded-lg p-2"
          />

          <input
            name="medicalConditions"
            value={medical.medicalConditions}
            onChange={handleChange}
            placeholder="Medical Conditions"
            className="border rounded-lg p-2"
          />

        </div>

        <textarea
          name="allergies"
          value={medical.allergies}
          onChange={handleChange}
          placeholder="Allergies"
          className="border rounded-lg p-2 w-full mt-4"
          rows={3}
        />

      </div>

    </div>
  );
}