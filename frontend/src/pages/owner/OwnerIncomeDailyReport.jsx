import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext.jsx";
import "../../styles/IncomeDailyReport.css";
import Modal from "../../components/Modal";
import ServiceForm from "../../components/ServiceForm.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx";

const OwnerIncomeDailyReport = () => {
  const {
    services,
    lateFees,
    tagFees,
    users =[],
    advances,
    expenses,
    sessions,
    fetchUsers,
    fetchDailyData,
    fetchServiceById,
    updateService,
    deleteService,
  } = useData();

  console.log("users in the daily report:", users)
  const Employees = users.filter((user)=> `${user.first_name} ${user.last_name}`.toLowerCase() !== 'ntege saleh' && user.role !== 'customer')

  const today = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const reportDate = today.toLocaleDateString("en-US", options);

  const session = sessions && sessions.length > 0 ? sessions[0] : null;
  const [liveDuration, setLiveDuration] = useState("");
  const [selectedDate, setSelectedDate] = useState(today.toLocaleDateString("en-CA"));
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // ---- Modal Handlers ----
  const handleEditClick = async (serviceId) => {
    const service = await fetchServiceById(serviceId);

    console.log("service fetched by id in income daily report:", service)
    setEditingService(service);
    setShowModal(true);
  };

  const handleModalSubmit = async (updatedService) => {
    await updateService(updatedService.id, updatedService);
    await fetchDailyData(selectedDate);
    setShowModal(false);
    setEditingService(null);
  };

  const handleDelete = (serviceId) => {
    setServiceToDelete(serviceId);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (serviceToDelete) {
      await deleteService(serviceToDelete);
      await fetchDailyData(selectedDate);
      setConfirmModalOpen(false);
      setServiceToDelete(null);
    }
  };

  // ---- Totals Calculation ----
  const calculateTotals = (services, expenses, advances, tagFees, lateFees) => {
    const grossIncome = services.reduce(
      (sum, s) => sum + (parseInt(s.service_amount, 10) || 0),
      0
    );

    const employeesSalary = services.reduce((sum, s) => {
      return (
        sum +
        (parseInt(s.barber_amount, 10) || 0) +
        (parseInt(s.barber_assistant_amount, 10) || 0) +
        (parseInt(s.scrubber_assistant_amount, 10) || 0) +
        (parseInt(s.black_shampoo_assistant_amount, 10) || 0) +
        (parseInt(s.super_black_assistant_amount, 10) || 0) +
        (parseInt(s.black_mask_assistant_amount, 10) || 0)
      );
    }, 0);

    const totalExpenses = expenses.reduce(
      (sum, e) => sum + (parseInt(e.amount, 10) || 0),
      0
    );

    const totalAdvances = advances.reduce(
      (sum, a) => sum + (parseInt(a.amount, 10) || 0),
      0
    );

    const totalLateFees = lateFees.reduce(
      (sum, l) => sum + (parseInt(l.amount, 10) || 0),
      0
    );

    const totaltagFees = tagFees.reduce(
      (sum, t) => sum + (parseInt(t.amount, 10) || 0),
      0
    );

    const netEmployeeSalary = employeesSalary - (totalAdvances + totalLateFees + totaltagFees);
    const netIncome = grossIncome - (totalExpenses + netEmployeeSalary);
    const cashAtHand = netIncome + netEmployeeSalary;

    return {
      totalLateFees,
      totaltagFees,
      grossIncome,
      employeesSalary,
      totalExpenses,
      totalAdvances,
      netEmployeeSalary,
      netIncome,
      cashAtHand,
    };
  };

  const {
    totalLateFees,
    totaltagFees,
    grossIncome,
    employeesSalary,
    totalExpenses,
    totalAdvances,
    netEmployeeSalary,
    netIncome,
    cashAtHand
  } = calculateTotals(services, expenses, advances,tagFees, lateFees);

  // ---- Format UTC Date to EAT ----
  const formatEAT = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-UG", {
      timeZone: "Africa/Kampala",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ---- Duration Calculation ----
  const calculateDuration = (openUTC, closeUTC) => {
    if (!openUTC || !closeUTC) return "N/A";

    const diffMs = new Date(closeUTC) - new Date(openUTC);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    if (!session) return;

    const openUTC = session.open_time;
    const closeUTC = session.close_time || session.server_now;
    setLiveDuration(calculateDuration(openUTC, closeUTC));

    if (!session.close_time) {
      const interval = setInterval(() => {
        setLiveDuration(calculateDuration(openUTC, session.server_now));
      }, 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [session]);

  // ---- Handle Day Change ----
  const handleDayChange = (e) => {
    const pickedDate = e.target.value;
    setSelectedDate(pickedDate);
    fetchDailyData(pickedDate);
  };

  useEffect(() => {
    fetchDailyData(selectedDate);
    fetchUsers()
  }, []);

  useEffect(() => {
    fetchUsers()
  }, []);

  // ---- Service Count Summary ----
  const serviceCount = services.reduce((acc, service) => {
    const name = service.name || "Unknown";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  // ---- Tabbed Appointments ----
  const [activeTab, setActiveTab] = useState("pending");

  const pendingAppointments = services.filter(s => s.status === 'pending');
  const confirmedAppointments = services.filter(s => s.status === 'confirmed');
  const completedAppointments = services.filter(s => s.status === 'completed');
  const cancelledAppointments = services.filter(s => s.status === 'cancelled');

  const appointmentsByStatus = {
    pending: pendingAppointments,
    confirmed: confirmedAppointments,
    completed: completedAppointments,
    cancelled: cancelledAppointments,
  };

  return (
    <div className="income-page max-w-4xl mx-auto p-4 overflow-y-hidden">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 break-words max-w-full">
        {reportDate} Daily Income Report
      </h1>

      {/* Day Picker */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Pick a day:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDayChange}
          className="border rounded p-2"
        />
      </div>

      {session ? (
        <>
          {/* SESSION INFO */}
          <section className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">{reportDate}</h2>
            <p><span className="font-medium">Opened:</span> {formatEAT(session.open_time)}</p>
            <p><span className="font-medium">Closed:</span> {session.close_time ? formatEAT(session.close_time) : "N/A"}</p>
            <p><span className="font-medium">Duration:</span> {liveDuration} {!session.close_time && "(Counting...)"}</p>
          </section>

          {/* TABBED APPOINTMENTS */}
          <section className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Appointments</h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  className={`px-4 py-2 rounded ${
                    activeTab === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveTab(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex flex-wrap gap-4">
              {appointmentsByStatus[activeTab].length > 0 ? (
                appointmentsByStatus[activeTab].map((s) => (
                  <div
                    key={s.id}
                    className={`border rounded-lg p-4 w-[calc(33.333%-1rem)] min-w-[180px] ${
                      activeTab === 'pending'
                        ? 'bg-yellow-50 border-yellow-200'
                        : activeTab === 'confirmed'
                        ? 'bg-green-50 border-green-200'
                        : activeTab === 'completed'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <p className="font-medium">{s.name}</p>
                    <p>Customer: {s.customer_name || 'N/A'}</p>
                    <p>Time: {formatEAT(s.service_timestamp)}</p>
                    <p>Barber: {s.barber}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No {activeTab} appointments</p>
              )}
            </div>
          </section>

          {/* SUMMARY Section in Divs */}
          <section className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Summary</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col justify-center items-center bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-4 w-[calc(33.333%-1rem)] min-w-[180px] flex-grow">
                <span className="font-medium text-gray-700">Gross Income</span>
                <span className="text-blue-700 text-xl font-bold">{grossIncome.toLocaleString()} UGX</span>
              </div>

              <div className="flex flex-col justify-center items-center bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-4 w-[calc(33.333%-1rem)] min-w-[180px] flex-grow">
                <span className="font-medium text-gray-700">Employees Salary</span>
                <span className="text-blue-700 text-xl font-bold">{employeesSalary.toLocaleString()} UGX</span>
              </div>

              <div className="flex flex-col justify-center items-center bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-4 w-[calc(33.333%-1rem)] min-w-[180px] flex-grow">
                <span className="font-medium text-gray-700">Expenses</span>
                <span className="text-blue-700 text-xl font-bold">{totalExpenses.toLocaleString()} UGX</span>
              </div>

              <div className="flex flex-col justify-center items-center bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-4 w-[calc(33.333%-1rem)] min-w-[180px] flex-grow">
                <span className="font-medium text-gray-700">Advances</span>
                <span className="text-blue-700 text-xl font-bold">{totalAdvances.toLocaleString()} UGX</span>
              </div>

              <div className="flex flex-col justify-center items-center bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-4 w-[calc(33.333%-1rem)] min-w-[180px] flex-grow">
                <span className="font-medium text-gray-700">Tag Fees</span>
                <span className="text-blue-700 text-xl font-bold">{totaltagFees.toLocaleString()} UGX</span>
              </div>

              <div className="flex flex-col justify-center items-center bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-4 w-[calc(33.333%-1rem)] min-w-[180px] flex-grow">
                <span className="font-medium text-gray-700">Late Fees</span>
                <span className="text-blue-700 text-xl font-bold">{totalLateFees.toLocaleString()} UGX</span>
              </div>

              <div className="flex flex-col justify-center items-center bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-4 w-[calc(33.333%-1rem)] min-w-[180px] flex-grow">
                <span className="font-medium text-gray-700">Net Employees Salary</span>
                <span className="text-green-600 text-xl font-bold">{netEmployeeSalary.toLocaleString()} UGX</span>
              </div>

              <div className="flex flex-col justify-center items-center bg-blue-100 border border-blue-300 rounded-lg shadow-md p-4 w-[calc(33.333%-1rem)] min-w-[180px] flex-grow">
                <span className="font-semibold text-gray-800">Salon Net Income</span>
                <span className="text-green-700 text-xl font-bold">{netIncome.toLocaleString()} UGX</span>
              </div>

              <div className="flex flex-col justify-center items-center bg-blue-100 border border-blue-300 rounded-lg shadow-md p-4 w-[calc(33.333%-1rem)] min-w-[180px] flex-grow">
                <span className="font-semibold text-gray-800">Total Cash Available</span>
                <span className="text-green-700 text-xl font-bold">{cashAtHand.toLocaleString()} UGX</span>
              </div>
            </div>
          </section>

          {/* SERVICES COUNT SECTION */}
          <section className="w-full bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              Service Summary (By Count)
            </h2>
            <div className="flex flex-wrap gap-4">
              {Object.entries(serviceCount).map(([name, count]) => (
                <div
                  key={name}
                  className="flex flex-col justify-center items-center bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-4 w-[calc(25%-1rem)] min-w-[150px] flex-grow"
                >
                  <span className="font-semibold text-gray-800 text-lg text-center">{name}</span>
                  <span className="text-blue-700 text-2xl font-bold">{count}</span>
                </div>
              ))}
            </div>
          </section>

          {/* SERVICES TABLE */}
          <section className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Services Rendered</h2>
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto border border-gray-300 rounded">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-blue-700 text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left">No.</th>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Service Amount</th>
                    <th className="px-3 py-2 text-left">Salon Amount</th>
                    <th className="px-3 py-2 text-left">Barber</th>
                    <th className="px-3 py-2 text-left">Barber Amount</th>
                    <th className="px-3 py-2 text-left">Aesthetician</th>
                    <th className="px-3 py-2 text-left">Aesthetician Amount</th>
                    <th className="px-3 py-2 text-left">Scrub Aesthetician</th>
                    <th className="px-3 py-2 text-left">Scrubber Amount</th>
                    <th className="px-3 py-2 text-left">Black Shampoo Aesthetician</th>
                    <th className="px-3 py-2 text-left">Black Shampoo Aesthetician Amount</th>
                    <th className="px-3 py-2 text-left">Black Shampoo Amount</th>
                    <th className="px-3 py-2 text-left">Super Black Aesthetician</th>
                    <th className="px-3 py-2 text-left">Super Black Aesthetician Amount</th>
                    <th className="px-3 py-2 text-left">Super Black Amount</th>
                    <th className="px-3 py-2 text-left">Black Mask Aesthetician</th>
                    <th className="px-3 py-2 text-left">Black Mask Aesthetician Amount</th>
                    <th className="px-3 py-2 text-left">Black Mask Amount</th>
                    <th className="px-3 py-2 text-left">Time of Service</th>
                    <th className="px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length > 0 ? (
                    services.map((s, index) => (
                      <tr key={s.id} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2">{s.name}</td>
                        <td className="px-3 py-2">{s.service_amount}</td>
                        <td className="px-3 py-2">{s.salon_amount}</td>
                        <td className="px-3 py-2">{s.barber}</td>
                        <td className="px-3 py-2">{s.barber_amount}</td>
                        <td className="px-3 py-2">{s.barber_assistant}</td>
                        <td className="px-3 py-2">{s.barber_assistant_amount}</td>
                        <td className="px-3 py-2">{s.scrubber_assistant}</td>
                        <td className="px-3 py-2">{s.scrubber_assistant_amount}</td>
                        <td className="px-3 py-2">{s.black_shampoo_assistant}</td>
                        <td className="px-3 py-2">{s.black_shampoo_assistant_amount}</td>
                        <td className="px-3 py-2">{s.black_shampoo_amount}</td>
                        <td className="px-3 py-2">{s.super_black_assistant}</td>
                        <td className="px-3 py-2">{s.super_black_assistant_amount}</td>
                        <td className="px-3 py-2">{s.super_black_amount}</td>
                        <td className="px-3 py-2">{s.black_mask_assistant}</td>
                        <td className="px-3 py-2">{s.black_mask_assistant_amount}</td>
                        <td className="px-3 py-2">{s.black_mask_amount}</td>
                        <td className="px-3 py-2">{formatEAT(s.service_timestamp)}</td>
                        <td className="px-3 py-2 flex gap-2">
                          <button
                            onClick={() => handleEditClick(s.id)}
                            className="text-blue-700 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="21" className="text-center py-4">
                        No services found for this day
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <p className="text-red-600 font-medium">No session data available.</p>
      )}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <ServiceForm
            serviceData={editingService}
            Employees={Employees}
            onSubmit={handleModalSubmit}
          />
        </Modal>

      {confirmModalOpen && (
        <ConfirmModal 
        isOpen={confirmModalOpen}
        confirmMessage="yes"
          message="Are you sure you want to delete this service?"
          onConfirm={confirmDelete}
          onClose={() => setConfirmModalOpen(false)}
        />
      )}
    </div>
  );
};

export default OwnerIncomeDailyReport;
