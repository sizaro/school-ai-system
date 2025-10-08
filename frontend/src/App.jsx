import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';

// Dashboard
import Dashboard from './pages/Dashboard';

// Income Reports
import IncomeDailyReport from './pages/IncomeDailyReport';
import IncomeWeeklyReport from './pages/IncomeWeeklyReport';
import IncomeMonthlyReport from './pages/IncomeMonthlyReport';
import IncomeYearlyReport from './pages/IncomeYearlyReport';

// Expenses Reports
import ExpensesDailyReport from './pages/ExpensesDailyReport';
import ExpensesWeeklyReport from './pages/ExpensesWeeklyReport';
import ExpensesMonthlyReport from './pages/ExpensesMonthlyReport';
import ExpensesYearlyReport from './pages/ExpensesYearlyReport';

// Work Performance Reports
import WorkDailyReport from './pages/WorkDailyReport';
import WorkWeeklyReport from './pages/WorkWeeklyReport';
import WorkMonthlyReport from './pages/WorkMonthlyReport';
import WorkYearlyReport from './pages/WorkYearlyReport';
import Employees from './pages/Employees';
import Advances from './pages/Advances'


function App() {
  return (
    <div className="flex overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 p-6 pt-18 md:pt-6 md:ml-64 overflow-x-hidden">
        <Routes>
  <Route path="/" element={<Dashboard />} />

  {/* Income Reports */}
  <Route path="/pages/IncomeDailyReport" element={<IncomeDailyReport />} />
  <Route path="/pages/IncomeWeeklyReport" element={<IncomeWeeklyReport />} />
  <Route path="/pages/IncomeMonthlyReport" element={<IncomeMonthlyReport />} />
  <Route path="/pages/IncomeYearlyReport" element={<IncomeYearlyReport />} />

  {/* Expenses Reports */}
  <Route path="/pages/ExpensesDailyReport" element={<ExpensesDailyReport />} />
  <Route path="/pages/ExpensesWeeklyReport" element={<ExpensesWeeklyReport />} />
  <Route path="/pages/ExpensesMonthlyReport" element={<ExpensesMonthlyReport />} />
  <Route path="/pages/ExpensesYearlyReport" element={<ExpensesYearlyReport />} />

   {/* Employees */}
  <Route path="/pages/Employees" element={<Employees />} />

  {/* Advances */}
  <Route path="/pages/Advances" element={<Advances />} />

  {/* Work Performance Reports */}
  <Route path="/pages/WorkDailyReport" element={<WorkDailyReport />} />
  <Route path="/pages/WorkWeeklyReport" element={<WorkWeeklyReport />} />
  <Route path="/pages/WorkMonthlyReport" element={<WorkMonthlyReport />} />
  <Route path="/pages/WorkYearlyReport" element={<WorkYearlyReport />} />
</Routes>

      </main>
    </div>
  );
}

export default App;
