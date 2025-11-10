import React, { useMemo, useState, useEffect } from "react";
import { useData } from "../../context/DataContext.jsx";

export default function OwnerStaffDailyReport() {
  const {
    services,
    users,
    advances,
    tagFees,
    lateFees,
    clockings,
    fetchDailyData,
    fetchUsers
  } = useData();

  const today = new Date().toLocaleDateString("en-CA");
  const [selectedDate, setSelectedDate] = useState(today);

  // Fetch data for today on mount
  useEffect(() => {
    fetchDailyData(selectedDate);
  }, []);

  const handleDayChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    fetchDailyData(newDate);
  };

  console.log("💈 Services:", services);
  console.log("👥 Users (raw):", users);
  console.log("💸 Advances:", advances);
  console.log("🏷️ Tag Fees:", tagFees);
  console.log("⏰ Late Fees:", lateFees);
  console.log("🕓 Clockings:", clockings);

  const employeeTotals = useMemo(() => {
    if (!users?.length) return [];

    // ✅ Only include employees and managers
    const filteredUsers = users.filter(
      (u) => u.role === "employee" || u.role === "manager"
    );

    return filteredUsers.map((user) => {
      // Salaries (based on ID matches)
      const totalSalary = services.reduce((sum, s) => {
        if (s.barber_id === user.id) sum += parseInt(s.barber_amount) || 0;
        if (s.barber_assistant_id === user.id)
          sum += parseInt(s.barber_assistant_amount) || 0;
        if (s.scrubber_assistant_id === user.id)
          sum += parseInt(s.scrubber_assistant_amount) || 0;
        if (s.black_shampoo_assistant_id === user.id)
          sum += parseInt(s.black_shampoo_assistant_amount) || 0;
        if (s.super_black_assistant_id === user.id)
          sum += parseInt(s.super_black_assistant_amount) || 0;
        if (s.black_mask_assistant_id === user.id)
          sum += parseInt(s.black_mask_assistant_amount) || 0;
        if (s.women_emp_id === user.id)
          sum += parseInt(s.women_emp_amt) || 0;
        if (s.nail_emp_id === user.id)
          sum += parseInt(s.nail_emp_amt) || 0;
        return sum;
      }, 0);

      // Advances
      const totalAdvances = advances
        .filter((a) => a.employee_id === user.id)
        .reduce((sum, a) => sum + (parseInt(a.amount) || 0), 0);

      // Tag Fees
      const totalTagFees = tagFees
        .filter((t) => t.employee_id === user.id)
        .reduce((sum, t) => sum + (parseInt(t.amount) || 0), 0);

      // Late Fees
      const totalLateFees = lateFees
        .filter((l) => l.employee_id === user.id)
        .reduce((sum, l) => sum + (parseInt(l.amount) || 0), 0);

      // Clocking
      const todayClock = clockings.find((c) => c.employee_id === user.id);
      const clockIn = todayClock ? new Date(todayClock.clock_in) : null;
      const clockOut = todayClock?.clock_out ? new Date(todayClock.clock_out) : null;

      // Time difference
      let totalHours = "-";
      if (clockIn && clockOut) {
        const diffMs = clockOut - clockIn;
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        totalHours = `${diffHrs} hrs ${diffMins} mins`;
      }

      const netSalary =
        totalSalary - (totalAdvances + totalTagFees + totalLateFees);



      return {
        name: `${user.first_name} ${user.last_name}`,
        totalSalary,
        totalAdvances,
        totalTagFees,
        totalLateFees,
        netSalary,
        clockIn,
        clockOut,
        totalHours,
      };
    });
  }, [services, advances, tagFees, lateFees, users, clockings]);

  useEffect(()=>{
    fetchUsers()
  }, [])

  if (!services.length) {
    return (
      <section className="p-6">
        <h2 className="text-xl font-bold text-center text-gray-700">
          No Recorded Work Yet
        </h2>
        <div className="mt-4 text-center">
          <label className="font-medium mr-2">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDayChange}
            className="border rounded px-2 py-1"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Workers Daily Performance
      </h2>

      <div className="mb-4">
        <label className="font-medium mr-2">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDayChange}
          className="border rounded px-2 py-1"
        />
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[60vh] border rounded">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Employee</th>
              <th className="border px-4 py-2">Clock In</th>
              <th className="border px-4 py-2">Clock Out</th>
              <th className="border px-4 py-2">Hours</th>
              <th className="border px-4 py-2 text-right">Total Salary</th>
              <th className="border px-4 py-2 text-right">Advances</th>
              <th className="border px-4 py-2 text-right">Tag Fees</th>
              <th className="border px-4 py-2 text-right">Late Fees</th>
              <th className="border px-4 py-2 text-right">Net Salary</th>
            </tr>
          </thead>
          <tbody>
            {employeeTotals.map((emp, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{idx + 1}</td>
                <td className="border px-4 py-2">{emp.name}</td>
                <td className="border px-4 py-2">
                  {emp.clockIn ? emp.clockIn.toLocaleTimeString() : "-"}
                </td>
                <td className="border px-4 py-2">
                  {emp.clockOut ? emp.clockOut.toLocaleTimeString() : "-"}
                </td>
                <td className="border px-4 py-2">{emp.totalHours}</td>
                <td className="border px-4 py-2 text-right">
                  {emp.totalSalary.toLocaleString()} UGX
                </td>
                <td className="border px-4 py-2 text-right">
                  {emp.totalAdvances.toLocaleString()} UGX
                </td>
                <td className="border px-4 py-2 text-right">
                  {emp.totalTagFees.toLocaleString()} UGX
                </td>
                <td className="border px-4 py-2 text-right">
                  {emp.totalLateFees.toLocaleString()} UGX
                </td>
                <td className="border px-4 py-2 text-right font-semibold">
                  {emp.netSalary.toLocaleString()} UGX
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
