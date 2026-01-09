import { Routes, Route } from "react-router-dom";
import TeacherSidebar from "../sidebars/TeacherSidebar.jsx";

import TeacherDashboard from "../../pages/teacher/TeacherDashboard.jsx";
import MyClasses from "../../pages/teacher/Classes.jsx";
import Results from "../../pages/teacher/Results.jsx";

const TeacherLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <TeacherSidebar />
      <main className="flex-1 p-6 overflow-y-auto w-full mt-18 ml-[-10px] md:ml-64 md:mt-6">
        <Routes>
          <Route index element={<TeacherDashboard />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="classes" element={<MyClasses />} />
          <Route path="results" element={<Results />} />
        </Routes>
      </main>
    </div>
  );
};

export default TeacherLayout;
