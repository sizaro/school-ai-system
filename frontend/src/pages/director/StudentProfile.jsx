import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useData } from "../../context/DataContext";

export default function StudentProfile() {
  const { id } = useParams();

  const { studentProfile, fetchStudentById } = useData();

  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    fetchStudentById(id);
  }, [id]);

  if (!studentProfile) return <p>Loading...</p>;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {studentProfile.first_name} {studentProfile.last_name}
        </h1>
      </div>

      {/* ================= STUDENT INFO ================= */}
      <Section
        title="Student Information"
        onEdit={() => setActiveSection("student")}
      >
        <p>Email: {studentProfile.email}</p>
        <p>Gender: {studentProfile.gender}</p>
        <p>DOB: {studentProfile.date_of_birth}</p>
      </Section>

      {/* ================= GUARDIAN ================= */}
      <Section
        title="Guardian"
        onEdit={() => setActiveSection("guardian")}
      >
        <p>
          {studentProfile.guardian_first_name}{" "}
          {studentProfile.guardian_last_name}
        </p>
        <p>{studentProfile.guardian_phone}</p>
      </Section>

      {/* ================= ADMISSION ================= */}
      <Section
        title="Admission"
        onEdit={() => setActiveSection("admission")}
      >
        <p>Class: {studentProfile.class_level}</p>
        <p>Stream: {studentProfile.stream}</p>
        <p>Date: {studentProfile.admission_date}</p>
      </Section>

      {/* ================= MEDICAL ================= */}
      <Section
        title="Medical"
        onEdit={() => setActiveSection("medical")}
      >
        <p>Blood Group: {studentProfile.blood_group}</p>
        <p>Conditions: {studentProfile.medical_conditions}</p>
        <p>Allergies: {studentProfile.allergies}</p>
      </Section>

      {/* ================= PAYMENT ================= */}
      <Section
        title="Payment"
        onEdit={() => setActiveSection("payment")}
      >
        <p>Amount: {studentProfile.amount}</p>
        <p>Date: {studentProfile.payment_date}</p>
      </Section>

      {/*FUTURE: MODALS PER SECTION */}
      {activeSection && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-lg font-bold mb-4">
              Edit {activeSection}
            </h2>

            <p className="text-sm text-gray-500">
              (Form coming next...)
            </p>

            <button
              onClick={() => setActiveSection(null)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

/**
 * REUSABLE SECTION COMPONENT
 */
function Section({ title, children, onEdit }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">{title}</h2>
        <button
          onClick={onEdit}
          className="text-blue-600 text-sm hover:underline"
        >
          Edit
        </button>
      </div>

      {children}
    </div>
  );
}