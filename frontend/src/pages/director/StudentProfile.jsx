import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useData } from "../../context/DataContext";

import BasicInfo from "../../components/students/BasicInfo";
import Academics from "../../components/students/Academics";

export default function StudentProfile() {
  const { id } = useParams(); // ✅ studentId

  const {
    fetchStudentById,
    studentProfile,
    addPayment,
    updatePayment,
    deletePayment,
    user,
    terms,
    tuition,
    fetchTerms
  } = useData();

  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "basic";

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState("");

  const imageRef = useRef();

  useEffect(() => {
    if (!id) return;
    fetchStudentById(id);
    fetchTerms();
  }, [id]);

  const handleTabChange = (newTab) => setSearchParams({ tab: newTab });

  if (!studentProfile) return <p>Loading...</p>;

  return (
    <div className="space-y-10 p-6">

      {/* HEADER */}
      <div className="relative w-full">
        <h1 className="text-2xl font-bold text-gray-800">
          {studentProfile.first_name} {studentProfile.last_name}
        </h1>

        <button
          onClick={() => setShowAddPayment(true)}
          className="absolute right-40 top-0 px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Payment
        </button>

        <div className="absolute right-0 w-32 h-32 -top-6">
          <img
            ref={imageRef}
            src={
              studentProfile.photo_url
                ? `http://localhost:5500${studentProfile.photo_url}`
                : "/images/default-student.png"
            }
            className="w-32 h-32 rounded-full object-cover border-2 border-blue-500"
          />
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b pb-2">
        <button onClick={() => handleTabChange("basic")} className={tab === "basic" ? "font-bold border-b-2 border-blue-500" : ""}>Basic Info</button>
        <button onClick={() => handleTabChange("academics")} className={tab === "academics" ? "font-bold border-b-2 border-blue-500" : ""}>Academics</button>
        <button onClick={() => handleTabChange("finances")} className={tab === "finances" ? "font-bold border-b-2 border-blue-500" : ""}>Finances</button>
      </div>

      {tab === "basic" && <BasicInfo id={id} />}
      {tab === "academics" && <Academics studentId={id} />}

      {tab === "finances" && (
        <div className="space-y-6">

          {/* TERM FILTER */}
          <div>
            <label className="font-semibold">Select Term</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="ml-4 border p-2 rounded"
            >
              <option value="">All Terms</option>
              {(terms || []).map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {(() => {
            const payments = studentProfile.finances || [];

            const filteredPayments = selectedTerm
              ? payments.filter(p => p.term_id == selectedTerm)
              : payments;

            const sortedPayments = [...filteredPayments].sort(
              (a, b) => new Date(b.payment_date) - new Date(a.payment_date)
            );

            const latestPayment = sortedPayments[0];

            const totalPaid = filteredPayments.reduce(
              (sum, p) => sum + Number(p.amount),
              0
            );

            const studentClass = studentProfile.class_level;

            const termTuition = tuition?.find(
              t => t.term_id == selectedTerm && t.class_name == studentClass
            );

            const totalTuition = termTuition?.amount || 0;

            const tuitionPaid = filteredPayments
              .filter(p => p.type === "tuition")
              .reduce((sum, p) => sum + Number(p.amount), 0);

            const balance = totalTuition - tuitionPaid;

            return (
              <>
                {/* SUMMARY */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-100 p-4 rounded">
                    <p>Total Paid</p>
                    <h2>{totalPaid} UGX</h2>
                  </div>

                  <div className="bg-green-100 p-4 rounded">
                    <p>Payments Count</p>
                    <h2>{filteredPayments.length}</h2>
                  </div>

                  <div className="bg-yellow-100 p-4 rounded">
                    <p>Latest Payment</p>
                    <h2>{latestPayment?.payment_date || "N/A"}</h2>
                  </div>

                  <div className="bg-red-100 p-4 rounded">
                    <p>Balance</p>
                    <h2>{balance} UGX</h2>
                  </div>
                </div>

                {/* TABLE */}
                <table className="w-full border mt-4">
                  <thead className="bg-gray-200">
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Method</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sortedPayments.map((p) => (
                      <tr key={p.id} className="border-t">
                        <td>{p.payment_date}</td>
                        <td>{p.amount}</td>
                        <td>{p.type}</td>
                        <td>{p.payment_method}</td>

                        <td className="flex gap-2">
                          <button
                            onClick={() => setEditingPayment(p)}
                            className="text-blue-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={async () => {
                              if (!confirm("Delete?")) return;
                              await deletePayment(p.id);
                              await fetchStudentById(id);
                            }}
                            className="text-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            );
          })()}
        </div>
      )}

      {/* ADD PAYMENT */}
      {showAddPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;

              const data = new FormData();
              data.append("amount", form.amount.value);
              data.append("type", form.type.value);
              data.append("payment_method", form.payment_method.value);
              data.append("payment_date", form.payment_date.value);
              data.append("term_id", form.term_id.value);
              data.append("recorded_by", user.id);

              await addPayment(id, data); // ✅ studentId only
              await fetchStudentById(id);

              setShowAddPayment(false);
            }}
            className="bg-white p-6 rounded w-96 space-y-4"
          >
            <h2>Add Payment</h2>

            <input name="amount" type="number" required className="w-full border p-2" />

            <select name="term_id" required className="w-full border p-2">
              {(terms || []).map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            <select name="type" className="w-full border p-2">
              <option value="tuition">Tuition</option>
              <option value="general">General</option>
            </select>

            <select name="payment_method" className="w-full border p-2">
              <option value="cash">Cash</option>
              <option value="mobile">Mobile</option>
            </select>

            <input
              name="payment_date"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              className="w-full border p-2"
            />

            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
              Save
            </button>
          </form>
        </div>
      )}

      {/* EDIT PAYMENT */}
      {editingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              

              const formData = new FormData();

formData.append("id", editingPayment.id);
formData.append("recorded_by", user.id);

formData.append("amount", form.amount.value);
formData.append("type", form.type.value);
formData.append("payment_method", form.payment_method.value);
formData.append("payment_date", form.payment_date.value);
formData.append("term_id", form.term_id.value);

// optional receipt
if (form.receipt?.files?.[0]) {
  formData.append("receipt", form.receipt.files[0]);
}

              await updatePayment(id, formData);
              await fetchStudentById(id);

              setEditingPayment(null);
            }}
            className="bg-white p-6 rounded w-96 space-y-4"
          >
            <h2>Edit Payment</h2>

            <input name="amount" defaultValue={editingPayment.amount} className="w-full border p-2" />

            <select name="term_id" defaultValue={editingPayment.term_id} className="w-full border p-2">
              {(terms || []).map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            <select name="type" defaultValue={editingPayment.type} className="w-full border p-2">
              <option value="tuition">Tuition</option>
              <option value="general">General</option>
            </select>

            <select name="payment_method" defaultValue={editingPayment.payment_method} className="w-full border p-2">
              <option value="cash">Cash</option>
              <option value="mobile">Mobile</option>
            </select>

            <input
              name="payment_date"
              type="date"
              defaultValue={editingPayment.payment_date}
              className="w-full border p-2"
            />

            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
              Update
            </button>
          </form>
        </div>
      )}

    </div>
  );
}