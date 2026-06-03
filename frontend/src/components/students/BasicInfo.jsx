import { useEffect, useState, useRef } from "react";
import { useData } from "../../context/DataContext";
import SectionCard from "../../components/SectionCard";
import EditStudentModal from "../../components/students/EditStudentModal";
import EditGuardianModal from "../../components/students/EditGuardianModal";
import EditMedicalModal from "../../components/students/EditMedicalModal";
import EditAdmissionModal from "../../components/students/EditAdmissionModal";
import EditPhotoModal from "../../components/students/EditPhotoModal";

export default function BasicInfo({ id }) {
  const { fetchStudentById } = useData();

  const [studentProfile, setStudentProfile] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [viewPhoto, setViewPhoto] = useState(false);
  const imageRef = useRef();

  // ✅ ENV SAFE API BASE URL
const API_BASE_URL =
  import.meta.env.PROD.VITE_API_URL || "http://localhost:5500";
const getImageUrl = (path) => {
  if (!path) return "/images/default-student.png";

  return `${API_BASE_URL}${path}`;
};

  useEffect(() => {
    if (!id) return;

    const loadStudent = async () => {
      try {
        const data = await fetchStudentById(id);
        setStudentProfile(data);
      } catch (err) {
        console.error("Failed to fetch student:", err);
      }
    };

    loadStudent();
  }, [id]);

  if (!studentProfile) return <p>Loading...</p>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Student Profile
      </h1>

      {/* ================= PHOTO ================= */}
      <div className="relative w-54 h-34">
        <img
          ref={imageRef}
          src={import.meta.env.MODE === "development"
                  ? `http://localhost:5500${studentProfile.photo_url}`
                  : `https://medanfoafricacommunityschool.onrender.com${studentProfile.photo_url}`}
          alt="Student"
          className="w-54 h-28 rounded-full object-cover border-2 border-blue-500"
        />

        <button
          onClick={() => setShowPhotoMenu(!showPhotoMenu)}
          className="flex items-center gap-1 px-2 py-1 border rounded-full bg-white shadow absolute bottom-0 left-0 hover:bg-gray-100"
        >
          📷 Edit
        </button>

        {showPhotoMenu && (
          <EditPhotoModal
            student={studentProfile}
            onClose={() => setShowPhotoMenu(false)}
            positionRef={imageRef}
            onView={() => setViewPhoto(true)}
          />
        )}
      </div>

      {/* FULL VIEW PHOTO */}
      {viewPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={getImageUrl(studentProfile.photo_url)}
              alt="Full"
              className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
            />
            <button
              onClick={() => setViewPhoto(false)}
              className="absolute top-2 right-2 bg-white px-2 py-1 rounded"
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {/* ================= STUDENT INFO ================= */}
      <SectionCard
        title="Student Info"
        onEdit={() => setActiveSection("student")}
      >
        <p>
          Name: {studentProfile.first_name} {studentProfile.last_name}
        </p>
        <p>Gender: {studentProfile.gender || "N/A"}</p>
        <p>
          DOB:{" "}
          {studentProfile.date_of_birth
            ? new Date(studentProfile.date_of_birth).toLocaleDateString()
            : "N/A"}
        </p>
        <p>Nationality: {studentProfile.nationality || "N/A"}</p>
      </SectionCard>

      {/* ================= GUARDIAN ================= */}
      <SectionCard
        title="Guardian Info"
        onEdit={() => setActiveSection("guardian")}
      >
        <p>
          Name:{" "}
          {studentProfile.guardian_first_name || "N/A"}{" "}
          {studentProfile.guardian_last_name || ""}
        </p>
        <p>Phone: {studentProfile.guardian_phone || "N/A"}</p>
        <p>Relationship: {studentProfile.relationship || "N/A"}</p>
        <p>Email: {studentProfile.guardian_email || "N/A"}</p>
        <p>Address: {studentProfile.guardian_address || "N/A"}</p>
      </SectionCard>

      {/* ================= MEDICAL ================= */}
      <SectionCard
        title="Medical Info"
        onEdit={() => setActiveSection("medical")}
      >
        <p>Blood Group: {studentProfile.blood_group || "N/A"}</p>
        <p>
          Conditions:{" "}
          {studentProfile.medical_conditions || "None"}
        </p>
        <p>Allergies: {studentProfile.allergies || "None"}</p>
        <p>Notes: {studentProfile.medical_notes || "N/A"}</p>
      </SectionCard>

      {/* ================= ADMISSION ================= */}
      <SectionCard
        title="Admission Info"
        onEdit={() => setActiveSection("admission")}
      >
        <p>
          Admission No: {studentProfile.admission_number || "N/A"}
        </p>

        <p>
          Class:{" "}
          {studentProfile.class_name ||
            studentProfile.class_level ||
            "N/A"}
        </p>

        <p>Stream: {studentProfile.stream || "N/A"}</p>

        <p>
          Admission Date:{" "}
          {studentProfile.admission_date
            ? new Date(
                studentProfile.admission_date
              ).toLocaleDateString()
            : "N/A"}
        </p>

        <p>Status: {studentProfile.status || "Active"}</p>
      </SectionCard>

      {/* ================= MODALS ================= */}
      {activeSection === "student" && (
        <EditStudentModal
          student={studentProfile}
          onClose={() => setActiveSection(null)}
          onUpdated={setStudentProfile}
        />
      )}

      {activeSection === "guardian" && (
        <EditGuardianModal
          student={studentProfile}
          onClose={() => setActiveSection(null)}
          onUpdated={setStudentProfile}
        />
      )}

      {activeSection === "medical" && (
        <EditMedicalModal
          student={studentProfile}
          onClose={() => setActiveSection(null)}
          onUpdated={setStudentProfile}
        />
      )}

      {activeSection === "admission" && (
        <EditAdmissionModal
          student={studentProfile}
          onClose={() => setActiveSection(null)}
          onUpdated={setStudentProfile}
        />
      )}
    </div>
  );
}