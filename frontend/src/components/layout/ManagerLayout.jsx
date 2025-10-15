import { Routes, Route } from "react-router-dom";

// Income Reports
import ManagerIncomeDailyReport from "../../pages/manager/ManagerIncomeDailyReport.jsx";
import ManagerIncomeWeeklyReport from "../../pages/manager/ManagerIncomeWeeklyReport.jsx";
import ManagerIncomeMonthlyReport from "../../pages/manager/ManagerIncomeMonthlyReport.jsx";
import ManagerIncomeYearlyReport from "../../pages/manager/ManagerIncomeYearlyReport.jsx";

// Expenses Reports
import ManagerExpensesDailyReport from "../../pages/manager/ManagerExpensesDailyReport.jsx";
import ManagerExpensesWeeklyReport from "../../pages/manager/ManagerExpensesWeeklyReport.jsx";
import ManagerExpensesMonthlyReport from "../../pages/manager/ManagerExpensesMonthlyReport.jsx";
import ManagerExpensesYearlyReport from "../../pages/manager/ManagerExpensesYearlyReport.jsx";

// Employees and Advances
import ManagerEmployees from "../../pages/manager/ManagerManageStaff.jsx";
import ManagerAdvances from "../../pages/manager/ManagerAdvances.jsx";

// Staff Performance
import ManagerStaffDailyReport from "../../pages/manager/ManagerStaffDailyReport.jsx";
import ManagerStaffWeeklyReport from "../../pages/manager/ManagerStaffWeeklyReport.jsx";
import ManagerStaffMonthlyReport from "../../pages/manager/ManagerStaffMonthlyReport.jsx";
import ManagerStaffYearlyReport from "../../pages/manager/ManagerStaffYearlyReport.jsx";

// Layout Components
import ManagerSidebar from "../../components/sidebars/ManagerSidebar.jsx";
import ManagerDashboard from "../../pages/manager/ManagerDashboard.jsx";

const ManagerLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <ManagerSidebar />
      <main className="flex-1 p-6 overflow-y-auto ml-65">
        <Routes>
          <Route index element={<ManagerDashboard />} />
          <Route path="ManagerDashboard" element={<ManagerDashboard />} />

          {/* Income Reports */}
          <Route path="/income/daily" element={<ManagerIncomeDailyReport />} />
          <Route path="/pages/manager/ManagerWeeklyIncomeReport" element={<ManagerIncomeWeeklyReport />} />
          <Route path="/pages/manager/ManagerMonthlyIncomeReport" element={<ManagerIncomeMonthlyReport />} />
          <Route path="/pages/manager/ManagerYearlyIncomeReport" element={<ManagerIncomeYearlyReport />} />

          {/* Expenses Reports */}
          <Route path="expenses/daily" element={<ManagerExpensesDailyReport />} />
          <Route path="/pages/manager/ManagerExpensesWeeklyReport" element={<ManagerExpensesWeeklyReport />} />
          <Route path="/pages/manager/ManagerExpensesMonthlyReport" element={<ManagerExpensesMonthlyReport />} />
          <Route path="/pages/manager/ManagerExpensesYearlyReport" element={<ManagerExpensesYearlyReport />} />

          {/* Employees & Advances */}
          <Route path="employees" element={<ManagerEmployees />} />
          <Route path="advances" element={<ManagerAdvances />} />

          {/* Staff Performance */}
          <Route path="report/daily" element={<ManagerStaffDailyReport />} />
          <Route path="/pages/manager/ManagerStaffWeeklyPerformance" element={<ManagerStaffWeeklyReport />} />
          <Route path="/pages/manager/ManagerStaffMonthlyPerformance" element={<ManagerStaffMonthlyReport />} />
          <Route path="/pages/manager/ManagerStaffYearlyPerformance" element={<ManagerStaffYearlyReport />} />
        </Routes>
      </main>
    </div>
  );
};

export default ManagerLayout;
