import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useData } from "../../context/DataContext";

import BasicInfo from "../../components/students/BasicInfo";
import Academics from "../../components/students/Academics";
import Finances from "../../components/students/Finances";
import AddPaymentModal from "../../components/students/AddPaymentModal";

export default function StudentProfile() {
  const { id } = useParams();
  const { fetchStudentById } = useData();

  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "basic";

  const [studentProfile, setStudentProfile] = useState(null);
  const [showAddPayment, setShowAddPayment] = useState(false);

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

  const handleTabChange = (newTab) => setSearchParams({ tab: newTab });

  if (!studentProfile) return <p>Loading...</p>;

  return (
    <div className="space-y-15 p-6">
      <div className="relative w-full -mt-2">
        <h1 className="text-2xl font-bold text-gray-800 absolute left-0">
          {studentProfile.first_name} {studentProfile.last_name}
        </h1>

        <button
          onClick={() => setShowAddPayment(true)}
          className="absolute left-100 right-100 top-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Payment
        </button>

        <div className="absolute right-0 w-54 h-34 -top-10">
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
        </div>
      </div>

      <div className="flex gap-6 border-b pb-2">
        <button onClick={() => handleTabChange("basic")} className={tab === "basic" ? "font-bold border-b-2 border-blue-500" : ""}>Basic Info</button>
        <button onClick={() => handleTabChange("academics")} className={tab === "academics" ? "font-bold border-b-2 border-blue-500" : ""}>Academics</button>
        <button onClick={() => handleTabChange("finances")} className={tab === "finances" ? "font-bold border-b-2 border-blue-500" : ""}>Finances</button>
      </div>

      <div className="mt-4">
        {tab === "basic" && <BasicInfo id={id} />}
        {tab === "academics" && <Academics studentId={id} />}
        {tab === "finances" && <Finances studentId={id} />}
      </div>

      {showAddPayment && (
        <AddPaymentModal
          studentId={id}
          onClose={() => setShowAddPayment(false)}
          onCreated={(newPayment) => setShowAddPayment(false)}
        />
      )}
    </div>
  );
}