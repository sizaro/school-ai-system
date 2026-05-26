import React, { useRef } from "react";

export default function StepStudentInfo({
  formData,
  setFormData,
  classes = [],
}) {
  const uploadInputRef = useRef();
  const cameraInputRef = useRef();

  const student = formData.student || {};

  const nationalities = [
    "Uganda",
    "Kenya",
    "Tanzania",
    "Rwanda",
    "South Sudan",
    "Other",
  ];

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
    const file = e.target.files?.[0];
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

      {/* ================= PHOTO ================= */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Student Photo
        </h3>

        {/* PHOTO CIRCLE */}
        <div className="flex justify-center">
          <div
            onClick={() => uploadInputRef.current?.click()}
            className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-dashed overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer active:scale-95 transition"
          >
            {student.photoPreview ? (
              <img
                src={student.photoPreview}
                alt="Student"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-400 text-center px-2">
                Tap to add photo
              </span>
            )}

            <div className="absolute bottom-2 right-2 bg-black text-white text-[10px] px-2 py-1 rounded-full opacity-70">
              📷
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 justify-center mt-4">

          <button
            type="button"
            onClick={() => uploadInputRef.current?.click()}
            className="px-3 py-2 text-sm bg-gray-200 rounded-lg"
          >
            Upload
          </button>

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg"
          >
            Take Photo
          </button>
        </div>

        {/* FILE UPLOAD */}
        <input
          type="file"
          ref={uploadInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />

        {/* CAMERA CAPTURE (mobile devices) */}
        <input
          type="file"
          ref={cameraInputRef}
          onChange={handleImageChange}
          accept="image/*"
          capture="environment"
          className="hidden"
        />
      </div>

      {/* ================= BASIC INFORMATION ================= */}
<div>
  <h3 className="text-lg font-semibold mb-3">Basic Information</h3>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

    <div>
      <label className="text-xs text-gray-500">First Name</label>
      <input
        name="firstName"
        value={student.firstName || ""}
        onChange={handleChange}
        className="border rounded-lg p-2 w-full"
      />
    </div>

    <div>
      <label className="text-xs text-gray-500">Middle Name</label>
      <input
        name="middleName"
        value={student.middleName || ""}
        onChange={handleChange}
        className="border rounded-lg p-2 w-full"
      />
    </div>

    <div>
      <label className="text-xs text-gray-500">Last Name</label>
      <input
        name="lastName"
        value={student.lastName || ""}
        onChange={handleChange}
        className="border rounded-lg p-2 w-full"
      />
    </div>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

    <div>
      <label className="text-xs text-gray-500">Gender</label>
      <select
        name="gender"
        value={student.gender || ""}
        onChange={handleChange}
        className="border rounded-lg p-2 w-full"
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </div>

    <div>
      <label className="text-xs text-gray-500">Date of Birth</label>
      <input
        type="date"
        name="dateOfBirth"
        value={student.dateOfBirth || ""}
        onChange={handleChange}
        className="border rounded-lg p-2 w-full"
      />
    </div>
  </div>
</div>

{/* ================= IDENTITY ================= */}
<div className="mt-6">
  <h3 className="text-lg font-semibold mb-3">Identity Details</h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

    <div>
      <label className="text-xs text-gray-500">Nationality</label>
      <select
        name="nationality"
        value={student.nationality || ""}
        onChange={handleChange}
        className="border rounded-lg p-2 w-full"
      >
        <option value="">Select Nationality</option>
        {nationalities.map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="text-xs text-gray-500">National ID (Optional)</label>
      <input
        name="nationalIdNumber"
        value={student.nationalIdNumber || ""}
        onChange={handleChange}
        className="border rounded-lg p-2 w-full"
      />
    </div>
  </div>
</div>

{/* ================= ACADEMIC ================= */}
<div className="mt-6">
  <h3 className="text-lg font-semibold mb-3">Academic Details</h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

    <div>
      <label className="text-xs text-gray-500">Class</label>
      <select
        name="class_id"
        value={student.class_id || ""}
        onChange={handleChange}
        className="border rounded-lg p-2 w-full"
        required
      >
        <option value="">Select Class</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="text-xs text-gray-500">Admission Date</label>
      <input
        type="date"
        name="admissionDate"
        value={student.admissionDate || ""}
        onChange={handleChange}
        className="border rounded-lg p-2 w-full"
      />
    </div>
  </div>

  <div className="mt-4">
    <label className="text-xs text-gray-500">Previous School (Optional)</label>
    <input
      name="previousSchool"
      value={student.previousSchool || ""}
      onChange={handleChange}
      className="border rounded-lg p-2 w-full"
    />
  </div>
</div>

    </div>
  );
}