import { Routes, Route } from "react-router-dom";
import EmployeeSidebar from "../sidebars/EmployeeSidebar.jsx";

import EmployeeDashboard from "../../pages/employee/EmployeeDashboard.jsx";

// Income Reports
 import EmployeeIncomeDailyReport from "../../pages/employee/EmployeeIncomeDailyReport.jsx";
// import EmployeeIncomeWeeklyReport from "../../pages/employee/EmployeeIncomeWeeklyReport.jsx";
// import EmployeeIncomeMonthlyReport from "../../pages/employee/EmployeeIncomeMonthlyReport.jsx";
// import EmployeeIncomeYearlyReport from "../../pages/employee/EmployeeIncomeYearlyReport.jsx";

// // Advances (remain accessible)
// import EmployeeAdvances from "../../pages/employee/EmployeeAdvances.jsx";

// // Staff Performance
// import EmployeePerformanceDaily from "../../pages/employee/EmployeePerformanceDaily.jsx";
// import EmployeePerformanceWeekly from "../../pages/employee/EmployeePerformanceWeekly.jsx";
// import EmployeePerformanceMonthly from "../../pages/employee/EmployeePerformanceMonthly.jsx";
// import EmployeePerformanceYearly from "../../pages/employee/EmployeePerformanceYearly.jsx";

// // Late Fees Reports
// import EmployeeLateFeesDailyReport from "../../pages/employee/EmployeeLateFeesDailyReport.jsx";
// import EmployeeLateFeesWeeklyReport from "../../pages/employee/EmployeeLateFeesWeeklyReport.jsx";
// import EmployeeLateFeesMonthlyReport from "../../pages/employee/EmployeeLateFeesMonthlyReport.jsx";
// import EmployeeLateFeesYearlyReport from "../../pages/employee/EmployeeLateFeesYearlyReport.jsx";

// // Tag Fees Reports
// import EmployeeTagFeesDailyReport from "../../pages/employee/EmployeeTagFeesDailyReport.jsx";
// import EmployeeTagFeesWeeklyReport from "../../pages/employee/EmployeeTagFeesWeeklyReport.jsx";
// import EmployeeTagFeesMonthlyReport from "../../pages/employee/EmployeeTagFeesMonthlyReport.jsx";
// import EmployeeTagFeesYearlyReport from "../../pages/employee/EmployeeTagFeesYearlyReport.jsx";

const EmployeeLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <EmployeeSidebar />
      <main className="flex-1 p-6 overflow-y-auto w-full mt-15 ml-0 md:ml-64 sm:mt-6">
        <Routes>
          {/* Dashboard */}
          <Route index element={<EmployeeDashboard />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />

          {/* Income Reports */}
          <Route path="income/daily" element={<EmployeeIncomeDailyReport />} />
          {/* <Route path="income/weekly" element={<EmployeeIncomeWeeklyReport />} />
          <Route path="income/monthly" element={<EmployeeIncomeMonthlyReport />} />
          <Route path="income/yearly" element={<EmployeeIncomeYearlyReport />} />

          {/* Advances *
          <Route path="advances" element={<EmployeeAdvances />} />

          {/* Performance Reports *
          <Route path="report/daily" element={<EmployeePerformanceDaily />} />
          <Route path="report/weekly" element={<EmployeePerformanceWeekly />} />
          <Route path="report/monthly" element={<EmployeePerformanceMonthly />} />
          <Route path="report/yearly" element={<EmployeePerformanceYearly />} />

          {/* Late Fees Reports *
          <Route path="late-fees/daily" element={<EmployeeLateFeesDailyReport />} />
          <Route path="late-fees/weekly" element={<EmployeeLateFeesWeeklyReport />} />
          <Route path="late-fees/monthly" element={<EmployeeLateFeesMonthlyReport />} />
          <Route path="late-fees/yearly" element={<EmployeeLateFeesYearlyReport />} />

          {/* Tag Fees Reports *
          <Route path="tag-fees/daily" element={<EmployeeTagFeesDailyReport />} />
          <Route path="tag-fees/weekly" element={<EmployeeTagFeesWeeklyReport />} />
          <Route path="tag-fees/monthly" element={<EmployeeTagFeesMonthlyReport />} />
          <Route path="tag-fees/yearly" element={<EmployeeTagFeesYearlyReport />} /> */}
        </Routes>
      </main>
    </div>
  );
};

export default EmployeeLayout;
