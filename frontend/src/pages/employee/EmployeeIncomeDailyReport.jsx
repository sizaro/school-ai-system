import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext.jsx";
import "../../styles/IncomeDailyReport.css";

const EmployeeIncomeDailyReport = () => {
  const {
    services,
    lateFees,
    tagFees,
    advances,
    sessions,
    fetchDailyData,
    user,
    fetchUser
  } = useData();

  const today = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const reportDate = today.toLocaleDateString("en-US", options);

  const session = sessions && sessions.length > 0 ? sessions[0] : null;
  const [liveDuration, setLiveDuration] = useState("");
  const [selectedDate, setSelectedDate] = useState(today.toLocaleDateString("en-CA"));

  // ---- Filter Services and Fees for Current User Only ----
  const filteredServices = services.filter(
    s =>
      s.barber_id === user?.id ||
      s.barber_assistant_id === user?.id ||
      s.scrubber_assistant_id === user?.id ||
      s.black_shampoo_assistant_id === user?.id ||
      s.super_black_assistant_id === user?.id ||
      s.black_mask_assistant_id === user?.id
  );

  const filteredAdvances = advances.filter(a => a.employee_id === user?.id);
  const filteredTagFees = tagFees.filter(t => t.employee_id === user?.id);
  const filteredLateFees = lateFees.filter(l => l.employee_id === user?.id);
  
  

  // ---- Totals Calculation Only for Current User ----
  const calculateUserTotals = (services, advances, tagFees, lateFees, userId) => {
    const grossSalary = filteredServices.reduce((sum, s) => {
      let amt = 0;
      if (s.barber_id === userId) amt += parseInt(s.barber_amount, 10) || 0;
      if (s.barber_assistant_id === userId) amt += parseInt(s.barber_assistant_amount, 10) || 0;
      if (s.scrubber_assistant_id === userId) amt += parseInt(s.scrubber_assistant_amount, 10) || 0;
      if (s.black_shampoo_assistant_id === userId) amt += parseInt(s.black_shampoo_assistant_amount, 10) || 0;
      if (s.super_black_assistant_id === userId) amt += parseInt(s.super_black_assistant_amount, 10) || 0;
      if (s.black_mask_assistant_id === userId) amt += parseInt(s.black_mask_assistant_amount, 10) || 0;
      return sum + amt;
    }, 0);

    const totalAdvances = advances.reduce((sum, a) => sum + (parseInt(a.amount, 10) || 0), 0);
    const totalLateFees = lateFees.reduce((sum, l) => sum + (parseInt(l.amount, 10) || 0), 0);
    const totalTagFees = tagFees.reduce((sum, t) => sum + (parseInt(t.amount, 10) || 0), 0);
    

    const netSalary = grossSalary - (totalAdvances + totalLateFees + totalTagFees);

    return { grossSalary, totalAdvances, totalLateFees, totalTagFees, netSalary };
  };

  const { grossSalary, totalAdvances, totalLateFees, totalTagFees, netSalary } = 
    calculateUserTotals(filteredServices, filteredAdvances, filteredTagFees, filteredLateFees, user?.id);

  // ---- Format UTC Date to EAT ----
  const formatEAT = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-UG", {
      timeZone: "Africa/Kampala",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ---- Duration Calculation ----
  const calculateDuration = (openUTC, closeUTC) => {
    if (!openUTC || !closeUTC) return "N/A";
    const diffMs = new Date(closeUTC) - new Date(openUTC);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

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
    const pickedDate = e.target.value;
    setSelectedDate(pickedDate);
    fetchDailyData(pickedDate);
  };

  // ---- Service Count Summary ----
  const serviceCount = filteredServices.reduce((acc, service) => {
    const name = service.name || "Unknown";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});


  useEffect(() => {
      fetchDailyData(selectedDate);
    }, []);

  return (
    <div className="income-page max-w-6xl mx-auto p-4 overflow-y-hidden">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 break-words max-w-full">
        {reportDate} Daily Income Report
      </h1>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Pick a day:</label>
        <input type="date" value={selectedDate} onChange={handleDayChange} className="border rounded p-2" />
      </div>

      {session ? (
        <>
          {/* SESSION INFO */}
          <section className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">{reportDate}</h2>
            <p><span className="font-medium">Opened:</span> {formatEAT(session.open_time)}</p>
            <p><span className="font-medium">Closed:</span> {session.close_time ? formatEAT(session.close_time) : "N/A"}</p>
            <p><span className="font-medium">Duration:</span> {liveDuration} {!session.close_time && "(Counting...)"}</p>
          </section>

          {/* SUMMARY Section */}
          <section className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Summary (Your Earnings)</h2>
            <div className="flex flex-wrap gap-4">

              <div className="flex flex-col justify-center items-center bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-4 w-[calc(33.333%-1rem)] min-w-[180px] flex-grow">
                <span className="font-medium text-gray-700">Gross Salary</span>
                <span className="text-red-600 text-xl font-bold">{grossSalary.toLocaleString()} UGX</span>
              </div>
              <div className="flex flex-col justify-center items-center bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-4 w-[calc(33.333%-1rem)] min-w-[180px] flex-grow">
                <span className="font-medium text-gray-700">Total Advances</span>
                <span className="text-red-600 text-xl font-bold">{totalAdvances.toLocaleString()} UGX</span>
              </div>
              <div className="flex flex-col justify-center items-center bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-4 w-[calc(33.333%-1rem)] min-w-[180px] flex-grow">
                <span className="font-medium text-gray-700">Total Tag Fees</span>
                <span className="text-red-600 text-xl font-bold">{totalTagFees.toLocaleString()} UGX</span>
              </div>
              <div className="flex flex-col justify-center items-center bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-4 w-[calc(33.333%-1rem)] min-w-[180px] flex-grow">
                <span className="font-medium text-gray-700">Total Late Fees</span>
                <span className="text-red-600 text-xl font-bold">{totalLateFees.toLocaleString()} UGX</span>
              </div>
              <div className="flex flex-col justify-center items-center bg-blue-100 border border-blue-300 rounded-lg shadow-md p-4 w-[calc(33.333%-1rem)] min-w-[180px] flex-grow">
                <span className="font-semibold text-gray-800">Net Salary</span>
                <span className="text-green-700 text-xl font-bold">{netSalary.toLocaleString()} UGX</span>
              </div>
            </div>
          </section>

          {/* SERVICES COUNT SECTION */}
          <section className="w-full bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Service Summary (By Count)</h2>
            <div className="flex flex-wrap gap-4">
              {Object.entries(serviceCount).map(([name, count]) => (
                <div key={name} className="flex flex-col justify-center items-center bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-4 w-[calc(25%-1rem)] min-w-[150px] flex-grow">
                  <span className="font-semibold text-gray-800 text-lg text-center">{name}</span>
                  <span className="text-blue-700 text-2xl font-bold">{count}</span>
                </div>
              ))}
            </div>
          </section>

          {/* SERVICES TABLE */}
          <section className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Services Rendered</h2>
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto border border-gray-300 rounded">
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
                  {filteredServices.length > 0 ? (
                    filteredServices.map((s, index) => (
                      <tr key={s.id} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2">{s.name}</td>
                        <td className="px-3 py-2">{s.service_amount}</td>
                        <td className="px-3 py-2">{s.salon_amount}</td>
                        <td className="px-3 py-2">{s.barber}</td>
                        <td className="px-3 py-2">{s.barber_amount}</td>
                        <td className="px-3 py-2">{s.barber_assistant}</td>
                        <td className="px-3 py-2">{s.barber_assistant_amount}</td>
                        <td className="px-3 py-2">{s.scrubber_assistant}</td>
                        <td className="px-3 py-2">{s.scrubber_assistant_amount}</td>
                        <td className="px-3 py-2">{s.black_shampoo_assistant}</td>
                        <td className="px-3 py-2">{s.black_shampoo_assistant_amount}</td>
                        <td className="px-3 py-2">{s.black_shampoo_amount}</td>
                        <td className="px-3 py-2">{s.super_black_assistant}</td>
                        <td className="px-3 py-2">{s.super_black_assistant_amount}</td>
                        <td className="px-3 py-2">{s.super_black_amount}</td>
                        <td className="px-3 py-2">{s.black_mask_assistant}</td>
                        <td className="px-3 py-2">{s.black_mask_assistant_amount}</td>
                        <td className="px-3 py-2">{s.black_mask_amount}</td>
                        <td className="px-3 py-2">{formatEAT(s.service_timestamp)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="20" className="text-center py-4">
                        No services found for this employee today
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <p className="text-red-600 font-medium">No session data available.</p>
      )}
    </div>
  );
};

export default EmployeeIncomeDailyReport;
