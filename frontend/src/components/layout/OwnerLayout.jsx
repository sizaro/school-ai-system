import { Routes, Route } from "react-router-dom";
import OwnerSidebar from "../sidebars/OwnerSidebar.jsx";

import OwnerDashboard from "../../pages/owner/OwnerDashboard.jsx";

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
import OwnerStaffDailyReport from "../../pages/owner/OwnerStaffDailyReport.jsx";
import OwnerStaffWeeklyReport from "../../pages/owner/OwnerStaffWeeklyReport.jsx";
import OwnerStaffMonthlyReport from "../../pages/owner/OwnerStaffMonthlyReport.jsx";
import OwnerStaffYearlyReport from "../../pages/owner/OwnerStaffYearlyReport.jsx";

// Late Fees Reports
import OwnerLateFeesDailyReport from "../../pages/owner/OwnerLateFeesDailyReport.jsx";
import OwnerLateFeesWeeklyReport from "../../pages/owner/OwnerLateFeesWeeklyReport.jsx";
import OwnerLateFeesMonthlyReport from "../../pages/owner/OwnerLateFeesMonthlyReport.jsx";
import OwnerLateFeesYearlyReport from "../../pages/owner/OwnerLateFeesYearlyReport.jsx";

// Tag Fees Reports
import OwnerTagFeesDailyReport from "../../pages/owner/OwnerTagFeesDailyReport.jsx";
import OwnerTagFeesWeeklyReport from "../../pages/owner/OwnerTagFeesWeeklyReport.jsx";
import OwnerTagFeesMonthlyReport from "../../pages/owner/OwnerTagFeesMonthlyReport.jsx";
import OwnerTagFeesYearlyReport from "../../pages/owner/OwnerTagFeesYearlyReport.jsx";

const OwnerLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <OwnerSidebar />
      <main className="flex-1 p-6 overflow-y-auto w-full mt-15 ml-0 md:ml-64 sm:mt-6">
        <Routes>
          {/* Dashboard */}
          <Route index element={<OwnerDashboard />} />
          <Route path="dashboard" element={<OwnerDashboard />} />

          {/* Income Reports */}
          <Route path="income/daily" element={<OwnerIncomeDailyReport />} />
          <Route path="income/weekly" element={<OwnerIncomeWeeklyReport />} />
          <Route path="income/monthly" element={<OwnerIncomeMonthlyReport />} />
          <Route path="income/yearly" element={<OwnerIncomeYearlyReport />} />

          {/* Expenses Reports */}
          <Route path="expenses/daily" element={<OwnerExpensesDailyReport />} />
          <Route path="expenses/weekly" element={<OwnerExpensesWeeklyReport />} />
          <Route path="expenses/monthly" element={<OwnerExpensesMonthlyReport />} />
          <Route path="expenses/yearly" element={<OwnerExpensesYearlyReport />} />

          {/* Employees & Advances */}
          <Route path="employees" element={<OwnerEmployees />} />
          <Route path="advances" element={<OwnerAdvances />} />

          {/* Worker Performance */}
          <Route path="report/daily" element={<OwnerStaffDailyReport />} />
          <Route path="report/weekly" element={<OwnerStaffWeeklyReport />} />
          <Route path="report/monthly" element={<OwnerStaffMonthlyReport />} />
          <Route path="report/yearly" element={<OwnerStaffYearlyReport />} />

          {/* Late Fees Reports */}
          <Route path="late-fees/daily" element={<OwnerLateFeesDailyReport />} />
          <Route path="late-fees/weekly" element={<OwnerLateFeesWeeklyReport />} />
          <Route path="late-fees/monthly" element={<OwnerLateFeesMonthlyReport />} />
          <Route path="late-fees/yearly" element={<OwnerLateFeesYearlyReport />} />

          {/* Tag Fees Reports */}
          <Route path="tag-fees/daily" element={<OwnerTagFeesDailyReport />} />
          <Route path="tag-fees/weekly" element={<OwnerTagFeesWeeklyReport />} />
          <Route path="tag-fees/monthly" element={<OwnerTagFeesMonthlyReport />} />
          <Route path="tag-fees/yearly" element={<OwnerTagFeesYearlyReport />} />
        </Routes>
      </main>
    </div>
  );
};

export default OwnerLayout;
