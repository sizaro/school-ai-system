import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

/* ================= PUBLIC LANDING PAGES ================= */
import Home from "./pages/landing/Home.jsx";
import About from "./pages/landing/About.jsx";
import Contact from "./pages/landing/Contact.jsx";
import Admissions from "./pages/landing/Admissions.jsx";
import Academics from "./pages/landing/Academics.jsx";
import Events from "./pages/landing/Events.jsx";
import News from "./pages/landing/News.jsx";
import Alumni from "./pages/landing/Alumni.jsx";
import CampusLife from "./pages/landing/CampusLife.jsx";
import Tuition from "./pages/landing/Tuition.jsx";

import ResetPassword from "./pages/landing/ResetPassword.jsx";

/* ================= DASHBOARD LAYOUTS (TO CREATE) ================= */
import DirectorLayout from "./components/layout/DirectorLayout.jsx";
import HeadmasterLayout from "./components/layout/HeadmasterLayout.jsx";
import TeacherLayout from "./components/layout/TeacherLayout.jsx";
import BursarLayout from "./components/layout/BursarLayout.jsx";
import StudentLayout from "./components/layout/StudentLayout.jsx";

function App() {
  return (
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/tuition" element={<Tuition />} />
        <Route path="/events" element={<Events />} />
        <Route path="/news" element={<News />} />
        <Route path="/alumni" element={<Alumni />} />
        <Route path="/school-life" element={<CampusLife />} />

        {/* ================= RESET PASSWORD ================= */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ================= PROTECTED ROLE ROUTES ================= */}

        {/* DIRECTOR */}
        <Route
          path="/director/*"
          element={
            <ProtectedRoute role="director">
              <DirectorLayout />
            </ProtectedRoute>
          }
        />

        {/* HEADMASTER */}
        <Route
          path="/headmaster/*"
          element={
            <ProtectedRoute role="headmaster">
              <HeadmasterLayout />
            </ProtectedRoute>
          }
        />

        {/* TEACHER */}
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute role="teacher">
              <TeacherLayout />
            </ProtectedRoute>
          }
        />

        {/* BURSAR */}
        <Route
          path="/bursar/*"
          element={
            <ProtectedRoute role="bursar">
              <BursarLayout />
            </ProtectedRoute>
          }
        />

        {/* STUDENT */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute role="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
  );
}

export default App;
