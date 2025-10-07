import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
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
            <li><Link to="/" className={linkClass('/')}>Dashboard</Link></li>

            {/* Income */}
            <li>
              <div onClick={() => setIncomeOpen(!incomeOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Income Reports</span><span>{incomeOpen ? '▾' : '▸'}</span>
              </div>
              {incomeOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/pages/IncomeDailyReport" className={linkClass('/pages/IncomeDailyReport')}>Daily</Link></li>
                  <li><Link to="/pages/IncomeWeeklyReport" className={linkClass('/pages/IncomeWeeklyReport')}>Weekly</Link></li>
                  <li><Link to="/pages/IncomeMonthlyReport" className={linkClass('/pages/IncomeMonthlyReport')}>Monthly</Link></li>
                  <li><Link to="/pages/IncomeYearlyReport" className={linkClass('/pages/IncomeYearlyReport')}>Yearly</Link></li>
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
                  <li><Link to="/pages/ExpensesDailyReport" className={linkClass('/pages/ExpensesDailyReport')}>Daily</Link></li>
                  <li><Link to="/pages/ExpensesWeeklyReport" className={linkClass('/pages/ExpensesWeeklyReport')}>Weekly</Link></li>
                  <li><Link to="/pages/ExpensesMonthlyReport" className={linkClass('/pages/ExpensesMonthlyReport')}>Monthly</Link></li>
                  <li><Link to="/pages/ExpensesYearlyReport" className={linkClass('/pages/ExpensesYearlyReport')}>Yearly</Link></li>
                </ul>
              )}
            </li>

            {/* Workers */}

            <li><Link to="/pages/Employees" className={linkClass('/pages/Employees')}>Employees</Link></li>
            <li>
              <div onClick={() => setWorkersOpen(!workersOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Worker Performance</span><span>{workersOpen ? '▾' : '▸'}</span>
              </div>
              {workersOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/pages/WorkDailyReport" className={linkClass('/pages/WorkDailyReport')}>Daily</Link></li>
                  <li><Link to="/pages/WorkWeeklyReport" className={linkClass('/pages/WorkWeeklyReport')}>Weekly</Link></li>
                  <li><Link to="/pages/WorkMonthlyReport" className={linkClass('/pages/WorkMonthlyReport')}>Monthly</Link></li>
                  <li><Link to="/pages/WorkYearlyReport" className={linkClass('/pages/WorkYearlyReport')}>Yearly</Link></li>
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
                  <li><Link to="/pages/IncomeDailyReport" onClick={() => setMenuOpen(false)} className={linkClass('/pages/IncomeDailyReport')}>Daily</Link></li>
                  <li><Link to="/pages/IncomeWeeklyReport" onClick={() => setMenuOpen(false)} className={linkClass('/pages/IncomeWeeklyReport')}>Weekly</Link></li>
                  <li><Link to="/pages/IncomeMonthlyReport" onClick={() => setMenuOpen(false)} className={linkClass('/pages/IncomeMonthlyReport')}>Monthly</Link></li>
                  <li><Link to="/pages/IncomeYearlyReport" onClick={() => setMenuOpen(false)} className={linkClass('/pages/IncomeYearlyReport')}>Yearly</Link></li>
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
                  <li><Link to="/pages/ExpensesDailyReport" onClick={() => setMenuOpen(false)} className={linkClass('/pages/ExpensesDailyReport')}>Daily</Link></li>
                  <li><Link to="/pages/ExpensesWeeklyReport" onClick={() => setMenuOpen(false)} className={linkClass('/pages/ExpensesWeeklyReport')}>Weekly</Link></li>
                  <li><Link to="/pages/ExpensesMonthlyReport" onClick={() => setMenuOpen(false)} className={linkClass('/pages/ExpensesMonthlyReport')}>Monthly</Link></li>
                  <li><Link to="/pages/ExpensesYearlyReport" onClick={() => setMenuOpen(false)} className={linkClass('/pages/ExpensesYearlyReport')}>Yearly</Link></li>
                </ul>
              )}
            </li>

            {/* Workers */}
            <li><Link to="/pages/Employees" className={linkClass('/pages/Employees')}>Employees</Link></li>
            <li>
              <div onClick={() => setWorkersOpen(!workersOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Worker Performance</span><span>{workersOpen ? '▾' : '▸'}</span>
              </div>
              {workersOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/pages/WorkDailyReport" onClick={() => setMenuOpen(false)} className={linkClass('/pages/WorkDailyReport')}>Daily</Link></li>
                  <li><Link to="/pages/WorkWeeklyReport" onClick={() => setMenuOpen(false)} className={linkClass('/pages/WorkWeeklyReport')}>Weekly</Link></li>
                  <li><Link to="/pages/WorkMonthlyReport" onClick={() => setMenuOpen(false)} className={linkClass('/pages/WorkMonthlyReport')}>Monthly</Link></li>
                  <li><Link to="/pages/WorkYearlyReport" onClick={() => setMenuOpen(false)} className={linkClass('/pages/WorkYearlyReport')}>Yearly</Link></li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
