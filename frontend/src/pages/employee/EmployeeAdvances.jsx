import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext.jsx";
import AdvanceForm from "../../components/AdvanceForm.jsx";
import Modal from "../../components/Modal.jsx";
import { useAuth } from "../../context/AuthContext.jsx"; // assuming you have user info here

const EmployeeAdvances = () => {
  const { advances, fetchAdvances, createAdvance } = useData();
  const { user } = useAuth(); // get logged-in employee
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAdvances();
  }, []);

  // Only show advances for this employee
  const employeeAdvances = advances.filter(
    (adv) => adv.employee_id === user.id
  );

  const handleAdd = () => {
    setShowModal(true);
  };

  const handleModalSubmit = async (advanceData) => {
    await createAdvance({ ...advanceData, employee_id: user.id });
    setShowModal(false);
    await fetchAdvances();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Advances</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
        >
          Add Advance
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Reason
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employeeAdvances.map((adv) => (
              <tr key={adv.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{adv.amount}</td>
                <td className="px-4 py-2">
                  {new Date(adv.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{adv.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <AdvanceForm
          onSubmit={handleModalSubmit}
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default EmployeeAdvances;
