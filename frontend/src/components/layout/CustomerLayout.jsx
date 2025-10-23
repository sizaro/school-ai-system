import { Routes, Route } from "react-router-dom";
import CustomerSidebar from "../sidebars/CustomerSidebar.jsx";

import CustomerDashboard from "../../pages/Customer/customerDashboard.jsx";
import CustomerAppointments from "../../pages/customer/CustomerAppointments.jsx";

const CustomerLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <CustomerSidebar />
      <main className="flex-1 p-6 overflow-y-auto w-full mt-15 ml-0 md:ml-64 sm:mt-6">
        <Routes>
          {/* Dashboard */}
          <Route index element={<CustomerDashboard />} />
          <Route path="dashboard" element={<CustomerDashboard />} />

          {/* View My Appointments */}
          <Route path="appointments" element={<CustomerAppointments />} />

        </Routes>
      </main>
    </div>
  );
};

export default CustomerLayout;
