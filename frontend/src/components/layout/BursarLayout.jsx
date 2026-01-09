// layout/BursarLayout.jsx
import { Routes, Route } from "react-router-dom";
import BursarSidebar from "../sidebars/BursarSidebar.jsx";

import BursarDashboard from "../../pages/bursar/BursarDashboard.jsx";
import FeesManagement from "../../pages/bursar/FeesManagement.jsx";
import Payments from "../../pages/bursar/Payments.jsx";

const BursarLayout = () => (
  <div className="flex h-screen bg-gray-100">
    <BursarSidebar />
    <main className="flex-1 p-6 overflow-y-auto w-full mt-18 ml-[-10px] md:ml-64 md:mt-6">
      <Routes>
        <Route index element={<BursarDashboard />} />
        <Route path="dashboard" element={<BursarDashboard />} />
        <Route path="fees" element={<FeesManagement />} />
        <Route path="payments" element={<Payments />} />
      </Routes>
    </main>
  </div>
);

export default BursarLayout;
