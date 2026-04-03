import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import SectionCard from "../../components/SectionCard";
import EditStudentModal from "../../components/students/EditStudentModal";
import EditGuardianModal from "../../components/students/EditGuardianModal";
import EditMedicalModal from "../../components/students/EditMedicalModal";
import EditAdmissionModal from "../../components/students/EditAdmissionModal";
import EditPhotoModal from "../../components/students/EditPhotoModal";
import EditPaymentModal from "../../components/students/EditPaymentModal";

export default function StudentProfile() {
  const { id } = useParams();
  const { fetchStudentById } = useData();

  const [studentProfile, setStudentProfile] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [viewPhoto, setViewPhoto] = useState(false);
  const imageRef = useRef();

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
  }, [id, fetchStudentById]);

  if (!studentProfile) return <p>Loading...</p>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-800">Student Profile</h1>

      {/* ================= STUDENT PHOTO ================= */}
       <div className="relative w-54 h-34">
      <img
  ref={imageRef}
  src={
    studentProfile.photo_url
      ? `http://localhost:5500${studentProfile.photo_url}`
      : "/images/default-student.png"
  }
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
    {viewPhoto && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="relative">
      <img
        src={`http://localhost:5500${studentProfile.photo_url}`}
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

      {/* ================= STUDENT INFO SECTIONS ================= */}
      <SectionCard
        title="Student Info"
        onEdit={() => setActiveSection("student")}
      >
        <p>Name: {studentProfile.first_name} {studentProfile.last_name}</p>
        <p>Gender: {studentProfile.gender}</p>
        <p>DOB: {new Date(studentProfile.date_of_birth).toLocaleDateString()}</p>
      </SectionCard>

      <SectionCard
        title="Guardian Info"
        onEdit={() => setActiveSection("guardian")}
      >
        <p>Name: {studentProfile.guardian_first_name} {studentProfile.guardian_last_name}</p>
        <p>Phone: {studentProfile.guardian_phone}</p>
        <p>Relationship: {studentProfile.relationship}</p>
      </SectionCard>

      <SectionCard
        title="Medical Info"
        onEdit={() => setActiveSection("medical")}
      >
        <p>Blood Group: {studentProfile.blood_group}</p>
        <p>Medical Conditions: {studentProfile.medical_conditions}</p>
        <p>Allergies: {studentProfile.allergies}</p>
      </SectionCard>

      <SectionCard
        title="Admission Info"
        onEdit={() => setActiveSection("admission")}
      >
        <p>Class: {studentProfile.class_level}</p>
        <p>Stream: {studentProfile.stream}</p>
        <p>Admission Date: {new Date(studentProfile.admission_date).toLocaleDateString()}</p>
      </SectionCard>

      <SectionCard
        title="Payments"
        onEdit={() => setActiveSection("payment")}
      >
         <p>No payments recorded.</p>
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
      {activeSection === "photo" && (
        <EditPhotoModal
          student={studentProfile}
          onClose={() => setActiveSection(null)}
          onUpdated={setStudentProfile}
        />
      )}
    </div>
  );
}