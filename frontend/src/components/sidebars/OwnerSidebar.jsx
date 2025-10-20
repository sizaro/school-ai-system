import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SidebarFooter from '../common/SidebarFooter';

export default function OwnerSidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [expensesOpen, setExpensesOpen] = useState(false);
  const [workersOpen, setWorkersOpen] = useState(false);
  const [lateFeesOpen, setLateFeesOpen] = useState(false);
  const [tagFeesOpen, setTagFeesOpen] = useState(false);

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
            <li><Link to="/owner/dashboard" className={linkClass('/owner/dashboard')}>Dashboard</Link></li>

            {/* Income */}
            <li>
              <div onClick={() => setIncomeOpen(!incomeOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Income Reports</span><span>{incomeOpen ? '▾' : '▸'}</span>
              </div>
              {incomeOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/owner/income/daily" className={linkClass('/owner/income/daily')}>Daily</Link></li>
                  <li><Link to="/owner/income/weekly" className={linkClass('/owner/income/weekly')}>Weekly</Link></li>
                  <li><Link to="/owner/income/monthly" className={linkClass('/owner/income/monthly')}>Monthly</Link></li>
                  <li><Link to="/owner/income/yearly" className={linkClass('/owner/income/yearly')}>Yearly</Link></li>
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
                  <li><Link to="/owner/expenses/daily" className={linkClass('/owner/expenses/daily')}>Daily</Link></li>
                  <li><Link to="/owner/expenses/weekly" className={linkClass('/owner/expenses/weekly')}>Weekly</Link></li>
                  <li><Link to="/owner/expenses/monthly" className={linkClass('/owner/expenses/monthly')}>Monthly</Link></li>
                  <li><Link to="/owner/expenses/yearly" className={linkClass('/owner/expenses/yearly')}>Yearly</Link></li>
                </ul>
              )}
            </li>

            {/* Employees */}
            <li><Link to="/owner/employees" className={linkClass('/owner/employees')}>Employees</Link></li>
            <li><Link to="/owner/advances" className={linkClass('/owner/advances')}>Employees Advances</Link></li>

            {/* Workers */}
            <li>
              <div onClick={() => setWorkersOpen(!workersOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Staff Performance</span><span>{workersOpen ? '▾' : '▸'}</span>
              </div>
              {workersOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/owner/report/daily" className={linkClass('/owner/report/daily')}>Daily</Link></li>
                  <li><Link to="/owner/report/weekly" className={linkClass('/owner/report/weekly')}>Weekly</Link></li>
                  <li><Link to="/owner/report/monthly" className={linkClass('/owner/report/monthly')}>Monthly</Link></li>
                  <li><Link to="/owner/report/yearly" className={linkClass('/owner/report/yearly')}>Yearly</Link></li>
                </ul>
              )}
            </li>

            {/* Late Fees */}
            <li>
              <div onClick={() => setLateFeesOpen(!lateFeesOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Late Fees Reports</span><span>{lateFeesOpen ? '▾' : '▸'}</span>
              </div>
              {lateFeesOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/owner/late-fees/daily" className={linkClass('/owner/late-fees/daily')}>Daily</Link></li>
                  <li><Link to="/owner/late-fees/weekly" className={linkClass('/owner/late-fees/weekly')}>Weekly</Link></li>
                  <li><Link to="/owner/late-fees/monthly" className={linkClass('/owner/late-fees/monthly')}>Monthly</Link></li>
                  <li><Link to="/owner/late-fees/yearly" className={linkClass('/owner/late-fees/yearly')}>Yearly</Link></li>
                </ul>
              )}
            </li>

            {/* Tag Fees */}
            <li>
              <div onClick={() => setTagFeesOpen(!tagFeesOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Tag Fees Reports</span><span>{tagFeesOpen ? '▾' : '▸'}</span>
              </div>
              {tagFeesOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/owner/tag-fees/daily" className={linkClass('/owner/tag-fees/daily')}>Daily</Link></li>
                  <li><Link to="/owner/tag-fees/weekly" className={linkClass('/owner/tag-fees/weekly')}>Weekly</Link></li>
                  <li><Link to="/owner/tag-fees/monthly" className={linkClass('/owner/tag-fees/monthly')}>Monthly</Link></li>
                  <li><Link to="/owner/tag-fees/yearly" className={linkClass('/owner/tag-fees/yearly')}>Yearly</Link></li>
                </ul>
              )}
            </li>

            <SidebarFooter/>
          </ul>
        </div>
      </aside>

      {/* Mobile Slide-Out Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-screen w-full bg-gray-900 text-white z-50 transform transition-transform duration-300 pt-16 px-4 md:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-6 font-bold text-xl mt-0">Salon Management</div>
        <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-xl focus:outline-none">✕</button>

        <div className="h-full overflow-y-auto mt-6">
          <ul className="space-y-1 text-sm">
            <li><Link to="/owner/dashboard" onClick={() => setMenuOpen(false)} className={linkClass('/owner/dashboard')}>Dashboard</Link></li>

            {/* Income */}
            <li>
              <div onClick={() => setIncomeOpen(!incomeOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Income Reports</span><span>{incomeOpen ? '▾' : '▸'}</span>
              </div>
              {incomeOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/owner/income/daily" onClick={() => setMenuOpen(false)} className={linkClass('/owner/income/daily')}>Daily</Link></li>
                  <li><Link to="/owner/income/weekly" onClick={() => setMenuOpen(false)} className={linkClass('/owner/income/weekly')}>Weekly</Link></li>
                  <li><Link to="/owner/income/monthly"  onClick={() => setMenuOpen(false)} className={linkClass('/owner/income/monthly')}>Monthly</Link></li>
                  <li><Link to="/owner/income/yearly" onClick={() => setMenuOpen(false)} className={linkClass('/owner/income/yearly')}>Yearly</Link></li>
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
                  <li><Link to="/owner/expenses/daily" onClick={() => setMenuOpen(false)} className={linkClass('/owner/expenses/daily')}>Daily</Link></li>
                  <li><Link to="/owner/expenses/weekly" onClick={() => setMenuOpen(false)} className={linkClass('/owner/expenses/weekly')}>Weekly</Link></li>
                  <li><Link to="/owner/expenses/monthly" onClick={() => setMenuOpen(false)} className={linkClass('/owner/expenses/monthly')}>Monthly</Link></li>
                  <li><Link to="/owner/expenses/yearly" onClick={() => setMenuOpen(false)} className={linkClass('/owner/expenses/yearly')}>Yearly</Link></li>
                </ul>
              )}
            </li>

            {/* Employees */}
            <li><Link to="/owner/employees" onClick={() => setMenuOpen(false)} className={linkClass('/owner/employees')}>Employees</Link></li>
            <li><Link to="/owner/advances" onClick={() => setMenuOpen(false)} className={linkClass('/owner/advances')}>Employees Advances</Link></li>

            {/* Workers */}
            <li>
              <div onClick={() => setWorkersOpen(!workersOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Staff Performance</span><span>{workersOpen ? '▾' : '▸'}</span>
              </div>
              {workersOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/owner/report/daily" onClick={() => setMenuOpen(false)} className={linkClass('/owner/report/daily')}>Daily</Link></li>
                  <li><Link to="/owner/report/weekly" onClick={() => setMenuOpen(false)} className={linkClass('/owner/report/weekly')}>Weekly</Link></li>
                  <li><Link to="/owner/report/monthly" onClick={() => setMenuOpen(false)} className={linkClass('/owner/report/monthly')}>Monthly</Link></li>
                  <li><Link to="/owner/report/yearly" onClick={() => setMenuOpen(false)} className={linkClass('/owner/report/yearly')}>Yearly</Link></li>
                </ul>
              )}
            </li>

            {/* Late Fees */}
            <li>
              <div onClick={() => setLateFeesOpen(!lateFeesOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Late Fees Reports</span><span>{lateFeesOpen ? '▾' : '▸'}</span>
              </div>
              {lateFeesOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/owner/late-fees/daily" onClick={() => setMenuOpen(false)} className={linkClass('/owner/late-fees/daily')}>Daily</Link></li>
                  <li><Link to="/owner/late-fees/weekly" onClick={() => setMenuOpen(false)} className={linkClass('/owner/late-fees/weekly')}>Weekly</Link></li>
                  <li><Link to="/owner/late-fees/monthly" onClick={() => setMenuOpen(false)} className={linkClass('/owner/late-fees/monthly')}>Monthly</Link></li>
                  <li><Link to="/owner/late-fees/yearly" onClick={() => setMenuOpen(false)} className={linkClass('/owner/late-fees/yearly')}>Yearly</Link></li>
                </ul>
              )}
            </li>

            {/* Tag Fees */}
            <li>
              <div onClick={() => setTagFeesOpen(!tagFeesOpen)} className="px-4 py-2 rounded cursor-pointer hover:bg-gray-700 flex justify-between">
                <span>Tag Fees Reports</span><span>{tagFeesOpen ? '▾' : '▸'}</span>
              </div>
              {tagFeesOpen && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li><Link to="/owner/tag-fees/daily" onClick={() => setMenuOpen(false)} className={linkClass('/owner/tag-fees/daily')}>Daily</Link></li>
                  <li><Link to="/owner/tag-fees/weekly" onClick={() => setMenuOpen(false)} className={linkClass('/owner/tag-fees/weekly')}>Weekly</Link></li>
                  <li><Link to="/owner/tag-fees/monthly" onClick={() => setMenuOpen(false)} className={linkClass('/owner/tag-fees/monthly')}>Monthly</Link></li>
                  <li><Link to="/owner/tag-fees/yearly" onClick={() => setMenuOpen(false)} className={linkClass('/owner/tag-fees/yearly')}>Yearly</Link></li>
                </ul>
              )}
            </li>

            <SidebarFooter/>
          </ul>
        </div>
      </div>
    </>
  );
}
