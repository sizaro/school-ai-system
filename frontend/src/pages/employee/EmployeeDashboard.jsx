import { useEffect, useState } from "react";
import { useData } from "../../context/DataContext.jsx";

export default function EmployeeDashboard() {
  const { services, user } = useData();
  const [myServices, setMyServices] = useState([]);


  useEffect(() => {
    if (services && user) {
      const assignedServices = services.filter(
        (svc) =>
          svc.employee_id === user.id &&
          svc.status.toLowerCase() !== "completed"
      );
      setMyServices(assignedServices);
    }
  }, [services, user]);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">My Appointments</h1>

      {myServices.length === 0 ? (
        <p className="text-gray-600">You have no pending appointments.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Customer
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Service
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {myServices.map((svc) => (
                <tr key={svc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{svc.customer_name}</td>
                  <td className="px-4 py-2">{svc.service_name}</td>
                  <td className="px-4 py-2">
                    {new Date(svc.date).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{svc.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
