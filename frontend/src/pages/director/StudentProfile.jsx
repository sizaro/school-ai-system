import { useEffect, useState } from "react";
import { useData } from "../../context/DataContext";
import SectionCard from "../../components/common/SectionCard";
import EditStudentModal from "../../components/students/EditStudentModal";
import EditGuardianModal from "../../components/students/EditGuardianModal";
import EditMedicalModal from "../../components/students/EditMedicalModal";
import EditAdmissionModal from "../../components/students/EditAdmissionModal";

export default function StudentProfile({ studentId }) {
  const { fetchStudentById } = useData();

  const [studentProfile, setStudentProfile] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  // Fetch student data when page loads
  useEffect(() => {
    const loadStudent = async () => {
      const data = await fetchStudentById(studentId);
      setStudentProfile(data);
    };
    loadStudent();
  }, [studentId]);

  if (!studentProfile) return <p>Loading...</p>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-800">Student Profile</h1>

      {/* ================= STUDENT INFO ================= */}
      <SectionCard
        title="Student Info"
        onEdit={() => setActiveSection("student")}
      >
        <p>Name: {studentProfile.first_name} {studentProfile.last_name}</p>
        <p>Gender: {studentProfile.gender}</p>
        <p>DOB: {studentProfile.date_of_birth}</p>
      </SectionCard>

      {/* ================= GUARDIAN INFO ================= */}
      <SectionCard
        title="Guardian Info"
        onEdit={() => setActiveSection("guardian")}
      >
        <p>Name: {studentProfile.guardian_first_name} {studentProfile.guardian_last_name}</p>
        <p>Phone: {studentProfile.guardian_phone}</p>
        <p>Relationship: {studentProfile.relationship}</p>
      </SectionCard>

      {/* ================= MEDICAL INFO ================= */}
      <SectionCard
        title="Medical Info"
        onEdit={() => setActiveSection("medical")}
      >
        <p>Blood Group: {studentProfile.blood_group}</p>
        <p>Medical Conditions: {studentProfile.medical_conditions}</p>
        <p>Allergies: {studentProfile.allergies}</p>
      </SectionCard>

      {/* ================= ADMISSION INFO ================= */}
      <SectionCard
        title="Admission Info"
        onEdit={() => setActiveSection("admission")}
      >
        <p>Class: {studentProfile.class_level}</p>
        <p>Stream: {studentProfile.stream}</p>
        <p>Admission Date: {studentProfile.admission_date}</p>
        <p>Registration Fee: {studentProfile.registration_fee}</p>
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