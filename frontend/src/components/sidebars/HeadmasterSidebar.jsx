import { NavLink } from "react-router-dom";

const HeadmasterSidebar = () => {
  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-green-900 text-white fixed h-full">
      <div className="p-6 font-bold text-xl border-b border-green-700">
        Headmaster Panel
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/headmaster/dashboard" className="block p-2 rounded hover:bg-green-700">
          Dashboard
        </NavLink>
        <NavLink to="/headmaster/academics" className="block p-2 rounded hover:bg-green-700">
          Academics
        </NavLink>
        <NavLink to="/headmaster/discipline" className="block p-2 rounded hover:bg-green-700">
          Discipline
        </NavLink>
      </nav>
    </aside>
  );
};

export default HeadmasterSidebar;
