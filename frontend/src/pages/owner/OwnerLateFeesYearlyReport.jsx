import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext.jsx";
import Modal from "../../components/Modal.jsx";
import LateFeeForm from "../../components/LateFeeForm.jsx"; // create this similar to ExpenseForm
import ConfirmModal from "../../components/ConfirmModal.jsx";

const OwnerLateFeesYearlyReport = () => {
  const {
    lateFees,
    fetchLateFeesByYear, // we'll add this in DataContext
    fetchLateFeeById,
    updateLateFee,
    deleteLateFee,
  } = useData();

  const [year, setYear] = useState(new Date().getFullYear());
  const [reportLabel, setReportLabel] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLateFee, setEditingLateFee] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [feeToDelete, setFeeToDelete] = useState(null);

  // ---- Total late fees ----
  const totalLateFees = lateFees.reduce(
    (sum, f) => sum + (parseInt(f.amount, 10) || 0),
    0
  );

  // ---- Format UTC date to readable format ----
  const formatEAT = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-UG", {
      timeZone: "Africa/Kampala",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ---- Handle year change ----
  const handleYearChange = async (e) => {
    const selectedYear = parseInt(e.target.value, 10);
    setYear(selectedYear);
    setReportLabel(`Year ${selectedYear}`);
    await fetchLateFeesByYear(selectedYear);
  };

  // ---- Edit/Delete ----
  const handleEditClick = async (id) => {
    const fee = await fetchLateFeeById(id);
    setEditingLateFee(fee);
    setShowModal(true);
  };

  const handleModalSubmit = async (updatedLateFee) => {
    await updateLateFee(updatedLateFee.id, updatedLateFee);
    await fetchLateFeesByYear(year);
    setShowModal(false);
    setEditingLateFee(null);
  };

  const handleDelete = (id) => {
    setFeeToDelete(id);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (feeToDelete) {
      await deleteLateFee(feeToDelete);
      await fetchLateFeesByYear(year);
      setConfirmModalOpen(false);
      setFeeToDelete(null);
    }
  };

  // ---- Year options ----
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= currentYear - 10; y--) {
      years.push(y);
    }
    return years;
  };

  // ---- On mount ----
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYear(currentYear);
    setReportLabel(`Year ${currentYear}`);
    fetchLateFeesByYear(currentYear);
  }, []);

  return (
    <div className="income-page max-w-6xl mx-auto p-4 overflow-y-hidden">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Yearly Late Fees Report
      </h1>

      {/* Year Picker */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Pick a year:</label>
        <select
          value={year}
          onChange={handleYearChange}
          className="border rounded p-2"
        >
          {generateYearOptions().map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <p className="mt-2 text-gray-600">{reportLabel}</p>
      </div>

      {/* Summary Section */}
      <section className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Summary</h2>
        <p>
          <span className="font-medium">Total Late Fees:</span>{" "}
          {totalLateFees.toLocaleString()} UGX
        </p>
      </section>

      {/* Late Fees Table */}
      <section className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          Late Fees List
        </h2>
        <div className="w-full overflow-x-auto max-h-[60vh] overflow-y-auto border border-gray-300 rounded">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-blue-700 text-white sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 text-left">No.</th>
                <th className="px-3 py-2 text-left">Student</th>
                <th className="px-3 py-2 text-left">Amount (UGX)</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lateFees.map((fee, index) => (
                <tr
                  key={fee.id || index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2">{fee.student_name || "N/A"}</td>
                  <td className="px-3 py-2">
                    {parseInt(fee.amount, 10).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">{formatEAT(fee.created_at)}</td>
                  <td className="px-3 py-2 space-x-1">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                      onClick={() => handleEditClick(fee.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(fee.id)}
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

      {/* Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingLateFee(null);
        }}
      >
        {editingLateFee && (
          <LateFeeForm
            lateFeeData={editingLateFee}
            onSubmit={handleModalSubmit}
            onClose={() => {
              setShowModal(false);
              setEditingLateFee(null);
            }}
          />
        )}
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        message="Are you sure you want to delete this late fee?"
        onConfirm={confirmDelete}
        onClose={() => setConfirmModalOpen(false)}
      />
    </div>
  );
};

export default OwnerLateFeesYearlyReport;
