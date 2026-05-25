import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useData } from "../../context/DataContext";

export default function Finances({ studentId }) {
  const {
    user,
    terms,
    financeTypes,
    fetchTerms,
    fetchFinanceTypes,
    fetchStudentFinanceSummary,
    addPayment,
    deletePayment,
    updatePayment,
  } = useData();

  const [showAddPayment, setShowAddPayment] =
    useState(false);

  const [editingPayment, setEditingPayment] =
    useState(null);

  const [selectedTerm, setSelectedTerm] =
    useState("");

  const [
    selectedFinanceType,
    setSelectedFinanceType,
  ] = useState("");

  const [rawData, setRawData] = useState({
    student: null,
    structures: [],
    payments: [],
  });

  // =====================================
  // LOAD DATA
  // =====================================
  useEffect(() => {
    if (!studentId) return;

    fetchTerms();
    fetchFinanceTypes();

    loadFinance();
  }, [studentId]);

  const loadFinance = async () => {
    const res =
      await fetchStudentFinanceSummary(studentId);

    setRawData(
      res || {
        student: null,
        structures: [],
        payments: [],
      }
    );
  };

  // =====================================
  // FILTER STRUCTURES
  // =====================================
  const filteredStructures = useMemo(() => {
    let data = [...rawData.structures];

    if (selectedTerm) {
      data = data.filter(
        (s) =>
          String(s.term_id) ===
          String(selectedTerm)
      );
    }

    if (selectedFinanceType) {
      data = data.filter(
        (s) =>
          String(s.finance_type_id) ===
          String(selectedFinanceType)
      );
    }

    return data;
  }, [
    rawData.structures,
    selectedTerm,
    selectedFinanceType,
  ]);

  // =====================================
  // FILTER PAYMENTS
  // =====================================
  const filteredPayments = useMemo(() => {
    let data = [...rawData.payments];

    if (selectedTerm) {
      data = data.filter(
        (p) =>
          String(p.term_id) ===
          String(selectedTerm)
      );
    }

    if (selectedFinanceType) {
      data = data.filter(
        (p) =>
          String(p.finance_type_id) ===
          String(selectedFinanceType)
      );
    }

    return data;
  }, [
    rawData.payments,
    selectedTerm,
    selectedFinanceType,
  ]);


  // =====================================
  // PAYMENT MAP
  // =====================================
  const paymentMap = useMemo(() => {
    const map = {};

    filteredPayments.forEach((payment) => {
      const key = `${payment.finance_type_id}-${payment.term_id}`;

      if (!map[key]) {
        map[key] = 0;
      }

      map[key] += Number(payment.amount);
    });

    return map;
  }, [filteredPayments]);

  // =====================================
  // SUMMARY
  // =====================================
  const summary = useMemo(() => {
    return filteredStructures.map((structure) => {
      const key = `${structure.finance_type_id}-${structure.term_id}`;

      const expected = Number(
        structure.expected_amount
      );

      const paid = paymentMap[key] || 0;

      return {
        ...structure,
        expected,
        paid,
        balance: expected - paid,
      };
    });
  }, [filteredStructures, paymentMap]);

  // =====================================
  // TOTALS
  // =====================================
  const totals = useMemo(() => {
    return summary.reduce(
      (acc, item) => {
        acc.expected += item.expected;
        acc.paid += item.paid;
        acc.balance += item.balance;

        return acc;
      },
      {
        expected: 0,
        paid: 0,
        balance: 0,
      }
    );
  }, [summary]);

  // =====================================
  // DELETE PAYMENT
  // =====================================
  const handleDeletePayment = async (
    studentId,
    paymentId
  ) => {
    const confirmDelete = window.confirm(
      "Delete this payment?"
    );

    if (!confirmDelete) return;

    try {
      await deletePayment(studentId,paymentId);

      await loadFinance();
    } catch (error) {
      console.log(error);
      alert("Failed to delete payment");
    }
  };

  // =====================================
  // EDIT PAYMENT
  // =====================================
  const handleEditPayment = async (e) => {
    e.preventDefault();

    try {
      const form = e.target;

      const data = new FormData();

      data.append("paymentId", editingPayment.id)

      data.append("amount", form.amount.value);

      data.append(
        "finance_type_id",
        form.finance_type_id.value
      );

      data.append(
        "payment_method",
        form.payment_method.value
      );

      data.append(
        "payment_date",
        form.payment_date.value
      );

      data.append(
        "term_id",
        form.term_id.value
      );

      data.append(
        "notes",
        form.notes.value
      );

      if (form.receipt.files[0]) {
        data.append(
          "receipt",
          form.receipt.files[0]
        );
      }

      await updatePayment(
        studentId,
        data
      );

      await loadFinance();

      setEditingPayment(null);
    } catch (error) {
      console.log(error);
      alert("Failed to update payment");
    }
  };

  return (
    <div className="space-y-6">

      {/* ================= FILTERS ================= */}
      <div className="bg-white rounded-2xl shadow p-5 flex flex-wrap gap-4 items-center">

        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Filter by Term
          </label>

          <select
            value={selectedTerm}
            onChange={(e) =>
              setSelectedTerm(e.target.value)
            }
            className="border rounded-lg px-4 py-2"
          >
            <option value="">
              All Terms
            </option>

            {(terms || []).map((term) => (
              <option
                key={term.id}
                value={term.id}
              >
                {term.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Filter by Finance Type
          </label>

          <select
            value={selectedFinanceType}
            onChange={(e) =>
              setSelectedFinanceType(
                e.target.value
              )
            }
            className="border rounded-lg px-4 py-2"
          >
            <option value="">
              All Finance Types
            </option>

            {(financeTypes || []).map((type) => (
              <option
                key={type.id}
                value={type.id}
              >
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() =>
            setShowAddPayment(true)
          }
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
        >
          + Add Payment
        </button>

      </div>

      {/* ================= TOTALS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow">
          <p className="text-sm opacity-80">
            Expected Amount
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totals.expected.toLocaleString()} UGX
          </h2>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow">
          <p className="text-sm opacity-80">
            Total Paid
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totals.paid.toLocaleString()} UGX
          </h2>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-6 shadow">
          <p className="text-sm opacity-80">
            Remaining Balance
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totals.balance.toLocaleString()} UGX
          </h2>
        </div>

      </div>

      {/* ================= BREAKDOWN ================= */}
      <div className="bg-white rounded-2xl shadow p-6">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-800">
            Finance Breakdown
          </h2>

          <span className="text-sm text-gray-500">
            {summary.length} Records
          </span>
        </div>

        <div className="space-y-4">

          {summary.map((item, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 hover:bg-gray-50 transition"
            >

              <div className="flex justify-between items-center mb-3">

                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {item.finance_type_name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.term_name}
                  </p>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    item.balance <= 0
                      ? "bg-green-100 text-green-700"
                      : item.paid > 0
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.balance <= 0
                    ? "Paid"
                    : item.paid > 0
                    ? "Partial"
                    : "Unpaid"}
                </div>

              </div>

              <div className="grid grid-cols-3 gap-4">

                <div>
                  <p className="text-sm text-gray-500">
                    Expected
                  </p>

                  <h4 className="font-bold text-blue-700">
                    {item.expected.toLocaleString()} UGX
                  </h4>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Paid
                  </p>

                  <h4 className="font-bold text-green-700">
                    {item.paid.toLocaleString()} UGX
                  </h4>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Balance
                  </p>

                  <h4 className="font-bold text-red-700">
                    {item.balance.toLocaleString()} UGX
                  </h4>
                </div>

              </div>

            </div>
          ))}

        </div>
      </div>

      {/* ================= PAYMENT HISTORY ================= */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Payment History
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>

                <th className="text-left p-4">
                  Finance Type
                </th>

                <th className="text-left p-4">
                  Term
                </th>

                <th className="text-left p-4">
                  Amount
                </th>

                <th className="text-left p-4">
                  Method
                </th>

                <th className="text-left p-4">
                  Date
                </th>

                <th className="text-left p-4">
                  Status
                </th>

                <th className="text-left p-4">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredPayments.map(
                (payment) => (
                  
                  <tr
                    key={payment.id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-4 font-medium capitalize">
                      {
                        payment.finance_type_name
                      }
                    </td>

                    <td className="p-4">
                      {payment.term_name}
                    </td>

                    <td className="p-4 font-semibold text-green-700">
                      {Number(
                        payment.amount
                      ).toLocaleString()}{" "}
                      UGX
                    </td>

                    <td className="p-4 capitalize">
                      {
                        payment.payment_method
                      }
                    </td>

                    <td className="p-4">
                      {new Date(
                        payment.payment_date
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {payment.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            setEditingPayment(
                              payment
                            )
                          }
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm hover:bg-blue-200"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            
                            handleDeletePayment(
                            studentId, payment.id
                            )
                          }
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200"
                        >
                          Delete
                        </button>

                        {payment.receipt_url && (
                          <a
                            href={`http://localhost:5500${payment.receipt_url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm hover:bg-green-200"
                          >
                            Receipt
                          </a>
                        )}

                      </div>
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* ================= ADD PAYMENT MODAL ================= */}
      {showAddPayment && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              try {
                const form = e.target;

                const data = new FormData();

                data.append(
                  "amount",
                  form.amount.value
                );

                data.append(
                  "finance_type_id",
                  form.finance_type_id.value
                );

                data.append(
                  "payment_method",
                  form.payment_method.value
                );

                data.append(
                  "payment_date",
                  form.payment_date.value
                );

                data.append(
                  "term_id",
                  form.term_id.value
                );

                data.append(
                  "notes",
                  form.notes.value
                );

                data.append(
                  "recorded_by",
                  user.id
                );

                if (
                  form.receipt.files[0]
                ) {
                  data.append(
                    "receipt",
                    form.receipt.files[0]
                  );
                }

                await addPayment(
                  studentId,
                  data
                );

                await loadFinance();

                setShowAddPayment(false);
              } catch (error) {
                console.log(error);
                alert(
                  "Failed to add payment"
                );
              }
            }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4"
          >

            <h2 className="text-2xl font-bold">
              Add Payment
            </h2>

            <input
              name="amount"
              type="number"
              placeholder="Amount"
              required
              className="w-full border rounded-lg p-3"
            />

            <select
              name="term_id"
              required
              className="w-full border rounded-lg p-3"
            >
              <option value="">
                Select Term
              </option>

              {(terms || []).map((term) => (
                <option
                  key={term.id}
                  value={term.id}
                >
                  {term.name}
                </option>
              ))}
            </select>

            <select
              name="finance_type_id"
              required
              className="w-full border rounded-lg p-3"
            >
              <option value="">
                Select Finance Type
              </option>

              {(financeTypes || []).map(
                (type) => (
                  <option
                    key={type.id}
                    value={type.id}
                  >
                    {type.name}
                  </option>
                )
              )}
            </select>

            <select
              name="payment_method"
              className="w-full border rounded-lg p-3"
            >
              <option value="cash">
                Cash
              </option>

              <option value="mobile">
                Mobile
              </option>
            </select>

            <input
              type="date"
              name="payment_date"
              required
              className="w-full border rounded-lg p-3"
            />

            <textarea
              name="notes"
              placeholder="Notes"
              className="w-full border rounded-lg p-3"
            />

            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Upload Receipt
              </label>

              <input
                type="file"
                name="receipt"
                accept="image/*,.pdf"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div className="flex gap-3 pt-2">

              <button
                type="button"
                onClick={() =>
                  setShowAddPayment(false)
                }
                className="flex-1 border rounded-lg py-3"
              >
                Cancel
              </button>

              <button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold"
              >
                Save Payment
              </button>

            </div>

          </form>
        </div>
      )}

      {/* ================= EDIT PAYMENT MODAL ================= */}
      {editingPayment && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

          <form
            onSubmit={handleEditPayment}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4"
          >

            <h2 className="text-2xl font-bold">
              Edit Payment
            </h2>

            <input
              name="amount"
              type="number"
              defaultValue={
                editingPayment.amount
              }
              required
              className="w-full border rounded-lg p-3"
            />

            <select
              name="term_id"
              defaultValue={
                editingPayment.term_id
              }
              className="w-full border rounded-lg p-3"
            >
              {(terms || []).map((term) => (
                <option
                  key={term.id}
                  value={term.id}
                >
                  {term.name}
                </option>
              ))}
            </select>

            <select
              name="finance_type_id"
              defaultValue={
                editingPayment.finance_type_id
              }
              className="w-full border rounded-lg p-3"
            >
              {(financeTypes || []).map(
                (type) => (
                  <option
                    key={type.id}
                    value={type.id}
                  >
                    {type.name}
                  </option>
                )
              )}
            </select>

            <select
              name="payment_method"
              defaultValue={
                editingPayment.payment_method
              }
              className="w-full border rounded-lg p-3"
            >
              <option value="cash">
                Cash
              </option>

              <option value="mobile">
                Mobile
              </option>
            </select>

            <input
              type="date"
              name="payment_date"
              defaultValue={
                editingPayment.payment_date?.split(
                  "T"
                )[0]
              }
              className="w-full border rounded-lg p-3"
            />

            <textarea
              name="notes"
              defaultValue={
                editingPayment.notes
              }
              className="w-full border rounded-lg p-3"
            />

            <input
              type="file"
              name="receipt"
              accept="image/*,.pdf"
              className="w-full border rounded-lg p-3"
            />

            <div className="flex gap-3 pt-2">

              <button
                type="button"
                onClick={() =>
                  setEditingPayment(null)
                }
                className="flex-1 border rounded-lg py-3"
              >
                Cancel
              </button>

              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold">
                Update Payment
              </button>

            </div>

          </form>
        </div>
      )}

    </div>
  );
}