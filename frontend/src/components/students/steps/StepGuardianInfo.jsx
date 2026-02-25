import React from "react";

export default function StepGuardianInfo({ formData, setFormData }) {
  const guardian = formData.guardian;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      guardian: {
        ...prev.guardian,
        [name]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">

      {/* ================= RELATIONSHIP ================= */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Relationship to Student
        </h3>

        <select
          name="relationshipToStudent"
          value={guardian.relationshipToStudent}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full"
          required
        >
          <option value="">Select Relationship</option>
          <option value="Parent">Parent</option>
          <option value="Guardian">Guardian</option>
          <option value="Sibling">Sibling</option>
          <option value="Uncle">Uncle</option>
          <option value="Aunt">Aunt</option>
          <option value="Grandfather">Grandfather</option>
          <option value="Grandmother">Grandmother</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* ================= IDENTITY ================= */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Guardian Identity
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="firstName"
            value={guardian.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="border rounded-lg p-2"
            required
          />

          <input
            name="lastName"
            value={guardian.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="border rounded-lg p-2"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <select
            name="gender"
            value={guardian.gender}
            onChange={handleChange}
            className="border rounded-lg p-2"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            name="nationalIdNumber"
            value={guardian.nationalIdNumber}
            onChange={handleChange}
            placeholder="National ID Number (Optional)"
            className="border rounded-lg p-2"
          />
        </div>
      </div>

      {/* ================= CONTACTS ================= */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Contact Details
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="phone"
            value={guardian.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border rounded-lg p-2"
            required
          />

          <input
            name="alternativePhone"
            value={guardian.alternativePhone}
            onChange={handleChange}
            placeholder="Alternative Phone"
            className="border rounded-lg p-2"
          />
        </div>

        <input
          name="email"
          value={guardian.email}
          onChange={handleChange}
          placeholder="Email"
          className="border rounded-lg p-2 w-full mt-4"
        />
      </div>

      {/* ================= ADDRESS ================= */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Address Details
        </h3>

        <input
          name="occupation"
          value={guardian.occupation}
          onChange={handleChange}
          placeholder="Occupation"
          className="border rounded-lg p-2 w-full"
        />

        <textarea
          name="address"
          value={guardian.address}
          onChange={handleChange}
          placeholder="Address"
          className="border rounded-lg p-2 w-full mt-4"
          rows={3}
        />

        <input
          name="district"
          value={guardian.district}
          onChange={handleChange}
          placeholder="District"
          className="border rounded-lg p-2 w-full mt-4"
        />
      </div>

    </div>
  );
}