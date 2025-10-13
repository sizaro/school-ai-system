import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import Modal from "../../components/Modal.jsx";
import ExpenseForm from "../../components/ExpenseForm.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx";

const OwnerExpensesMonthlyReport = () => {
  const {
    expenses,
    fetchMonthlyData,
    fetchExpenseById,
    updateExpense,
    deleteExpense,
  } = useData();

  const [monthYear, setMonthYear] = useState(""); // e.g. "2025-09"
  const [reportLabel, setReportLabel] = useState("");
  const [loading, setLoading] = useState(true);

  // ---- Modals for Edit/Delete ----
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // ---- Calculate total expenses ----
  const totalExpenses = expenses.reduce(
    (sum, e) => sum + (parseInt(e.amount, 10) || 0),
    0
  );

  // ---- Format UTC date strings to EAT ----
  const formatEAT = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-UG", {
      timeZone: "Africa/Kampala",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ---- Handle month selection ----
  const handleMonthChange = async (e) => {
    const value = e.target.value; // "YYYY-MM"
    if (!value) return;

    const [year, month] = value.split("-").map(Number);

    setMonthYear(value);
    setReportLabel(
      `${new Date(year, month - 1, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })}`
    );

    setLoading(true);
    await fetchMonthlyData(year, month);
    setLoading(false);
  };

  // ---- On page load: current month ----
  useEffect(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const value = `${year}-${month.toString().padStart(2, "0")}`;

    setMonthYear(value);
    setReportLabel(
      `${today.toLocaleString("en-US", { month: "long", year: "numeric" })}`
    );

    const fetchData = async () => {
      setLoading(true);
      await fetchMonthlyData(year, month);
      setLoading(false);
    };

    fetchData();
  }, []);

  // ---- Handle Edit/Delete ----
  const handleEditClick = async (expenseId) => {
    const expense = await fetchExpenseById(expenseId);
    setEditingExpense(expense);
    setShowModal(true);
  };

  const handleModalSubmit = async (updatedExpense) => {
    await updateExpense(updatedExpense.id, updatedExpense);
    const [year, month] = monthYear.split("-").map(Number);
    await fetchMonthlyData(year, month);
    setShowModal(false);
    setEditingExpense(null);
  };

  const handleDelete = (expenseId) => {
    setExpenseToDelete(expenseId);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (expenseToDelete) {
      await deleteExpense(expenseToDelete);
      const [year, month] = monthYear.split("-").map(Number);
      await fetchMonthlyData(year, month);
      setConfirmModalOpen(false);
      setExpenseToDelete(null);
    }
  };

  // ---- Render ----
  return (
    <div className="income-page max-w-6xl mx-auto p-4 overflow-y-hidden">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Monthly Expenses Report
      </h1>

      {/* Month Picker */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Pick a month:</label>
        <input
          type="month"
          value={monthYear}
          onChange={handleMonthChange}
          className="border rounded p-2"
        />
        <p className="mt-2 text-gray-600">{reportLabel}</p>
      </div>

      {loading ? (
        <p className="text-gray-700">Loading monthly expenses...</p>
      ) : !expenses.length ? (
        <p className="text-gray-700">No expenses recorded for this month yet.</p>
      ) : (
        <>
          {/* Summary Section */}
          <section className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Summary</h2>
            <p>
              <span className="font-medium">Total Expenses:</span>{" "}
              {totalExpenses.toLocaleString()} UGX
            </p>
          </section>

          {/* Expenses Table */}
          <section className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              Expenses List
            </h2>
            <div className="w-full overflow-x-auto max-h-[60vh] overflow-y-auto border border-gray-300 rounded">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-blue-700 text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left">No.</th>
                    <th className="px-3 py-2 text-left">Expense Name</th>
                    <th className="px-3 py-2 text-left">Amount (UGX)</th>
                    <th className="px-3 py-2 text-left">Time of Expense</th>
                    <th className="px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp, index) => (
                    <tr
                      key={exp.id || index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-3 py-2">{index + 1}</td>
                      <td className="px-3 py-2">{exp.name}</td>
                      <td className="px-3 py-2">{parseInt(exp.amount, 10).toLocaleString()}</td>
                      <td className="px-3 py-2">{formatEAT(exp.created_at)}</td>
                      <td className="px-3 py-2 space-x-1">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                          onClick={() => handleEditClick(exp.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(exp.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingExpense(null);
        }}
      >
        {editingExpense && (
          <ExpenseForm
            expenseData={editingExpense}
            onSubmit={handleModalSubmit}
            onClose={() => {
              setShowModal(false);
              setEditingExpense(null);
            }}
          />
        )}
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        message="Are you sure you want to delete this expense?"
        onConfirm={confirmDelete}
        onClose={() => setConfirmModalOpen(false)}
      />
    </div>
  );
};

export default OwnerExpensesMonthlyReport;
