import React from "react";

export default function StepPayment({ formData }) {
  const student = formData.student;
  const guardian = formData.guardian;
  const medical = formData.medical;

  return (
    <div className="space-y-6">

      {/* ================= REGISTRATION PAYMENT ================= */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Registration Fee (Cash)
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="registrationFee"
            type="number"
            placeholder="Registration Fee (UGX)"
            className="border rounded-lg p-2"
            required
          />
        </div>

        <input
          type="date"
          name="paymentDate"
          className="border rounded-lg p-2 w-full mt-4"
          required
        />
      </div>

      {/* ================= FINAL REVIEW ================= */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Final Review
        </h3>

        <div className="border rounded-lg p-4 space-y-2 text-sm">
          <p>
            <strong>Student:</strong>{" "}
            {student.firstName} {student.lastName}
          </p>

          <p>
            <strong>Class:</strong> {student.classLevel}
          </p>

          <p>
            <strong>Guardian:</strong>{" "}
            {guardian.firstName} {guardian.lastName}
          </p>

          <p>
            <strong>Relationship:</strong>{" "}
            {guardian.relationshipToStudent}
          </p>

          <p>
            <strong>Phone:</strong> {guardian.phone}
          </p>

          <p>
            <strong>Medical Conditions:</strong>{" "}
            {medical.medicalConditions || "None"}
          </p>

          <p>
            <strong>Allergies:</strong>{" "}
            {medical.allergies || "None"}
          </p>

          {student.photoPreview && (
            <div className="mt-3">
              <strong>Photo:</strong>
              <img
                src={student.photoPreview}
                alt="Student"
                className="w-full h-56 object-cover rounded-lg mt-2"
              />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}