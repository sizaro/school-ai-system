import React, { useState, useEffect, useMemo } from "react";
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
    users = [],
    advances,
    expenses,
    sessions,
    sections, // <-- dynamic sections from context if available
    fetchUsers,
    fetchDailyData,
    deleteServiceTransaction,
    fetchServiceById,
    updateService,
    deleteService,
  } = useData();

  console.log("These are the services in the daily report page:\n", services);

  const Employees = (users || []).filter(
    (user) =>
      user &&
      `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase() !== "ntege saleh" &&
      user.role !== "customer"
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

  // Utility to pick service transaction id (handles variations)
  const txIdOf = (s) => s?.service_transaction_id ?? s?.transaction_id ?? s?.id ?? null;

  // ---- Modal Handlers ----
  const handleEditClick = async (serviceIdOrObj) => {
    // serviceIdOrObj can be an object or id; handle both
    const id = typeof serviceIdOrObj === "object" ? txIdOf(serviceIdOrObj) : serviceIdOrObj;
    if (!id) return console.error("No id provided for edit");
    const service = await fetchServiceById(id);
    setEditingService(service);
    setShowModal(true);
  };

  const handleModalSubmit = async (updatedService) => {
    await updateService(updatedService.id, updatedService);
    await fetchDailyData(selectedDate);
    setShowModal(false);
    setEditingService(null);
  };

  const handleDelete = (serviceObjOrId) => {
    const id = typeof serviceObjOrId === "object" ? txIdOf(serviceObjOrId) : serviceObjOrId;
    setServiceToDelete(id);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (serviceToDelete) {
      try {
        await deleteServiceTransaction(serviceToDelete);
        await fetchDailyData(selectedDate);
      } catch (err) {
        console.error("Failed to delete service:", err);
      } finally {
        setConfirmModalOpen(false);
        setServiceToDelete(null);
      }
    }
  };

  // ---- Sections: dynamic ----
  // Prefer `sections` from context; if absent, infer from services list
  const sectionList = useMemo(() => {
    if (Array.isArray(sections) && sections.length > 0) {
      // map to canonical shape { id, name }
      return sections.map((sec) => ({
        id: sec.id,
        name: sec.section_name ?? sec.name ?? String(sec.id),
      }));
    }
    // infer from services
    const map = new Map();
    (services || []).forEach((s) => {
      const id = s.section_id ?? s.sectionId ?? s.section?.id ?? s.section_transaction_id ?? (s.section_name ? s.section_name : null);
      const name = s.section_name ?? s.section?.section_name ?? s.section?.name ?? (typeof id === "string" ? id : `Section ${id}`);
      const key = id ?? name;
      if (!map.has(key)) map.set(key, { id: id ?? name, name });
    });
    // if still empty, provide a fallback single section
    if (map.size === 0) {
      return [{ id: "default", name: "Default" }];
    }
    return Array.from(map.values());
  }, [sections, services]);

  // helper: returns services filtered by a section object (works with id or name)
  const servicesForSection = (section) => {
    if (!section) return [];
    // match by id if numeric-ish, else match by name
    return (services || []).filter((s) => {
      // prefer numeric id match
      if (section.id != null && s.section_id != null) return String(s.section_id) === String(section.id);
      // fallback to matching section_name
      if (section.name && s.section_name) return String(s.section_name).toLowerCase() === String(section.name).toLowerCase();
      return false;
    });
  };

  const calculateSectionTotals = (sectionServices) => {
    const gross = sectionServices.reduce((sum, s) => sum + (parseFloat(s.full_amount || s.service_amount || 0) || 0), 0);

    const employeeSalary = sectionServices.reduce((sum, s) => {
      if (!s.performers || !Array.isArray(s.performers)) return sum;
      const filtperf = s.performers.filter((p) => (p.role_name || "").toLowerCase() !== "salon");
      const performersTotal = filtperf.reduce((pSum, p) => pSum + (parseFloat(p.role_amount || p.earned_amount || 0) || 0), 0);
      return sum + performersTotal;
    }, 0);

    const salonIncome = sectionServices.reduce((sum, s) => sum + (parseFloat(s.salon_amount || 0) || 0), 0);

    return { gross, employeeSalary, salonIncome };
  };

  // Build dynamic summaries per section
  const dynamicSectionSummaries = useMemo(() => {
    return sectionList.map((sec) => {
      const secServices = servicesForSection(sec);
      const totals = calculateSectionTotals(secServices);
      return {
        id: sec.id,
        name: sec.name,
        services: secServices,
        totals,
      };
    });
  }, [sectionList, services]);

  // ---- Totals Calculation (overall) ----
  const calculateTotals = (servicesList, expensesList, advancesList, tagFeesList, lateFeesList) => {
    const grossIncome = (servicesList || []).reduce((sum, s) => sum + (parseFloat(s.full_amount || s.service_amount || 0) || 0), 0);

    const employeesSalary = (servicesList || []).reduce((sum, s) => {
      if (!s.performers || !Array.isArray(s.performers)) return sum;
      return sum + s.performers.reduce((pSum, p) => pSum + (parseFloat(p.amount || p.role_amount || p.earned_amount || 0) || 0), 0);
    }, 0);

    const totalExpenses = (expensesList || []).reduce((sum, e) => sum + (parseFloat(e.amount || 0) || 0), 0);
    const totalAdvances = (advancesList || []).reduce((sum, a) => sum + (parseFloat(a.amount || 0) || 0), 0);
    const totalLateFees = (lateFeesList || []).reduce((sum, l) => sum + (parseFloat(l.amount || 0) || 0), 0);
    const totaltagFees = (tagFeesList || []).reduce((sum, t) => sum + (parseFloat(t.amount || 0) || 0), 0);

    const netEmployeeSalary = Math.max(0, employeesSalary - (totalAdvances + totalLateFees + totaltagFees));
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
    cashAtHand,
  } = calculateTotals(services, expenses, advances, tagFees, lateFees);

  // ---- Format UTC Date to EAT ----
  const formatEAT = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-UG", { timeZone: "Africa/Kampala", hour: "2-digit", minute: "2-digit" });
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

  const handleDayChange = (e) => {
    const pickedDate = e.target.value;
    setSelectedDate(pickedDate);
    fetchDailyData(pickedDate);
  };

  useEffect(() => {
    fetchDailyData(selectedDate);
    fetchUsers();
  }, []);

  // ---- Service Count Summary ----
  const serviceCount = services.reduce((acc, service) => {
    const name = service.service_name || service.service_name || "Unknown";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  // ---------- Render ----------
  return (
    <div className="income-page max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">{reportDate} Daily Income Report</h1>

      <div className="mb-6 flex items-center gap-4">
        <div>
          <label className="block mb-1 font-medium">Pick a day:</label>
          <input type="date" value={selectedDate} onChange={handleDayChange} className="border rounded p-2" />
        </div>

        <div className="ml-auto text-right">
          <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
        </div>
      </div>

      {session ? (
        <>
          {/* SESSION INFO */}
          <section className="bg-white shadow rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">{reportDate}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <p className="text-sm text-gray-600">Opened</p>
                <p className="font-medium">{formatEAT(session.open_time)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Closed</p>
                <p className="font-medium">{session.close_time ? formatEAT(session.close_time) : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium">{liveDuration} {!session.close_time && "(Counting...)"}</p>
              </div>
            </div>
          </section>

          {/* DYNAMIC SECTION SUMMARIES */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Section Summaries</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dynamicSectionSummaries.map((sec) => (
                <div key={sec.id} className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-md font-semibold text-blue-700 mb-2">{sec.name} Section Summary</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="p-3 rounded border bg-blue-50">
                      <div className="text-sm text-gray-700">Gross Income</div>
                      <div className="text-xl font-bold">{(sec.totals.gross || 0).toLocaleString()} UGX</div>
                    </div>

                    <div className="p-3 rounded border bg-blue-50">
                      <div className="text-sm text-gray-700">Employees Salary</div>
                      <div className="text-xl font-bold">{(sec.totals.employeeSalary || 0).toLocaleString()} UGX</div>
                    </div>

                    <div className="p-3 rounded border bg-blue-100">
                      <div className="text-sm text-gray-700">Salon Income</div>
                      <div className="text-xl font-bold text-green-700">{(sec.totals.salonIncome || 0).toLocaleString()} UGX</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SUMMARY */}
          <section className="bg-white shadow rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="summary-box p-3 border rounded">
                <div className="text-sm text-gray-600">Gross Income</div>
                <div className="font-bold text-lg">{grossIncome.toLocaleString()} UGX</div>
              </div>
              <div className="summary-box p-3 border rounded">
                <div className="text-sm text-gray-600">Employees Salary</div>
                <div className="font-bold text-lg">{employeesSalary.toLocaleString()} UGX</div>
              </div>
              <div className="summary-box p-3 border rounded">
                <div className="text-sm text-gray-600">Expenses</div>
                <div className="font-bold text-lg">{totalExpenses.toLocaleString()} UGX</div>
              </div>

              <div className="summary-box p-3 border rounded">
                <div className="text-sm text-gray-600">Advances</div>
                <div className="font-bold text-lg">{totalAdvances.toLocaleString()} UGX</div>
              </div>
              <div className="summary-box p-3 border rounded">
                <div className="text-sm text-gray-600">Tag Fees</div>
                <div className="font-bold text-lg">{totaltagFees.toLocaleString()} UGX</div>
              </div>
              <div className="summary-box p-3 border rounded">
                <div className="text-sm text-gray-600">Late Fees</div>
                <div className="font-bold text-lg">{totalLateFees.toLocaleString()} UGX</div>
              </div>

              <div className="summary-box p-3 border rounded">
                <div className="text-sm text-gray-600">Net Employees Salary</div>
                <div className="font-bold text-lg">{netEmployeeSalary.toLocaleString()} UGX</div>
              </div>
              <div className="summary-box p-3 border rounded">
                <div className="text-sm text-gray-600">Salon Net Income</div>
                <div className="font-bold text-lg">{netIncome.toLocaleString()} UGX</div>
              </div>
              <div className="summary-box p-3 border rounded">
                <div className="text-sm text-gray-600">Total Cash Available</div>
                <div className="font-bold text-lg">{cashAtHand.toLocaleString()} UGX</div>
              </div>
            </div>
          </section>

          {/* SERVICE SUMMARY (COUNT) */}
          <section className="bg-white shadow rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Service Summary (By Count)</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(serviceCount).map(([name, count]) => (
                <div key={name} className="px-3 py-2 border rounded bg-gray-50">
                  {name}: <strong>{count}</strong>
                </div>
              ))}
            </div>
          </section>

          {/* SERVICES TABLE */}
          <section className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Services Rendered</h2>
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto border border-gray-200 rounded">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-blue-700 text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left">No.</th>
                    <th className="px-3 py-2 text-left">Service Name</th>
                    <th className="px-3 py-2 text-left">Section</th>
                    <th className="px-3 py-2 text-left">Full Amount</th>
                    <th className="px-3 py-2 text-left">Salon Amount</th>
                    <th className="px-3 py-2 text-left">Performers</th>
                    <th className="px-3 py-2 text-left">Time</th>
                    <th className="px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length > 0 ? (
                    services.map((s, index) => {
                      const rowId = txIdOf(s);
                      return (
                        <tr key={rowId ?? index} className="border-b hover:bg-gray-50">
                          <td className="px-3 py-2 align-top">{index + 1}</td>
                          <td className="px-3 py-2 align-top">{s.service_name}</td>
                          <td className="px-3 py-2 align-top">{s.section_name}</td>
                          <td className="px-3 py-2 align-top">{(parseFloat(s.full_amount || 0) || 0).toLocaleString()} UGX</td>
                          <td className="px-3 py-2 align-top">{(parseFloat(s.salon_amount || 0) || 0).toLocaleString()} UGX</td>
                          <td className="px-3 py-2 align-top">
                            {s.performers && s.performers.length > 0
                              ? s.performers
                                  .map((p) => `${p.employee_name || "N/A"} (${p.role_name || "N/A"} - ${p.role_amount || p.amount || 0} )`)
                                  .join(", ")
                              : "N/A"}
                          </td>
                          <td className="px-3 py-2 align-top">{formatEAT(s.service_time ?? s.service_timestamp ?? s.service_time)}</td>
                          <td className="px-3 py-2 align-top flex gap-2">
                            <button
                              onClick={() => handleEditClick(s)}
                              className="text-blue-700 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(s)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
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
        <ServiceForm serviceData={editingService} Employees={Employees} onSubmit={handleModalSubmit} />
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
