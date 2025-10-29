import { useEffect, useState } from "react";
import { useData } from "../../context/DataContext.jsx";
import Button from "../../components/Button.jsx";

// Helper to convert 24-hour to 12-hour AM/PM
const formatTime12h = (time24) => {
  if (!time24) return "N/A";
  let [hour, minute] = time24.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
};

// Format date only
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-UG", { timeZone: "Africa/Kampala" });
};

export default function EmployeeDashboard() {
  const { services, user, users } = useData();
  const [activeTab, setActiveTab] = useState("confirmed");
  const [myServices, setMyServices] = useState([]);

  useEffect(() => {
    if (!services || !user) return;

    const assignedServices = services.filter((svc) => {
      const involvedIds = [
        svc.barber_id,
        svc.barber_assistant_id,
        svc.scrubber_assistant_id,
        svc.black_shampoo_assistant_id,
        svc.super_black_assistant_id,
        svc.black_mask_assistant_id,
      ].filter(Boolean);
      return involvedIds.includes(user.id) && ["confirmed", "completed"].includes(svc.status.toLowerCase());
    });

    setMyServices(assignedServices);
  }, [services, user]);

  // Tab filter
  const filteredServices = myServices.filter(
    (svc) => svc.status.toLowerCase() === activeTab
  );

  const getEmployeeRole = (svc, employeeId) => {
    if (svc.barber_id === employeeId) return "Barber";
    if (svc.barber_assistant_id === employeeId) return "Aesthetician";
    if (svc.black_mask_assistant_id === employeeId) return "Black Mask";
    if (svc.scrubber_assistant_id === employeeId) return "Scrubber";
    if (svc.black_shampoo_assistant_id === employeeId) return "Black Shampoo";
    if (svc.super_black_assistant_id === employeeId) return "Super Black";
    return "";
  };

  const getCustomerName = (customerId) => {
    const customer = users.find((u) => u.id === customerId);
    return customer ? `${customer.first_name} ${customer.last_name}` : "N/A";
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">My Appointments</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {["confirmed", "completed"].map((status) => (
          <Button
            key={status}
            className={`px-4 py-2 rounded ${
              activeTab === status
                ? "bg-blue-500 text-white"
                : "bg-green-700 text-white-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {filteredServices.length === 0 ? (
        <p className="text-gray-600">No {activeTab} appointments.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Service
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Customer
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Time
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Your Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredServices.map((svc) => (
                <tr key={svc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{svc.name}</td>
                  <td className="px-4 py-2">{getCustomerName(svc.customer_id)}</td>
                  <td className="px-4 py-2">{formatDate(svc.appointment_date)}</td>
                  <td className="px-4 py-2">{formatTime12h(svc.appointment_time)}</td>
                  <td className="px-4 py-2 text-green-600 font-medium">
                    {getEmployeeRole(svc, user.id)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
