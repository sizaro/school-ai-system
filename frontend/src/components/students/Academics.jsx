import { useEffect, useState } from "react";
import SectionCard from "../../components/SectionCard";
import EditAcademicModal from "../../components/students/EditAcademicModal";

export default function Academics({ studentId }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRecord, setActiveRecord] = useState(null);

  // ================= MOCK DATA =================
  useEffect(() => {
    if (!studentId) return;

    const mockData = [
      {
        id: 1,
        subject: "Mathematics",
        score: 85,
        total: 100,
        term: "Term 1",
      },
      {
        id: 2,
        subject: "English",
        score: 72,
        total: 100,
        term: "Term 1",
      },
      {
        id: 3,
        subject: "Science",
        score: 65,
        total: 100,
        term: "Term 1",
      },
      {
        id: 4,
        subject: "History",
        score: 48,
        total: 100,
        term: "Term 1",
      },
    ];

    setTimeout(() => {
      setRecords(mockData);
      setLoading(false);
    }, 400);
  }, [studentId]);

  // ================= GRADE LOGIC =================
  const getGrade = (score, total) => {
    const percent = (score / total) * 100;

    if (percent >= 80) return "A";
    if (percent >= 70) return "B";
    if (percent >= 60) return "C";
    if (percent >= 50) return "D";
    return "F";
  };

  if (loading) return <p>Loading academic records...</p>;

  return (
    <div className="space-y-6">

      {/* ================= TABLE ================= */}
      <SectionCard
        title="Academic Performance"
        onEdit={() =>
          setActiveRecord({
            subject: "",
            score: "",
            total: "",
            term: "",
          })
        }
      >
        {records.length === 0 ? (
          <p>No academic records found.</p>
        ) : (
          <table className="w-full border mt-2">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Subject</th>
                <th className="p-2 border">Score</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Grade</th>
                <th className="p-2 border">Term</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="p-2 border">{r.subject}</td>
                  <td className="p-2 border">{r.score}</td>
                  <td className="p-2 border">{r.total}</td>

                  <td className="p-2 border font-semibold">
                    {getGrade(r.score, r.total)}
                  </td>

                  <td className="p-2 border">{r.term}</td>

                  <td className="p-2 border">
                    <button
                      onClick={() => setActiveRecord(r)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionCard>

      {/* ================= MODAL ================= */}
      {activeRecord && (
        <EditAcademicModal
          record={activeRecord}
          studentId={studentId}
          onClose={() => setActiveRecord(null)}
          onUpdated={(updatedRecord) => {
            // later we will replace with backend refresh
            setRecords((prev) =>
              prev.map((r) =>
                r.id === updatedRecord.id ? updatedRecord : r
              )
            );
            setActiveRecord(null);
          }}
        />
      )}
    </div>
  );
}