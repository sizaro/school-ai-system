import React from "react";

export default function StepPayment({ formData, setFormData }) {
  const student = formData.student;
  const guardian = formData.guardian;
  const medical = formData.medical;
  const payment = formData.payment;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      payment: { ...prev.payment, [name]: value },
    }));
  };

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
            value={payment.registrationFee}
            onChange={handleChange}
            placeholder="Registration Fee (UGX)"
            className="border rounded-lg p-2"
            required
          />

          <input
            name="receiptNumber"
            type="text"
            value={payment.receiptNumber}
            onChange={handleChange}
            placeholder="Receipt Number"
            className="border rounded-lg p-2"
          />
        </div>

        <input
          type="date"
          name="paymentDate"
          value={payment.paymentDate}
          onChange={handleChange}
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
          {student.photoPreview && (
            <div className="mt-3 flex justify-center items-center">
              <strong>{student.firstName}</strong>
              <img
                src={student.photoPreview}
                alt="Student"
                className="w-10 h-8 object-fit rounded-lg mt-2"
              />
            </div>
          )}
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

          <p>
            <strong>Registration Fee:</strong>{" "}
            {payment.registrationFee || "N/A"}
          </p>

          <p>
            <strong>Receipt Number:</strong>{" "}
            {payment.receiptNumber || "N/A"}
          </p>

          <p>
            <strong>Payment Date:</strong>{" "}
            {payment.paymentDate || "N/A"}
          </p>
        </div>
      </div>

    </div>
  );
}