import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

// Landing Pages
import Home from "./pages/landing/Home.jsx";
import About from "./pages/landing/About.jsx";
import Contact from "./pages/landing/Contact.jsx";
import Admissions from "./pages/landing/Admissions.jsx";
import Academics from "./pages/landing/Academics.jsx";
import Events from "./pages/landing/Events.jsx";
import News from "./pages/landing/News.jsx";
import Alumni from "./pages/landing/Alumni.jsx";
import CampusLife from "./pages/landing/CampusLife.jsx";

import ResetPassword from "./pages/landing/ResetPassword.jsx";

// Dashboard Layouts
import OwnerLayout from "./components/layout/OwnerLayout.jsx";

import EmployeeLayout from "./components/layout/EmployeeLayout.jsx";

function App() {
  return (
      <Routes>
        {/* Public Landing Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/events" element={<Events />} />
        <Route path="/news" element={<News />} />
        <Route path="/alumni" element={<Alumni />} />
        <Route path="/campus-life" element={<CampusLife />} />

        {/* Reset Password (public) */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Owner Routes */}
        <Route
          path="/owner/*"
          element={
            <ProtectedRoute role="owner">
              <OwnerLayout />
            </ProtectedRoute>
          }
        />

        {/* Employee Routes */}
        <Route
          path="/employee/*"
          element={
            <ProtectedRoute role="employee">
              <EmployeeLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
  );
}

export default App;
