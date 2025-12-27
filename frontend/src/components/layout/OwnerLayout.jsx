import { Routes, Route } from "react-router-dom";
import OwnerSidebar from "../sidebars/OwnerSidebar.jsx";

// Pages
import OwnerDashboard from "../../pages/owner/OwnerDashboard.jsx";
import Advances from "../../pages/owner/OwnerAdvances.jsx";

const OwnerLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <OwnerSidebar />
      <main className="flex-1 p-6 overflow-y-auto w-full mt-18 ml-[-10px] md:ml-64 md:mt-6">
        <Routes>
          {/* Dashboard */}
          <Route index element={<OwnerDashboard />} />
          <Route path="dashboard" element={<OwnerDashboard />} />

          <Route path="advances" element={<Advances />} />
        </Routes>
      </main>
    </div>
  );
};

export default OwnerLayout;
