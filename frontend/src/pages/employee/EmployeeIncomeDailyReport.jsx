import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext.jsx";
import "../../styles/IncomeDailyReport.css";
import Modal from "../../components/Modal";
import ServiceForm from "../../components/ServiceForm.jsx";

const EmployeeDailyReport = () => {
  const {
    services,
    advances,
    tagFees,
    lateFees,
    sessions,
    fetchDailyData,
    user
  } = useData();

  const today = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const reportDate = today.toLocaleDateString("en-US", options);

  const session = sessions && sessions.length > 0 ? sessions[0] : null;
  const [liveDuration, setLiveDuration] = useState("");
  const [selectedDate, setSelectedDate] = useState(today.toLocaleDateString("en-CA"));

  // ---- Filter employee-specific services ----
  const myServices = services.filter(
    (s) =>
      s.barber_id === user.id ||
      s.barber_assistant_id === user.id ||
      s.scrubber_assistant_id === user.id ||
      s.black_shampoo_assistant_id === user.id ||
      s.super_black_assistant_id === user.id ||
      s.black_mask_assistant_id === user.id
  );

  const myAdvances = advances.filter((a) => a.employee_id === user.id);
  const myTagFees = tagFees.filter((t) => t.employee_id === user.id);
  const myLateFees = lateFees.filter((l) => l.employee_id === user.id);

  // ---- Calculate employee salary ----
  const totalSalary = myServices.reduce((sum, s) => {
    if (s.barber_id === user.id) sum += parseInt(s.barber_amount, 10) || 0;
    if (s.barber_assistant_id === user.id) sum += parseInt(s.barber_assistant_amount, 10) || 0;
    if (s.scrubber_assistant_id === user.id) sum += parseInt(s.scrubber_assistant_amount, 10) || 0;
    if (s.black_shampoo_assistant_id === user.id) sum += parseInt(s.black_shampoo_assistant_amount, 10) || 0;
    if (s.super_black_assistant_id === user.id) sum += parseInt(s.super_black_assistant_amount, 10) || 0;
    if (s.black_mask_assistant_id === user.id) sum += parseInt(s.black_mask_assistant_amount, 10) || 0;
    return sum;
  }, 0);

  const totalTagFees = myTagFees.reduce((sum, t) => sum + (parseInt(t.amount, 10) || 0), 0);
  const totalLateFees = myLateFees.reduce((sum, l) => sum + (parseInt(l.amount, 10) || 0), 0);
  const totalAdvancesAmount = myAdvances.reduce((sum, a) => sum + (parseInt(a.amount, 10) || 0), 0);

  const netSalary = totalSalary - (totalTagFees + totalLateFees + totalAdvancesAmount);

  // ---- Format UTC Date to EAT ----
  const formatEAT = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-UG", {
      timeZone: "Africa/Kampala",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ---- Calculate Duration ----
  const calculateDuration = (openUTC, closeUTC) => {
    if (!openUTC || !closeUTC) return "N/A";
    const diffMs = new Date(closeUTC) - new Date(openUTC);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // ---- Update live duration if session exists ----
  useEffect(() => {
    if (!session) return;
    const openUTC = session.open_time;
    const closeUTC = session.close_time || session.server_now;
    setLiveDuration(calculateDuration(openUTC, closeUTC));

    if (!session.close_time) {
      const interval = setInterval(() => {
        setLiveDuration(calculateDuration(openUTC, session.server_now));
      }, 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [session]);

  // ---- Handle Day Change ----
  const handleDayChange = (e) => {
    const pickedDate = e.target.value; // YYYY-MM-DD
    setSelectedDate(pickedDate);
    fetchDailyData(pickedDate);
  };


  return (
    <div className="income-page max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 break-words max-w-full">
        {reportDate} Daily Employee Report
      </h1>

      {/* Day Picker */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Pick a day:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDayChange}
          className="border rounded p-2"
        />
      </div>

      {myServices.length > 0 ? (
        <>
          {/* Summary */}
          <section className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">{reportDate}</h2>
            <p>
              <span className="font-medium">Total Salary:</span> {totalSalary.toLocaleString()} UGX
            </p>
            <p>
              <span className="font-medium">Total Advances:</span> {totalAdvancesAmount.toLocaleString()} UGX
            </p>
            <p>
              <span className="font-medium">Total Tag Fees:</span> {totalTagFees.toLocaleString()} UGX
            </p>
            <p>
              <span className="font-medium">Total Late Fees:</span> {totalLateFees.toLocaleString()} UGX
            </p>
            <p>
              <span className="font-medium">Net Salary:</span> {netSalary.toLocaleString()} UGX
            </p>
          </section>

          {/* Services Table */}
          <section className="w-full bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">My Services</h2>
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto border border-gray-300 rounded">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-blue-700 text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left">No.</th>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Role Amount</th>
                    <th className="px-3 py-2 text-left">Time</th>
                    <th className="px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myServices.map((s, idx) => {
                    // Determine amount for this employee
                    let roleAmount = 0;
                    if (s.barber_id === user.id) roleAmount = s.barber_amount;
                    else if (s.barber_assistant_id === user.id) roleAmount = s.barber_assistant_amount;
                    else if (s.scrubber_assistant_id === user.id) roleAmount = s.scrubber_assistant_amount;
                    else if (s.black_shampoo_assistant_id === user.id) roleAmount = s.black_shampoo_assistant_amount;
                    else if (s.super_black_assistant_id === user.id) roleAmount = s.super_black_assistant_amount;
                    else if (s.black_mask_assistant_id === user.id) roleAmount = s.black_mask_assistant_amount;

                    return (
                      <tr key={s.id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-3 py-2">{idx + 1}</td>
                        <td className="px-3 py-2">{s.name}</td>
                        <td className="px-3 py-2">{roleAmount}</td>
                        <td className="px-3 py-2">{formatEAT(s.service_timestamp)}</td>
                        <td className="px-3 py-2">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                            onClick={() => handleEditClick(s.id)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <p>Not Worked on Any One Yet</p>
      )}
    </div>
  );
};

export default EmployeeDailyReport;
