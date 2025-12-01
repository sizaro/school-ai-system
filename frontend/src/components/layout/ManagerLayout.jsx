// src/layouts/ManagerLayout.jsx
import { Routes, Route } from "react-router-dom";
import ManagerSidebar from "../sidebars/ManagerSidebar.jsx";

// Pages (Manager Equivalents)
import ManagerDashboard from "../../pages/manager/ManagerDashboard.jsx";
import IncomeReport from "../../pages/manager/ManagerIncomeReport.jsx";
import ExpensesReport from "../../pages/manager/ManagerExpensesReport.jsx";
import EmployeeReport from "../../pages/manager/ManagerEmployeeReport.jsx";
import Employees from "../../pages/manager/ManagerEmployees.jsx";
import Advances from "../../pages/manager/ManagerAdvances.jsx";
import StaffPerformance from "../../pages/manager/ManagerStaffReport.jsx";
import LateFeesReport from "../../pages/manager/ManagerLateFeesReport.jsx";
import TagFeesReport from "../../pages/manager/ManagerTagFeesReport.jsx";

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
          <Route path="income-report" element={<IncomeReport />} />

          {/* Expenses Reports */}
          <Route path="expenses-report" element={<ExpensesReport />} />

          {/* Employees & Advances */}
          <Route path="employees" element={<EmployeeReport />} />
          <Route path="advances" element={<Advances />} />
          <Route path="employees-management" element={<Employees />} />
          <Route path="employee-report" element={<EmployeeReport />} />

          {/* Staff Performance */}
          <Route path="staff-performance" element={<StaffPerformance />} />

          {/* Late Fees Reports */}
          <Route path="late-fees-report" element={<LateFeesReport />} />

          {/* Tag Fees Reports */}
          <Route path="tag-fees-report" element={<TagFeesReport />} />

        </Routes>
      </main>
    </div>
  );
};

export default ManagerLayout;
