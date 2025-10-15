import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SidebarFooter from '../common/SidebarFooter';

export default function ManagerSidebar() {
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
            <li><Link to="/manager/dashboard" className={linkClass('/manager/dashboard')}>Dashboard</Link></li>

            {/* Income */}
            <li>
              <div onClick={() => setIncomeOpen(!incomeOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Income Reports</span><span>{incomeOpen ? '▾' : '▸'}</span>
              </div>
              {incomeOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/manager/income/daily" className={linkClass('/manager/income/daily')}>Daily</Link></li>
                  <li><Link to="/manager/income/weekly" className={linkClass('/manager/income/weekly')}>Weekly</Link></li>
                  <li><Link to="/manager/income/monthly" className={linkClass('/manager/income/monthly')}>Monthly</Link></li>
                  <li><Link to="/manager/income/yearly" className={linkClass('/manager/income/yearly')}>Yearly</Link></li>
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
                  <li><Link to="/manager/expenses/daily" className={linkClass('/manager/expenses/daily')}>Daily</Link></li>
                  <li><Link to="/manager/expenses/weekly" className={linkClass('/manager/expenses/weekly')}>Weekly</Link></li>
                  <li><Link to="/manager/expenses/monthly" className={linkClass('/manager/expenses/monthly')}>Monthly</Link></li>
                  <li><Link to="/manager/expenses/yearly" className={linkClass('/manager/expenses/yearly')}>Yearly</Link></li>
                </ul>
              )}
            </li>

            {/* Employees */}
            <li><Link to="/manager/employees" className={linkClass('/manager/employees')}>Employees</Link></li>

            {/* Advances */}
            <li><Link to="/manager/advances" className={linkClass('/manager/advances')}>Employees Advances</Link></li>

            {/* Workers */}
            <li>
              <div onClick={() => setWorkersOpen(!workersOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Worker Performance</span><span>{workersOpen ? '▾' : '▸'}</span>
              </div>
              {workersOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/manager/report/daily" className={linkClass('/manager/report/daily')}>Daily</Link></li>
                  <li><Link to="/manager/report/weekly" className={linkClass('/manager/report/weekly')}>Weekly</Link></li>
                  <li><Link to="/manager/report/monthly" className={linkClass('/manager/report/monthly')}>Monthly</Link></li>
                  <li><Link to="/manager/report/yearly" className={linkClass('/manager/report/yearly')}>Yearly</Link></li>
                </ul>
              )}
            </li>
          </ul>
        </div>
        <SidebarFooter />
      </aside>

      {/* Mobile Slide-Out Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-screen w-full bg-gray-900 text-white z-50 transform transition-transform duration-300 pt-16 px-4 sm:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-xl focus:outline-none">✕</button>

        <div className="h-full overflow-y-auto mt-6">
          <ul className="space-y-1 text-sm">
            <li><Link to="/manager/dashboard" onClick={() => setMenuOpen(false)} className={linkClass('/manager/dashboard')}>Dashboard</Link></li>

            {/* Income */}
            <li>
              <div onClick={() => setIncomeOpen(!incomeOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Income Reports</span><span>{incomeOpen ? '▾' : '▸'}</span>
              </div>
              {incomeOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/manager/income/daily" className={linkClass('/manager/income/daily')}>Daily</Link></li>
                  <li><Link to="/manager/income/weekly" className={linkClass('/manager/income/weekly')}>Weekly</Link></li>
                  <li><Link to="/manager/income/monthly" className={linkClass('/manager/income/monthly')}>Monthly</Link></li>
                  <li><Link to="/manager/income/yearly" className={linkClass('/manager/income/yearly')}>Yearly</Link></li>
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
                  <li><Link to="/manager/expenses/daily" className={linkClass('/manager/expenses/daily')}>Daily</Link></li>
                  <li><Link to="/manager/expenses/weekly" className={linkClass('/manager/expenses/weekly')}>Weekly</Link></li>
                  <li><Link to="/manager/expenses/monthly" className={linkClass('/manager/expenses/monthly')}>Monthly</Link></li>
                  <li><Link to="/manager/expenses/yearly" className={linkClass('/manager/expenses/yearly')}>Yearly</Link></li>
                </ul>
              )}
            </li>

            {/* Employees */}
            <li><Link to="/manager/employees" className={linkClass('/manager/employees')}>Employees</Link></li>
            <li><Link to="/manager/advances" className={linkClass('/manager/advances')}>Employees Advances</Link></li>

            {/* Workers */}
            <li>
              <div onClick={() => setWorkersOpen(!workersOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Staff Performance</span><span>{workersOpen ? '▾' : '▸'}</span>
              </div>
              {workersOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/manager/report/daily" className={linkClass('/manager/report/daily')}>Daily</Link></li>
                  <li><Link to="/manager/report/weekly" className={linkClass('/manager/report/weekly')}>Weekly</Link></li>
                  <li><Link to="/manager/report/monthly" className={linkClass('/manager/report/monthly')}>Monthly</Link></li>
                  <li><Link to="/manager/report/yearly" className={linkClass('/manager/report/yearly')}>Yearly</Link></li>
                </ul>
              )}
            </li>
          </ul>
          <SidebarFooter/>
        </div>
      </div>
    </>
  );
}
