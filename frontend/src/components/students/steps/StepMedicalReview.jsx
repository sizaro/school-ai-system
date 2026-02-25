import React from "react";

export default function StepMedicalReview({ formData }) {
  const student = formData.student;
  const guardian = formData.guardian;
  const medical = formData.medical;

  return (
    <div className="space-y-6">

      {/* ================= MEDICAL INFO ================= */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Medical Information
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="bloodGroup"
            value={medical.bloodGroup}
            onChange={(e) =>
              formData.setMedical({
                ...medical,
                bloodGroup: e.target.value,
              })
            }
            placeholder="Blood Group (e.g. O+, A-)"
            className="border rounded-lg p-2"
          />

          <input
            name="medicalConditions"
            value={medical.medicalConditions}
            onChange={(e) =>
              formData.setMedical({
                ...medical,
                medicalConditions: e.target.value,
              })
            }
            placeholder="Medical Conditions"
            className="border rounded-lg p-2"
          />
        </div>

        <textarea
          name="allergies"
          value={medical.allergies}
          onChange={(e) =>
            formData.setMedical({
              ...medical,
              allergies: e.target.value,
            })
          }
          placeholder="Allergies"
          className="border rounded-lg p-2 w-full mt-4"
          rows={3}
        />
      </div>

    </div>
  );
}