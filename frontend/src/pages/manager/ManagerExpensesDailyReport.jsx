import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext.jsx";

const ManagerExpensesDailyReport = () => {
  const {
    expenses,
    fetchDailyData,
  } = useData();

  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(today);

  // Fetch expenses on page load
  useEffect(() => {
    fetchDailyData(selectedDate);
  }, []);

  // Handle day change
  const handleDayChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    fetchDailyData(newDate);
  };

  const reportDate = new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + (parseInt(exp.amount, 10) || 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        {reportDate} Expenses Report
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
          <span className="font-medium">Total Expenses:</span>{" "}
          {totalExpenses.toLocaleString()} UGX
        </p>
      </section>

      {/* Expenses Table */}
      <section className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Expenses List</h2>
        {expenses.length === 0 ? (
          <p className="text-center text-gray-600">No expenses recorded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="p-2 text-left">No.</th>
                  <th className="p-2 text-left">Expense Name</th>
                  <th className="p-2 text-left">Amount (UGX)</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Time of Expense</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp, index) => (
                  <tr key={exp.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{exp.name}</td>
                    <td className="p-2">{parseInt(exp.amount, 10).toLocaleString()}</td>
                    <td className="p-2">{exp.description}</td>
                    <td className="p-2">
                      {new Date(exp.created_at).toLocaleString("en-UG", { timeZone: "Africa/Kampala" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default ManagerExpensesDailyReport;
