import { Routes, Route } from "react-router-dom";
import HeadmasterSidebar from "../sidebars/HeadmasterSidebar.jsx";

// Pages
import HeadmasterDashboard from "../../pages/headmaster/HeadmasterDashboard.jsx";
import AcademicsManagement from "../../pages/headmaster/AcademicsManagement.jsx";
import Discipline from "../../pages/headmaster/StudentDiscipline.jsx";

const HeadmasterLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <HeadmasterSidebar />
      <main className="flex-1 p-6 overflow-y-auto w-full mt-18 ml-[-10px] md:ml-64 md:mt-6">
        <Routes>
          <Route index element={<HeadmasterDashboard />} />
          <Route path="dashboard" element={<HeadmasterDashboard />} />
          <Route path="academics" element={<AcademicsManagement />} />
          <Route path="discipline" element={<Discipline />} />
        </Routes>
      </main>
    </div>
  );
};

export default HeadmasterLayout;
