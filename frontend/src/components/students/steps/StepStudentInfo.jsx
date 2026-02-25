import React, { useRef } from "react";

export default function StepStudentInfo({ formData, setFormData }) {
  const fileInputRef = useRef();

  const student = formData.student;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      student: {
        ...prev.student,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      student: {
        ...prev.student,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      },
    }));
  };

  return (
    <div className="space-y-6">

      {/* ================= PHOTO SECTION ================= */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Student Photo
        </h3>

        <div
          onClick={() => fileInputRef.current.click()}
          className="w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50"
        >
          {student.photoPreview ? (
            <img
              src={student.photoPreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400">
              Click to upload student photo
            </span>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* ================= BASIC INFO ================= */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Basic Information
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <input
            name="firstName"
            value={student.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="border rounded-lg p-2"
            required
          />

          <input
            name="middleName"
            value={student.middleName}
            onChange={handleChange}
            placeholder="Middle Name"
            className="border rounded-lg p-2"
          />

          <input
            name="lastName"
            value={student.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="border rounded-lg p-2"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <select
            name="gender"
            value={student.gender}
            onChange={handleChange}
            className="border rounded-lg p-2"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            type="date"
            name="dateOfBirth"
            value={student.dateOfBirth}
            onChange={handleChange}
            className="border rounded-lg p-2"
            required
          />
        </div>
      </div>

      {/* ================= NATIONAL DETAILS ================= */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Identity Details
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="nationality"
            value={student.nationality}
            onChange={handleChange}
            placeholder="Nationality"
            className="border rounded-lg p-2"
          />

          <input
            name="nationalIdNumber"
            value={student.nationalIdNumber}
            onChange={handleChange}
            placeholder="National ID Number (Optional)"
            className="border rounded-lg p-2"
          />
        </div>
      </div>

      {/* ================= ACADEMIC DETAILS ================= */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Academic Details
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <input
            name="classLevel"
            value={student.classLevel}
            onChange={handleChange}
            placeholder="Class (e.g. P.3, S.1)"
            className="border rounded-lg p-2"
            required
          />

          <input
            name="stream"
            value={student.stream}
            onChange={handleChange}
            placeholder="Stream (A, B, C)"
            className="border rounded-lg p-2"
          />

          <input
            type="date"
            name="admissionDate"
            value={student.admissionDate}
            onChange={handleChange}
            className="border rounded-lg p-2"
            required
          />
        </div>

        <input
          name="previousSchool"
          value={student.previousSchool}
          onChange={handleChange}
          placeholder="Previous School (Optional)"
          className="border rounded-lg p-2 mt-4 w-full"
        />
      </div>

    </div>
  );
}