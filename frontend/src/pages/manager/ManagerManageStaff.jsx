import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";

const ManagerManageStaff = () => {
  const { employees, fetchEmployees } = useData();

  useEffect(() => {
    fetchEmployees();
  }, []);


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">First Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Middle Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Last Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Phone</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Next of Kin</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Next of Kin Phone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{emp.first_name}</td>
                <td className="px-4 py-2">{emp.middle_name}</td>
                <td className="px-4 py-2">{emp.last_name}</td>
                <td className="px-4 py-2">{emp.email}</td>
                <td className="px-4 py-2">{emp.role}</td>
                <td className="px-4 py-2">{emp.phone}</td>
                <td className="px-4 py-2">{emp.next_of_kin}</td>
                <td className="px-4 py-2">{emp.next_of_kin_phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerManageStaff;
