import { useEffect, useState, useMemo } from "react";
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
    deletePayment,
    user,
    terms,
    fetchTerms,
    fetchStudentFinanceSummary,
  } = useData();

  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "basic";

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState("");

  const [rawData, setRawData] = useState({
    student: null,
    structures: [],
    payments: [],
  });

  useEffect(() => {
    if (!id) return;

    fetchStudentById(id);
    fetchTerms();
  }, [id]);

  // ================= LOAD RAW DATA =================
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const res = await fetchStudentFinanceSummary(id);
      setRawData(res || { student: null, structures: [], payments: [] });
    };

    load();
  }, [id]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  // ================= FILTERED DATA =================
  const structures = useMemo(() => {
    if (!selectedTerm) return rawData.structures;
    return rawData.structures.filter(
      (s) => String(s.term_id) === String(selectedTerm)
    );
  }, [rawData.structures, selectedTerm]);

  const payments = useMemo(() => {
    if (!selectedTerm) return rawData.payments;
    return rawData.payments.filter(
      (p) => String(p.term_id) === String(selectedTerm)
    );
  }, [rawData.payments, selectedTerm]);

  // ================= PAYMENT GROUPING =================
  const paymentMap = useMemo(() => {
    const map = {};

    payments.forEach((p) => {
      const key = `${p.finance_type_id}-${p.term_id}`;

      if (!map[key]) map[key] = 0;

      map[key] += Number(p.amount);
    });

    return map;
  }, [payments]);

  // ================= SUMMARY ENGINE =================
  const summary = useMemo(() => {
    return structures.map((s) => {
      const key = `${s.finance_type_id}-${s.term_id}`;

      const paid = paymentMap[key] || 0;
      const expected = Number(s.expected_amount);

      return {
        finance_type_id: s.finance_type_id,
        finance_type_name: s.finance_type_name,
        term_id: s.term_id,
        term_name: s.term_name,
        expected,
        paid,
        balance: expected - paid,
      };
    });
  }, [structures, paymentMap]);

  const totals = useMemo(() => {
    return summary.reduce(
      (acc, item) => {
        acc.expected += item.expected;
        acc.paid += item.paid;
        acc.balance += item.balance;
        return acc;
      },
      { expected: 0, paid: 0, balance: 0 }
    );
  }, [summary]);

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
        <button onClick={() => handleTabChange("basic")}>Basic Info</button>
        <button onClick={() => handleTabChange("academics")}>Academics</button>
        <button onClick={() => handleTabChange("finances")}>Finances</button>
      </div>

      {tab === "basic" && <BasicInfo id={id} />}
      {tab === "academics" && <Academics studentId={id} />}

      {/* ================= FINANCE TAB ================= */}
      {tab === "finances" && (
        <div className="space-y-6">

          {/* FILTER */}
          <div>
            <label className="font-semibold">Select Term</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="ml-4 border p-2 rounded"
            >
              <option value="">All Terms</option>
              {(terms || []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* ================= SUMMARY CARDS ================= */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded">
              <p>Expected</p>
              <h2>{totals.expected} UGX</h2>
            </div>

            <div className="bg-green-100 p-4 rounded">
              <p>Total Paid</p>
              <h2>{totals.paid} UGX</h2>
            </div>

            <div className="bg-red-100 p-4 rounded">
              <p>Balance</p>
              <h2>{totals.balance} UGX</h2>
            </div>
          </div>

          {/* ================= BREAKDOWN ================= */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-3">Breakdown</h3>

            {summary.map((b, i) => (
              <div key={i} className="flex justify-between border-b py-2">
                <span>
                  {b.finance_type_name} ({b.term_name})
                </span>

                <span>
                  {b.paid} / {b.expected} UGX
                </span>
              </div>
            ))}
          </div>

          {/* ================= PAYMENTS TABLE ================= */}
          <table className="w-full border mt-4">
            <thead className="bg-gray-200">
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Finance Type</th>
                <th>Term</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p, i) => (
                <tr key={i} className="border-t">
                  <td>{p.payment_date || "-"}</td>
                  <td>{p.amount}</td>
                  <td>{p.finance_type_id}</td>
                  <td>{p.term_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= ADD PAYMENT ================= */}
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

              await addPayment(id, data);
              setShowAddPayment(false);
            }}
            className="bg-white p-6 rounded w-96 space-y-4"
          >
            <h2>Add Payment</h2>

            <input name="amount" type="number" className="w-full border p-2" />

            <select name="term_id" className="w-full border p-2">
              {(terms || []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <select name="type" className="w-full border p-2">
              <option value="tuition">Tuition</option>
              <option value="development">Development</option>
              <option value="registration">Registration</option>
            </select>

            <select name="payment_method" className="w-full border p-2">
              <option value="cash">Cash</option>
              <option value="mobile">Mobile</option>
            </select>

            <input type="date" name="payment_date" className="w-full border p-2" />

            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
              Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
}