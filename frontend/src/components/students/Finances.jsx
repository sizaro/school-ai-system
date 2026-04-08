import { useEffect, useState } from "react";
import SectionCard from "../../components/SectionCard";
import EditTuitionModal from "../../components/students/EditTuitionModal";
import { useData } from "../../context/DataContext";

export default function Finances({ studentId }) {
  const { studentProfile, updateTuitionPayment, deleteTuitionPayment } = useData();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activePayment, setActivePayment] = useState(null);
  const [viewPayment, setViewPayment] = useState(null);

  // ================== Load payments from studentProfile ==================
  useEffect(() => {
    if (!studentId) return;

    setLoading(true);
    if (studentProfile && studentProfile.finances) {
      setPayments(studentProfile.finances);
    }
    setLoading(false);
  }, [studentProfile, studentId]);

  if (loading) return <p>Loading payments...</p>;

  // ================== DELETE PAYMENT ==================
  const handleDelete = async (payment) => {
    if (!confirm("Are you sure you want to delete this payment?")) return;

    try {
      await deleteTuitionPayment(studentId, { id: payment.id });
      setPayments((prev) => prev.filter((p) => p.id !== payment.id));
    } catch (err) {
      console.error("Error deleting payment:", err);
    }
  };

  // ================== UPDATE PAYMENT ==================
  // const handleUpdate = async (updatedPayment) => {
  //   try {
  //     await updateTuitionPayment(studentId, updatedPayment);
  //     setPayments((prev) =>
  //       prev.map((p) => (p.id === updatedPayment.id ? updatedPayment : p))
  //     );
  //     setActivePayment(null);
  //   } catch (err) {
  //     console.error("Error updating payment:", err);
  //   }
  // };


  const onUpdated = async () => {
    try {
      await updateTuitionPayment(studentId, updatedPayment);
      setPayments((prev) =>
        prev.map((p) => (p.id === updatedPayment.id ? updatedPayment : p))
      );
      setActivePayment(null);
    } catch (err) {
      console.error("Error updating payment:", err);
    }
  };

  return (
    <div className="space-y-6">

      {/* ================= PAYMENTS ================= */}
      <SectionCard title="Payments">
        {payments.length === 0 ? (
          <p>No payments recorded.</p>
        ) : (
          <table className="w-full border mt-2">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Method</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="p-2 border">
                    {new Date(p.payment_date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">{p.amount.toLocaleString()} UGX</td>
                  <td className="p-2 border">{p.payment_method}</td>
                  <td className="p-2 border capitalize">{p.type}</td>

                  <td className="p-2 border">
                    <div className="flex gap-2">
                      {/* VIEW */}
                      <button
                        onClick={() => setViewPayment(p)}
                        className="text-green-600 hover:underline"
                      >
                        View
                      </button>

                      {/* EDIT (only tuition) */}
                      {p.type === "tuition" && (
                        <button
                          onClick={() => setActivePayment(p)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                      )}

                      {/* DELETE */}
                      {p.type === "tuition" && (
                        <button
                          onClick={() => handleDelete(p)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionCard>

      {/* ================= VIEW MODAL ================= */}
      {viewPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-lg w-full">
            <h2 className="text-lg font-bold mb-4">Payment Details</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <img
                src={viewPayment.receipt_url}
                alt="Receipt"
                className="w-full h-auto rounded border"
              />
              <div className="space-y-2">
                <p><strong>Receipt:</strong> {viewPayment.receipt_number}</p>
                <p><strong>Amount:</strong> {viewPayment.amount.toLocaleString()} UGX</p>
                <p><strong>Method:</strong> {viewPayment.payment_method}</p>
                <p><strong>Type:</strong> {viewPayment.type}</p>
                <p><strong>Date:</strong> {new Date(viewPayment.payment_date).toLocaleDateString()}</p>
              </div>
            </div>

            <button
              onClick={() => setViewPayment(null)}
              className="mt-4 px-4 py-2 bg-gray-300 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= EDIT TUITION MODAL ================= */}
      {activePayment && activePayment.type === "tuition" && (
        <EditTuitionModal
          payment={activePayment}
          studentId={studentId}
          onClose={() => setActivePayment(null)}
        />
      )}
    </div>
  );
}