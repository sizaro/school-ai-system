import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useData } from "../../context/DataContext";

import BasicInfo from "../../components/students/BasicInfo";
import Academics from "../../components/students/Academics";

export default function StudentProfile() {
  const { id } = useParams();

  const {
    fetchStudentById,
    studentProfile,
    addPayment,
    user,
    terms,
    fetchTerms
  } = useData();

  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "basic";

  const [showAddPayment, setShowAddPayment] = useState(false);
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
          className="absolute right-40 top-0 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
            alt="Student"
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

      {/* CONTENT */}
      <div className="mt-4">
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

            {/* PAYMENTS DATA */}
            {(() => {
              const payments = studentProfile.payments || [];

              const filteredPayments = selectedTerm
                ? payments.filter(p => p.term_id == selectedTerm)
                : payments;

              const totalPaid = filteredPayments.reduce(
                (sum, p) => sum + Number(p.amount),
                0
              );

              return (
                <>
                  {/* SUMMARY */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-100 p-4 rounded">
                      <p>Total Paid</p>
                      <h2 className="text-xl font-bold">{totalPaid} UGX</h2>
                    </div>

                    <div className="bg-green-100 p-4 rounded">
                      <p>Payments Count</p>
                      <h2 className="text-xl font-bold">
                        {filteredPayments.length}
                      </h2>
                    </div>

                    <div className="bg-yellow-100 p-4 rounded">
                      <p>Latest Payment</p>
                      <h2 className="text-sm">
                        {filteredPayments[0]?.payment_date || "N/A"}
                      </h2>
                    </div>
                  </div>

                  {/* TABLE */}
                  <div className="overflow-x-auto">
                    <table className="w-full border mt-4">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="p-2">Date</th>
                          <th className="p-2">Amount</th>
                          <th className="p-2">Type</th>
                          <th className="p-2">Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayments.map((p) => (
                          <tr key={p.id} className="border-t">
                            <td className="p-2">{p.payment_date}</td>
                            <td className="p-2">{p.amount}</td>
                            <td className="p-2">{p.type}</td>
                            <td className="p-2">{p.payment_method}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* MODAL */}
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

              try {
                await addPayment(id, data);

                await fetchStudentById(id); // refresh

                setShowAddPayment(false);
              } catch (err) {
                console.error(err);
                alert("Error saving payment");
              }
            }}
            className="bg-white p-6 rounded w-96 space-y-4"
          >
            <h2 className="font-bold text-lg">Add Payment</h2>

            <input name="amount" type="number" placeholder="Amount" required className="w-full border p-2" />

            <select name="term_id" required className="w-full border p-2">
              <option value="">Select Term</option>
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

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddPayment(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}