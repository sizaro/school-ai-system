import { useEffect, useState } from "react";
import SectionCard from "../../components/SectionCard";
import EditAcademicModal from "../../components/students/EditAcademicModal";

export default function Academics({ studentId }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRecord, setActiveRecord] = useState(null);

  // ✅ MOCK DATA (temporary)
  useEffect(() => {
    if (!studentId) return;

    const mockData = [
      {
        id: 1,
        subject: "Mathematics",
        score: 85,
        max_score: 100,
        term: "Term 1",
      },
      {
        id: 2,
        subject: "English",
        score: 72,
        max_score: 100,
        term: "Term 1",
      },
      {
        id: 3,
        subject: "Science",
        score: 65,
        max_score: 100,
        term: "Term 1",
      },
      {
        id: 4,
        subject: "History",
        score: 48,
        max_score: 100,
        term: "Term 1",
      },
    ];

    // simulate loading delay (optional but realistic)
    setTimeout(() => {
      setRecords(mockData);
      setLoading(false);
    }, 500);
  }, [studentId]);

  if (loading) return <p>Loading academic records...</p>;

  return (
    <div className="space-y-6">

      {/* ================= ACADEMICS SECTION ================= */}
      <SectionCard
        title="Academic Records"
        onEdit={() => setActiveRecord({})}
      >
        {records.length === 0 ? (
          <p>No academic records found.</p>
        ) : (
          <table className="w-full border mt-2">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Subject</th>
                <th className="p-2 border">Score</th>
                <th className="p-2 border">Max Score</th>
                <th className="p-2 border">Grade</th>
                <th className="p-2 border">Term</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {records.map((r) => {
                const grade =
                  r.score >= 80
                    ? "A"
                    : r.score >= 70
                    ? "B"
                    : r.score >= 60
                    ? "C"
                    : r.score >= 50
                    ? "D"
                    : "F";

                return (
                  <tr key={r.id}>
                    <td className="p-2 border">{r.subject}</td>
                    <td className="p-2 border">{r.score}</td>
                    <td className="p-2 border">{r.max_score}</td>
                    <td className="p-2 border font-semibold">{grade}</td>
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
                );
              })}
            </tbody>
          </table>
        )}
      </SectionCard>

      {/* ================= MODAL ================= */}
      {activeRecord !== null && (
        <EditAcademicModal
          record={activeRecord}
          studentId={studentId}
          onClose={() => setActiveRecord(null)}
          onUpdated={(updatedRecords) => {
            setRecords(updatedRecords);
            setActiveRecord(null);
          }}
        />
      )}
    </div>
  );
}