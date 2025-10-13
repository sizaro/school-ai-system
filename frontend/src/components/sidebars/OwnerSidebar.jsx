import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function OwnerSidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [expensesOpen, setExpensesOpen] = useState(false);
  const [workersOpen, setWorkersOpen] = useState(false);

  const menuRef = useRef();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `block px-4 py-2 rounded transition-colors ${
      isActive(path) ? 'bg-gray-700 font-semibold' : 'hover:bg-gray-700'
    }`;

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Top Mobile Header */}
      <div className="md:hidden bg-gray-900 p-4 flex justify-between items-center text-white fixed top-0 left-0 right-0 z-50">
        <span className="font-bold text-lg">Salon Management</span>
        <button onClick={() => setMenuOpen(true)} className="text-2xl focus:outline-none">☰</button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen bg-gray-900 text-white fixed top-0 left-0 flex-col shadow-lg pt-16">
        <div className="px-6 font-bold text-xl mb-4">Salon Management</div>
        <div className="flex-1 overflow-y-auto px-2">
          <ul className="space-y-1 text-sm">
            <li><Link to="/pages/owner/OwnerDashboard" className={linkClass('/pages/owner/OwnerDashboard')}>Dashboard</Link></li>

            {/* Income */}
            <li>
              <div onClick={() => setIncomeOpen(!incomeOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Income Reports</span><span>{incomeOpen ? '▾' : '▸'}</span>
              </div>
              {incomeOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/pages/owner/OwnerDailyIncomeReport" className={linkClass('/pages/owner/IncomeDailyReport')}>Daily</Link></li>
                  <li><Link to="/pages/owner/OwnerWeeklyIncomeReport" className={linkClass('/pages/owner/IncomeWeeklyReport')}>Weekly</Link></li>
                  <li><Link to="/pages/owner/MonthlyIncomeReport" className={linkClass('/pages/owner/IncomeMonthlyReport')}>Monthly</Link></li>
                  <li><Link to="/pages/owner/OwnerYearlyIncomeReport" className={linkClass('/pages/owner/IncomeYearlyReport')}>Yearly</Link></li>
                </ul>
              )}
            </li>

            {/* Expenses */}
            <li>
              <div onClick={() => setExpensesOpen(!expensesOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Expenses Reports</span><span>{expensesOpen ? '▾' : '▸'}</span>
              </div>
              {expensesOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/pages/owner/OwnerExpensesDailyReport" className={linkClass('/pages/owner/OwnerExpensesDailyReport')}>Daily</Link></li>
                  <li><Link to="/pages/owner/OwnerExpensesWeeklyReport" className={linkClass('//pages/owner/OwnerExpensesWeeklyReport')}>Weekly</Link></li>
                  <li><Link to="/pages/owner/OwnerExpenseMonthlyReport" className={linkClass('/pages/owner/OwnerExpensesMonthlyReport')}>Monthly</Link></li>
                  <li><Link to="/pages/owner/OwnerExpensesYearlyReport" className={linkClass('/pages/owner/OwnerExpensesYearlyReport')}>Yearly</Link></li>
                </ul>
              )}
            </li>

            {/* Employees */}

            <li><Link to="/pages/owner/OwnerEmployees" className={linkClass('/pages/owner/OwnerEmployees')}>Employees</Link></li>

            {/* Advances */}

            <li><Link to="/pages/owner/OwnerAdvances" className={linkClass('/pages/owner/OwnerAdvances')}>Employees Advances</Link></li>

            {/* Workers */}
            <li>
              <div onClick={() => setWorkersOpen(!workersOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Worker Performance</span><span>{workersOpen ? '▾' : '▸'}</span>
              </div>
              {workersOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/pages/owner/OwnerStaffDailyPerformance" className={linkClass('/pages/owner/OwnerStaffDailyPerformance')}>Daily</Link></li>
                  <li><Link to="/pages/owner/OwnerStaffWeeklyPerformance" className={linkClass('/pages/owner/OwnerStaffWeeklyPerformance')}>Weekly</Link></li>
                  <li><Link to="/pages/owner/OwnerStaffMonthlyPerformance" className={linkClass('/pages/owner/OwnerStaffMonthlyPerformance')}>Monthly</Link></li>
                  <li><Link to="/pages/owner/OwnerStaffYearlyPerformance" className={linkClass('/pages/owner/OwnerStaffYearlyPerformance')}>Yearly</Link></li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </aside>

      {/* Mobile Slide-Out Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-screen w-full bg-gray-900 text-white z-50 transform transition-transform duration-300 pt-16 px-4 sm:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-xl focus:outline-none"
        >
          ✕
        </button>

        <div className="h-full overflow-y-auto mt-6">
          <ul className="space-y-1 text-sm">
            <li><Link to="/" onClick={() => setMenuOpen(false)} className={linkClass('/')}>Dashboard</Link></li>

            {/* Income */}
            <li>
              <div onClick={() => setIncomeOpen(!incomeOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Income Reports</span><span>{incomeOpen ? '▾' : '▸'}</span>
              </div>
              {incomeOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/pages/owner/OwnerDailyIncomeReport" className={linkClass('/pages/owner/IncomeDailyReport')}>Daily</Link></li>
                  <li><Link to="/pages/owner/OwnerWeeklyIncomeReport" className={linkClass('/pages/owner/IncomeWeeklyReport')}>Weekly</Link></li>
                  <li><Link to="/pages/owner/MonthlyIncomeReport" className={linkClass('/pages/owner/IncomeMonthlyReport')}>Monthly</Link></li>
                  <li><Link to="/pages/owner/OwnerYearlyIncomeReport" className={linkClass('/pages/owner/IncomeYearlyReport')}>Yearly</Link></li>
                </ul>
              )}
            </li>

            {/* Expenses */}
            <li>
              <div onClick={() => setExpensesOpen(!expensesOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Expenses Reports</span><span>{expensesOpen ? '▾' : '▸'}</span>
              </div>
              {expensesOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/pages/owner/OwnerExpensesDailyReport" className={linkClass('/pages/owner/OwnerExpensesDailyReport')}>Daily</Link></li>
                  <li><Link to="/pages/owner/OwnerExpensesWeeklyReport" className={linkClass('//pages/owner/OwnerExpensesWeeklyReport')}>Weekly</Link></li>
                  <li><Link to="/pages/owner/OwnerExpenseMonthlyReport" className={linkClass('/pages/owner/OwnerExpensesMonthlyReport')}>Monthly</Link></li>
                  <li><Link to="/pages/owner/OwnerExpensesYearlyReport" className={linkClass('/pages/owner/OwnerExpensesYearlyReport')}>Yearly</Link></li>
                </ul>
              )}
            </li>

            {/* Employees */}
            <li><Link to="/pages/owner/OwnerEmployees" className={linkClass('/pages/owner/OwnerEmployees')}>Employees</Link></li>

              {/* Employees Advances */}
            <li><Link to="/pages/owner/OwnerAdvances" className={linkClass('/pages/owner/OwnerAdvances')}>Employees Advances</Link></li>

             {/* Workers */}   
            <li>
              <div onClick={() => setWorkersOpen(!workersOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Staff Performance</span><span>{workersOpen ? '▾' : '▸'}</span>
              </div>
              {workersOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/pages/owner/OwnerStaffDailyPerformance" className={linkClass('/pages/owner/OwnerStaffDailyPerformance')}>Daily</Link></li>
                  <li><Link to="/pages/owner/OwnerStaffWeeklyPerformance" className={linkClass('/pages/owner/OwnerStaffWeeklyPerformance')}>Weekly</Link></li>
                  <li><Link to="/pages/owner/OwnerStaffMonthlyPerformance" className={linkClass('/pages/owner/OwnerStaffMonthlyPerformance')}>Monthly</Link></li>
                  <li><Link to="/pages/owner/OwnerStaffYearlyPerformance" className={linkClass('/pages/owner/OwnerStaffYearlyPerformance')}>Yearly</Link></li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
