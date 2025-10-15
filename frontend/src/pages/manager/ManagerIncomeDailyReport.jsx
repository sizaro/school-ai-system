import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext.jsx";
import "../../styles/IncomeDailyReport.css";

const ManagerIncomeDailyReport = () => {
  const { services, employees, advances, expenses, sessions, fetchDailyData } = useData();

  const today = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const reportDate = today.toLocaleDateString("en-US", options);

  const session = sessions && sessions.length > 0 ? sessions[0] : null;
  const [liveDuration, setLiveDuration] = useState("");
  const [selectedDate, setSelectedDate] = useState(today.toLocaleDateString("en-CA")); 

  // ---- Totals Calculation ----
  const calculateTotals = (services, expenses, advances) => {
    const grossIncome = services.reduce(
      (sum, s) => sum + (parseInt(s.service_amount, 10) || 0),
      0
    );

    const employeesSalary = services.reduce((sum, s) => {
      return (
        sum +
        (parseInt(s.barber_amount, 10) || 0) +
        (parseInt(s.barber_assistant_amount, 10) || 0) +
        (parseInt(s.scrubber_assistant_amount, 10) || 0) +
        (parseInt(s.black_shampoo_assistant_amount, 10) || 0) +
        (parseInt(s.super_black_assistant_amount, 10) || 0) +
        (parseInt(s.black_mask_assistant_amount, 10) || 0)
      );
    }, 0);

    const totalExpenses = expenses.reduce(
      (sum, e) => sum + (parseInt(e.amount, 10) || 0),
      0
    );

    const totalAdvances = advances.reduce(
      (sum, a) => sum + (parseInt(a.amount, 10) || 0),
      0
    );

    const netEmployeeSalary = employeesSalary - totalAdvances;
    const netIncome = grossIncome - (totalExpenses + netEmployeeSalary);
    const cashAtHand = netIncome + netEmployeeSalary;

    return { grossIncome, employeesSalary, totalExpenses, totalAdvances, netEmployeeSalary, netIncome, cashAtHand };
  };

  const { grossIncome, employeesSalary, totalExpenses, totalAdvances, netEmployeeSalary, netIncome, cashAtHand } =
    calculateTotals(services, expenses, advances);

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

  // ---- On Page Load: Fetch Today’s Data ----
  useEffect(() => {
    fetchDailyData(selectedDate);
  }, []);

  return (
    <div className="income-page max-w-4xl mx-auto p-4 overflow-y-hidden">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 break-words max-w-full">
        {reportDate} Daily Income Report
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

      {/* Summary Section */}
      {session ? (
        <>
          <section className="bg-white shadow-md rounded-lg p-4 mb-6 w-full max-w-4xl">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">{reportDate}</h2>
            <p><span className="font-medium">Opened:</span> {formatEAT(session.open_time)}</p>
            <p><span className="font-medium">Closed:</span> {session.close_time ? formatEAT(session.close_time) : "N/A"}</p>
            <p><span className="font-medium">Duration:</span> {liveDuration} {!session.close_time && "(Counting...)"}</p>
          </section>

          <section className="bg-white shadow-md rounded-lg p-4 mb-6 w-full max-w-4xl">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Summary</h2>
            <p><span className="font-medium">Gross Income:</span> {grossIncome.toLocaleString()} UGX</p>
            <p><span className="font-medium">Employees Salary:</span> {employeesSalary.toLocaleString()} UGX</p>
            <p><span className="font-medium">Expenses:</span> {totalExpenses.toLocaleString()} UGX</p>
            <p><span className="font-medium">Advances:</span> {totalAdvances.toLocaleString()} UGX</p>
            <p><span className="font-medium">Net Employees Salary:</span> {netEmployeeSalary.toLocaleString()} UGX</p>
            <p><span className="font-medium">Salon Net Income:</span> {netIncome.toLocaleString()} UGX</p>
            <p><span className="font-medium">Total Cash Available:</span> {cashAtHand.toLocaleString()} UGX</p>
          </section>

          {/* Services Table Section */}
          <section className="w-full max-w-screen-xl mx-auto bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Services Rendered</h2>
            <div className=" w-full overflow-x-auto max-h-[60vh] overflow-y-auto border border-gray-300 rounded">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-blue-700 text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left">No.</th>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Service Amount</th>
                    <th className="px-3 py-2 text-left">Salon Amount</th>
                    <th className="px-3 py-2 text-left">Barber</th>
                    <th className="px-3 py-2 text-left">Barber Amount</th>
                    <th className="px-3 py-2 text-left">Aesthetician</th>
                    <th className="px-3 py-2 text-left">Aesthetician Amount</th>
                    <th className="px-3 py-2 text-left">Scrub Aesthetician</th>
                    <th className="px-3 py-2 text-left">Scrubber Amount</th>
                    <th className="px-3 py-2 text-left">Black Shampoo Aesthetician</th>
                    <th className="px-3 py-2 text-left">Black Shampoo Aesthetician Amount</th>
                    <th className="px-3 py-2 text-left">Black Shampoo Amount</th>
                    <th className="px-3 py-2 text-left">Super Black Aesthetician</th>
                    <th className="px-3 py-2 text-left">Super Black Aesthetician Amount</th>
                    <th className="px-3 py-2 text-left">Super Black Amount</th>
                    <th className="px-3 py-2 text-left">Black Mask Aesthetician</th>
                    <th className="px-3 py-2 text-left">Black Mask Aesthetician Amount</th>
                    <th className="px-3 py-2 text-left">Black Mask Amount</th>
                    <th className="px-3 py-2 text-left">Time of Service</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr
                      key={service.id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-3 py-2">{index + 1}</td>
                      <td className="px-3 py-2">{service.name}</td>
                      <td className="px-3 py-2">{service.service_amount}</td>
                      <td className="px-3 py-2">{service.salon_amount}</td>
                      <td className="px-3 py-2">{service.barber}</td>
                      <td className="px-3 py-2">{service.barber_amount}</td>
                      <td className="px-3 py-2">{service.barber_assistant || "-"}</td>
                      <td className="px-3 py-2">{service.barber_assistant_amount}</td>
                      <td className="px-3 py-2">{service.scrubber_assistant || "-"}</td>
                      <td className="px-3 py-2">{service.scrubber_assistant_amount}</td>
                      <td className="px-3 py-2">{service.black_shampoo_assistant || "-"}</td>
                      <td className="px-3 py-2">{service.black_shampoo_assistant_amount || "-"}</td>
                      <td className="px-3 py-2">{service.black_shampoo_amount}</td>
                      <td className="px-3 py-2">{service.super_black_assistant || "-"}</td>
                      <td className="px-3 py-2">{service.super_black_assistant_amount || "-"}</td>
                      <td className="px-3 py-2">{service.super_black_amount}</td>
                      <td className="px-3 py-2">{service.black_mask_assistant || "-"}</td>
                      <td className="px-3 py-2">{service.black_mask_assistant_amount || "-"}</td>
                      <td className="px-3 py-2">{service.black_mask_amount}</td>
                      <td className="px-3 py-2">{formatEAT(service.service_timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <p>Salon not open today yet</p>
      )}
    </div>
  );
};

export default ManagerIncomeDailyReport;
