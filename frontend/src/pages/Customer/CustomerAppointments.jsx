import { useData } from "../../context/DataContext";
import { useEffect, useState } from "react";

export default function CustomerAppointments() {
  const { services, user } = useData();
  const [myAppointments, setMyAppointments] = useState([]);

  // Filter services for the logged-in customer
  useEffect(() => {
    if (user && services.length > 0) {
      const filtered = services.filter(
        (service) =>
          service.created_by === user.id &&
          service.status !== "completed" // Only show pending/confirmed services
      );
      setMyAppointments(filtered);
    }
  }, [services, user]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {user ? `${user.first_name}'s Appointments` : "Your Appointments"}
      </h1>

      {myAppointments.length === 0 ? (
        <p className="text-gray-600">
          You have no upcoming appointments at the moment.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">
                  Service Name
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">
                  Appointment Time
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
              {myAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">
                    {appointment.service_type || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {new Date(appointment.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {appointment.barber ||
                     appointment.barber_assistant ||
                     appointment.scrubber_assistant ||
                     "N/A"}
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
