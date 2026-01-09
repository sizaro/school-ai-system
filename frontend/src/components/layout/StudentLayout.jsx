// layout/StudentLayout.jsx
import { Routes, Route } from "react-router-dom";
import StudentSidebar from "../sidebars/StudentSidebar.jsx";

import StudentDashboard from "../../pages/student/StudentDashboard.jsx";
import MyResults from "../../pages/student/MyResults.jsx";
import MyFees from "../../pages/student/FeeStatement.jsx";

const StudentLayout = () => (
  <div className="flex h-screen bg-gray-100">
    <StudentSidebar />
    <main className="flex-1 p-6 overflow-y-auto w-full mt-18 ml-[-10px] md:ml-64 md:mt-6">
      <Routes>
        <Route index element={<StudentDashboard />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="results" element={<MyResults />} />
        <Route path="fees" element={<MyFees />} />
      </Routes>
    </main>
  </div>
);

export default StudentLayout;
