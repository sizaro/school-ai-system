import { Routes, Route } from "react-router-dom";
import DirectorSidebar from "../sidebars/DirectorSidebar.jsx";

// Pages
import DirectorDashboard from "../../pages/director/DirectorDashboard.jsx";
import SchoolOverview from "../../pages/director/SchoolOverview.jsx";
import StaffManagement from "../../pages/director/StaffManagement.jsx";

const DirectorLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <DirectorSidebar />
      <main className="flex-1 p-6 overflow-y-auto w-full mt-18 ml-[-10px] md:ml-64 md:mt-6">
        <Routes>
          <Route index element={<DirectorDashboard />} />
          <Route path="dashboard" element={<DirectorDashboard />} />
          <Route path="overview" element={<SchoolOverview />} />
          <Route path="staff" element={<StaffManagement />} />
        </Routes>
      </main>
    </div>
  );
};

export default DirectorLayout;
