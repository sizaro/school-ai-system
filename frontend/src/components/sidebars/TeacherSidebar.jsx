import { NavLink } from "react-router-dom";

const TeacherSidebar = () => (
  <aside className="hidden md:flex md:flex-col w-64 bg-purple-900 text-white fixed h-full">
    <div className="p-6 font-bold text-xl border-b border-purple-700">
      Teacher Panel
    </div>
    <nav className="flex-1 p-4 space-y-2">
      <NavLink to="/teacher/dashboard" className="block p-2 rounded hover:bg-purple-700">Dashboard</NavLink>
      <NavLink to="/teacher/classes" className="block p-2 rounded hover:bg-purple-700">My Classes</NavLink>
      <NavLink to="/teacher/results" className="block p-2 rounded hover:bg-purple-700">Results</NavLink>
    </nav>
  </aside>
);

export default TeacherSidebar;
