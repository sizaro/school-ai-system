import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext.jsx";
import "../../styles/IncomeDailyReport.css";
import Modal from "../../components/Modal";
import ServiceForm from "../../components/ServiceForm.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx";

const OwnerIncomeDailyReport = () => {
  const {
    services,
    employees,
    advances,
    expenses,
    sessions,
    fetchDailyData,
    fetchServiceById,
    updateService,
    deleteService,
  } = useData();

  const Employees = employees.filter(
    (emp) =>
      `${emp.first_name} ${emp.last_name}`.toLowerCase() !== "saleh ntege"
  );

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
  const calculateTotals = (services, expenses, advances) => {
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

    const netEmployeeSalary = employeesSalary - totalAdvances;
    const netIncome = grossIncome - (totalExpenses + netEmployeeSalary);
    const cashAtHand = netIncome + netEmployeeSalary;

    return {
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
    grossIncome,
    employeesSalary,
    totalExpenses,
    totalAdvances,
    netEmployeeSalary,
    netIncome,
    cashAtHand,
  } = calculateTotals(services, expenses, advances);

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
  }, []);

  // ✅ ---- NEW SECTION: SERVICE COUNT SUMMARY ----
  // Using reduce() to count how many times each service appears
  const serviceCount = services.reduce((acc, service) => {
    const name = service.name || "Unknown"; // if name is null, fallback
    acc[name] = (acc[name] || 0) + 1; // increment the count
    return acc;
  }, {}); // starts with an empty object {}

  const pendingAppointments = services.filter(s => s.status === 'pending');
  const confirmedAppointments = services.filter(s => s.status === 'confirmed');
  const completedAppointments = services.filter(s => s.status === 'completed');
  const cancelledAppointments = services.filter(s => s.status === 'cancelled');


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

          <section className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Appointments</h2>

          {/* Pending Appointments */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending</h3>
            <div className="flex flex-wrap gap-4">
              {pendingAppointments.length > 0 ? (
                pendingAppointments.map((s) => (
                  <div key={s.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 w-[calc(33.333%-1rem)] min-w-[180px] flex-grow">
                    <p className="font-medium">{s.name}</p>
                    <p>Customer: {s.customer_name || 'N/A'}</p>
                    <p>Time: {formatEAT(s.service_timestamp)}</p>
                    <p>Barber: {s.barber}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No pending appointments</p>
              )}
            </div>
          </div>

          {/* Repeat for Confirmed, Completed, Cancelled */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirmed</h3>
            <div className="flex flex-wrap gap-4">
              {confirmedAppointments.length > 0 ? (
                confirmedAppointments.map((s) => (
                  <div key={s.id} className="bg-green-50 border border-green-200 rounded-lg p-4 w-[calc(33.333%-1rem)] min-w-[180px] flex-grow">
                    <p className="font-medium">{s.name}</p>
                    <p>Customer: {s.customer_name || 'N/A'}</p>
                    <p>Time: {formatEAT(s.service_timestamp)}</p>
                    <p>Barber: {s.barber}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No confirmed appointments</p>
              )}
            </div>
          </div>

          {/* Repeat Completed */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Completed</h3>
            <div className="flex flex-wrap gap-4">
              {completedAppointments.length > 0 ? (
                completedAppointments.map((s) => (
                  <div key={s.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-[calc(33.333%-1rem)] min-w-[180px] flex-grow">
                    <p className="font-medium">{s.name}</p>
                    <p>Customer: {s.customer_name || 'N/A'}</p>
                    <p>Time: {formatEAT(s.service_timestamp)}</p>
                    <p>Barber: {s.barber}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No completed appointments</p>
              )}
            </div>
          </div>

          {/* Repeat Cancelled */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Cancelled</h3>
            <div className="flex flex-wrap gap-4">
              {cancelledAppointments.length > 0 ? (
                cancelledAppointments.map((s) => (
                  <div key={s.id} className="bg-red-50 border border-red-200 rounded-lg p-4 w-[calc(33.333%-1rem)] min-w-[180px] flex-grow">
                    <p className="font-medium">{s.name}</p>
                    <p>Customer: {s.customer_name || 'N/A'}</p>
                    <p>Time: {formatEAT(s.service_timestamp)}</p>
                    <p>Barber: {s.barber}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No cancelled appointments</p>
              )}
            </div>
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

          {/* ✅ SERVICES COUNT SECTION */}
          {/* Services Summary Section */}
          <section className="w-full bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              Service Summary (By Count)
            </h2>

            {/* Service Count Grid */}
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
                  {services.map((service, index) => (
                    <tr
                      key={service.id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-3 py-2">{index + 1}</td>
                      <td className="px-3 py-2">{service.name}</td>
                      <td className="px-3 py-2">{service.service_amount}</td>
                      <td className="px-3 py-2">{service.salon_amount}</td>
                      <td className="px-3 py-2">{service.barber}</td>
                      <td className="px-3 py-2">{service.barber_amount}</td>
                      <td className="px-3 py-2">{service.barber_assistant || "-"}</td>
                      <td className="px-3 py-2">{service.barber_assistant_amount}</td>
                      <td className="px-3 py-2">{service.scrubber_assistant || "-"}</td>
                      <td className="px-3 py-2">{service.scrubber_assistant_amount}</td>
                      <td className="px-3 py-2">{service.black_shampoo_assistant || "-"}</td>
                      <td className="px-3 py-2">{service.black_shampoo_assistant_amount || "-"}</td>
                      <td className="px-3 py-2">{service.black_shampoo_amount}</td>
                      <td className="px-3 py-2">{service.super_black_assistant || "-"}</td>
                      <td className="px-3 py-2">{service.super_black_assistant_amount || "-"}</td>
                      <td className="px-3 py-2">{service.super_black_amount}</td>
                      <td className="px-3 py-2">{service.black_mask_assistant || "-"}</td>
                      <td className="px-3 py-2">{service.black_mask_assistant_amount || "-"}</td>
                      <td className="px-3 py-2">{service.black_mask_amount}</td>
                      <td className="px-3 py-2">{formatEAT(service.service_timestamp)}</td>
                      <td className="px-3 py-2 space-x-1">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                          onClick={() => handleEditClick(service.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(service.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingService(null);
            }}
          >
            {editingService && (
              <ServiceForm
                serviceData={editingService}
                onSubmit={handleModalSubmit}
                onClose={() => {
                  setShowModal(false);
                  setEditingService(null);
                }}
                employees={Employees}
              />
            )}
          </Modal>

          <ConfirmModal
            isOpen={confirmModalOpen}
            message="Are you sure you want to delete this service?"
            onConfirm={confirmDelete}
            onClose={() => setConfirmModalOpen(false)}
          />
        </>
      ) : (
        <p>Salon not open today yet</p>
      )}
    </div>
  );
};

export default OwnerIncomeDailyReport;
