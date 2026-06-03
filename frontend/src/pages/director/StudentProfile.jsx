import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useData } from "../../context/DataContext";

import BasicInfo from "../../components/students/BasicInfo";
import Academics from "../../components/students/Academics";
import Finances from "../../components/students/Finances";

export default function StudentProfile() {

  const staticBaseUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:5500"
    : "https://salonmanagementsystemv2-ru0i.onrender.com";
  const { id } = useParams();

  const {
    fetchStudentById,
    studentProfile,
  } = useData();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const tab = searchParams.get("tab") || "basic";

  useEffect(() => {
    if (!id) return;

    fetchStudentById(id);
  }, [id]);

  const handleTabChange = (newTab) => {
    setSearchParams({ tab: newTab });
  };

  if (!studentProfile) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-2xl shadow p-6 relative overflow-hidden">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {studentProfile.first_name}{" "}
              {studentProfile.last_name}
            </h1>

            <p className="text-gray-500 mt-2">
              Finance & Student Dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">

            <img
              src={
                  import.meta.env.MODE === "development"
                  ? `http://localhost:5500${studentProfile.photo_url}`
                  : `${studentProfile.photo_url}`
              }
              alt="student"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
            />
          </div>

        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-6 border-b pb-3">

        <button
          onClick={() => handleTabChange("basic")}
          className={`pb-2 ${
            tab === "basic"
              ? "border-b-2 border-blue-600 font-bold text-blue-600"
              : "text-gray-500"
          }`}
        >
          Basic Info
        </button>

        <button
          onClick={() => handleTabChange("academics")}
          className={`pb-2 ${
            tab === "academics"
              ? "border-b-2 border-blue-600 font-bold text-blue-600"
              : "text-gray-500"
          }`}
        >
          Academics
        </button>

        <button
          onClick={() => handleTabChange("finances")}
          className={`pb-2 ${
            tab === "finances"
              ? "border-b-2 border-blue-600 font-bold text-blue-600"
              : "text-gray-500"
          }`}
        >
          Finances
        </button>

      </div>

      {/* ================= TAB CONTENT ================= */}
      {tab === "basic" && <BasicInfo id={id} />}

      {tab === "academics" && (
        <Academics studentId={id} />
      )}

      {tab === "finances" && (
        <Finances studentId={id} />
      )}

    </div>
  );
}