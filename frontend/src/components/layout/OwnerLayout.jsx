import { Routes, Route } from "react-router-dom";
// Income Reports
import OwnerIncomeDailyReport from "../../pages/owner/OwnerIncomeDailyReport.jsx";
import OwnerIncomeWeeklyReport from "../../pages/owner/OwnerIncomeWeeklyReport.jsx";
import OwnerIncomeMonthlyReport from "../../pages/owner/OwnerIncomeMonthlyReport.jsx";
import OwnerIncomeYearlyReport from "../../pages/owner/OwnerIncomeYearlyReport.jsx";

// Expenses Reports
import OwnerExpensesDailyReport from "../../pages/owner/OwnerExpensesDailyReport.jsx";
import OwnerExpensesWeeklyReport from "../../pages/owner/OwnerExpensesWeeklyReport.jsx";
import OwnerExpensesMonthlyReport from "../../pages/owner/OwnerExpensesMonthlyReport.jsx";
import OwnerExpensesYearlyReport from "../../pages/owner/OwnerExpensesYearlyReport.jsx";

// Employees and Advances
import OwnerEmployees from "../../pages/owner/OwnerEmployees.jsx";
import OwnerAdvances from "../../pages/owner/OwnerAdvances.jsx";

// Staff Performance
import OwnerStaffDailyPerformance from "../../pages/owner/OwnerStaffDailyPerfomance.jsx";
import OwnerStaffWeeklyPerformance from "../../pages/owner/OwnerStaffWeeklyPerformance.jsx";
import OwnerStaffMonthlyPerformance from "../../pages/owner/OwnerStaffMonthlyPerformance.jsx";
import OwnerStaffYearlyPerformance from "../../pages/owner/OwnerStaffYearlyPerformance.jsx";

const OwnerLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <OwnerSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="/pages/owner/OwnerDashboard" element={<OwnerDashboard />} />
          <Route path="/pages/owner/OwnerDailyIncomeReport" element={<OwnerIncomeDailyReport />} />
          <Route path="/pages/owner/OwnerWeeklyIncomeReport" element={<OwnerIncomeWeeklyReport />} />
          <Route path="/pages/owner/OwnerMonthlyIncomeReport" element={<OwnerIncomeMonthlyReport />} />
          <Route path="/pages/owner/OwnerYearlyIncomeReport" element={<OwnerIncomeYearlyReport />} />

            {/* Expenses Reports */}
      <Route path="/pages/owner/OwnerExpensesDailyReport" element={<OwnerExpensesDailyReport />} />
      <Route path="/pages/owner/OwnerExpensesWeeklyReport" element={<OwnerExpensesWeeklyReport />} />
      <Route path="/pages/owner/OwnerExpensesMonthlyReport" element={<OwnerExpensesMonthlyReport />} />
      <Route path="/pages/owner/OwnerExpensesYearlyReport" element={<OwnerExpensesYearlyReport />} />

      {/* Employees & Advances */}
      <Route path="/pages/owner/OwnerEmployees" element={<OwnerEmployees />} />
      <Route path="/pages/owner/OwnerAdvances" element={<OwnerAdvances />} />

      {/* Worker Performance */}
      <Route path="/pages/owner/OwnerStaffDailyPerformance" element={<OwnerStaffDailyPerformance />} />
      <Route path="/pages/owner/OwnerStaffWeeklyPerformance" element={<OwnerStaffWeeklyPerformance />} />
      <Route path="/pages/owner/OwnerStaffMonthlyPerformance" element={<OwnerStaffMonthlyPerformance />} />
      <Route path="/pages/owner/OwnerStaffYearlyPerformance" element={<OwnerStaffYearlyPerformance />} /> 
    </Routes>
      </main>
    </div>
  );
};

export default OwnerLayout;
