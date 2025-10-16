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
      <main className="flex-1 p-6 overflow-y-auto w-full mt-15 ml-0 md:ml-64 sm:mt-6">
        <Routes>
          {/* Dashboard */}
          <Route index element={<ManagerDashboard />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          {/* Income Reports */}
          <Route path="income/daily" element={<ManagerIncomeDailyReport />} />
          <Route path="income/weekly" element={<ManagerIncomeWeeklyReport />} />
          <Route path="income/monthly" element={<ManagerIncomeMonthlyReport />} />
          <Route path="income/yearly" element={<ManagerIncomeYearlyReport />} />

          {/* Expenses Reports */}
          <Route path="expenses/daily" element={<ManagerExpensesDailyReport />} />
          <Route path="expenses/weekly" element={<ManagerExpensesWeeklyReport />} />
          <Route path="expenses/monthly" element={<ManagerExpensesMonthlyReport />} />
          <Route path="expenses/yearly" element={<ManagerExpensesYearlyReport />} />

          {/* Employees & Advances */}
          <Route path="employees" element={<ManagerEmployees />} />
          <Route path="advances" element={<ManagerAdvances />} />

          {/* Staff Performance */}
          <Route path="report/daily" element={<ManagerStaffDailyReport />} />
          <Route path="report/weekly" element={<ManagerStaffWeeklyReport />} />
          <Route path="report/monthly" element={<ManagerStaffMonthlyReport />} />
          <Route path="report/yearly" element={<ManagerStaffYearlyReport />} />
        </Routes>
      </main>
    </div>
  );
};

export default ManagerLayout;
