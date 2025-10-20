import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext.jsx";
import Modal from "../../components/Modal.jsx";
import TagFeeForm from "../../components/TagFeeForm.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx";

const OwnerTagFeesDailyReport = () => {
  const {
    tagFees,
    fetchTagFees,
    fetchDailyData,
    fetchTagFeeById,
    updateTagFee,
    deleteTagFee,
  } = useData();

  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(today);
  const [showModal, setShowModal] = useState(false);
  const [editingTagFee, setEditingTagFee] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [tagFeeToDelete, setTagFeeToDelete] = useState(null);

  // Fetch tag fees on page load
  useEffect(() => {
    fetchDailyData(selectedDate);
  }, []);

  // ---- Format UTC Date to EAT ----
  const formatEAT = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-UG", {
      timeZone: "Africa/Kampala",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle day change
  const handleDayChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    fetchDailyData(newDate);
  };

  // Handle edit button click
  const handleEditClick = async (tagFeeId) => {
    const tagFee = await fetchTagFeeById(tagFeeId);
    setEditingTagFee(tagFee);
    setShowModal(true);
  };

  // Handle modal form submission
  const handleModalSubmit = async (updatedTagFee) => {
    await updateTagFee(updatedTagFee.id, updatedTagFee);
    await fetchDailyData(selectedDate); // refresh list
    setShowModal(false);
    setEditingTagFee(null);
  };

  // Handle delete button click
  const handleDelete = (tagFeeId) => {
    setTagFeeToDelete(tagFeeId);
    setConfirmModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (tagFeeToDelete) {
      await deleteTagFee(tagFeeToDelete);
      await fetchDailyData(selectedDate);
      setConfirmModalOpen(false);
      setTagFeeToDelete(null);
    }
  };

  const reportDate = new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalTagFees = tagFees.reduce(
    (sum, fee) => sum + (parseInt(fee.amount, 10) || 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        {reportDate} Tag Fees Report
      </h1>

      {/* Date Picker */}
      <div className="mb-4 text-center">
        <label className="font-medium mr-2">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDayChange}
          className="border rounded px-2 py-1"
        />
      </div>

      {/* Summary */}
      <section className="bg-white shadow-md rounded-lg p-4 mb-6 w-full max-w-4xl">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Summary</h2>
        <p>
          <span className="font-medium">Total Tag Fees:</span>{" "}
          {totalTagFees.toLocaleString()} UGX
        </p>
      </section>

      {/* Tag Fees Table */}
      <section className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Tag Fees List</h2>
        {tagFees.length === 0 ? (
          <p className="text-center text-gray-600">No tag fees recorded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="p-2 text-left">No.</th>
                  <th className="p-2 text-left">Employee</th>
                  <th className="p-2 text-left">Amount (UGX)</th>
                  <th className="p-2 text-left">Reason</th>
                  <th className="p-2 text-left">Time of Tag Fee</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tagFees.map((fee, index) => (
                  <tr key={fee.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{fee.employee_name}</td>
                    <td className="p-2">{parseInt(fee.amount, 10).toLocaleString()}</td>
                    <td className="p-2">{fee.reason}</td>
                    <td className="p-2">{formatEAT(fee.created_at)}</td>
                    <td className="p-2 space-x-1">
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
        )}
      </section>

      {/* Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTagFee(null);
        }}
      >
        {editingTagFee && (
          <TagFeeForm
            onSubmit={handleModalSubmit}
            onClose={() => {
              setShowModal(false);
              setEditingTagFee(null);
            }}
            tagFeeData={editingTagFee}
          />
        )}
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        message="Are you sure you want to delete this tag fee?"
        onConfirm={confirmDelete}
        onClose={() => setConfirmModalOpen(false)}
      />
    </div>
  );
};

export default OwnerTagFeesDailyReport;
