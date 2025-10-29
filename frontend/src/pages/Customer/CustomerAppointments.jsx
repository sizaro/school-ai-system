import { useData } from "../../context/DataContext.jsx";
import { useEffect, useState } from "react";

export default function CustomerAppointments() {
  const { services, users, user } = useData();
  const [myAppointments, setMyAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-UG", { timeZone: "Africa/Kampala" });
};

  // Filter services for the logged-in customer
  useEffect(() => {
    if (user && services.length > 0) {
      const filtered = services.filter(
        (service) => service.customer_id === user.id
      );
      setMyAppointments(filtered);
    }
  }, [services, user]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-UG", {
      timeZone: "Africa/Kampala",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getAssignedEmployees = (appointment) => {
    const employeeRoles = [
      { label: "Barber", id: appointment.barber_id },
      { label: "Barber Assistant", id: appointment.barber_assistant_id },
      { label: "Scrubber", id: appointment.scrubber_assistant_id },
      { label: "Black Shampoo", id: appointment.black_shampoo_assistant_id },
      { label: "Super Black", id: appointment.super_black_assistant_id },
      { label: "Black Mask", id: appointment.black_mask_assistant_id },
      { label: "Aesthetician", id: appointment.aesthetician_id },
    ];

    return employeeRoles
      .filter((r) => r.id)
      .map((r) => {
        const emp = users.find((u) => u.id === r.id);
        return emp ? `${r.label}: ${emp.first_name} ${emp.last_name}` : null;
      })
      .filter(Boolean)
      .join(", ");
  };

  const filteredByStatus = myAppointments.filter(
    (a) => a.status === activeTab
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {user ? `${user.first_name}'s Appointments` : "Your Appointments"}
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["pending", "confirmed", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded ${
              activeTab === status
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredByStatus.length === 0 ? (
        <p className="text-gray-600">
          You have no {activeTab} appointments at the moment.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">
                  Service
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">
                  Date
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">
                  Time
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">
                  Employees Assigned
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredByStatus.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">
                    {appointment.name || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {formatDate(appointment.appointment_date)}
                  </td>

                  <td className="py-3 px-4 border-b">
                    {appointment.appointment_time}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {getAssignedEmployees(appointment) || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b capitalize">
                    {appointment.status}
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
