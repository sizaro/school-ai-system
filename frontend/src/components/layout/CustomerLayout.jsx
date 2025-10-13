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

const CustomerLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <h1 />
      <main className="flex-1 p-6 overflow-y-auto">
      </main>
    </div>
  );
};

export default CustomerLayout;
