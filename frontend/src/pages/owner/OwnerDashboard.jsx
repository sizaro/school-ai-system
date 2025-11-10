import { useState, useEffect } from "react";
import Modal from "../../components/Modal.jsx";
import ServiceForm from "../../components/ServiceForm";
import ExpenseForm from "../../components/ExpenseForm";
import AdvanceForm from "../../components/AdvanceForm";
import ClockForm from "../../components/ClockForm";
import TagFeeForm from "../../components/TagFeeForm.jsx";
import LateFeeForm from "../../components/LateFeeForm.jsx";
import CancelReasonForm from "../../components/CancelReasonForm.jsx";
import Button from "../../components/Button";
import { useData } from "../../context/DataContext.jsx";

export default function OwnerDashboard() {
  const [modalType, setModalType] = useState(null);
  const [salonStatus, setSalonStatus] = useState("closed");
  const [selectedFee, setSelectedFee] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelServiceId, setCancelServiceId] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  const {
    services,
    sendFormData,
    sessions,
    users,
    fetchUsers,
    updateService,
    updateServicet,
    fetchServiceById,
    fetchLateFeeById,
    createLateFee,
    updateLateFee,
    deleteLateFee,
    fetchTagFees,
    fetchTagFeeById,
    createTagFee,
    updateTagFee,
    deleteTagFee,
    isDataLoaded,
  } = useData();


  const Employees = (users || []).filter(
    (user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase() !== "ntege saleh" &&
      user.role !== "customer"
  );


  const Customers = (users || []).filter((user) => user.role === "customer");

  const formatTime12h = (time24) => {
    if (!time24) return "N/A";
    let [hour, minute] = time24.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-UG", { timeZone: "Africa/Kampala" });
  };

  const handleSalonSession = async (status) => {
    try {
      let formData;
      if (status === "open") {
        formData = { openTime: new Date().toISOString(), closeTime: null, status: "open" };
        const res = await sendFormData("openSalon", formData);
        console.log("Salon opened:", res.data);
        setSalonStatus("open");
      } else if (status === "closed") {
        formData = { closeTime: new Date().toISOString(), status: "closed" };
        const res = await sendFormData("closeSalon", formData);
        console.log("Salon closed:", res.data);
        setSalonStatus("closed");
      }
    } catch (err) {
      console.error("Error handling salon session:", err.response?.data || err.message);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedFee(null);
  };

  const createService = async (formData) => { try { await sendFormData("createService", formData); closeModal(); } catch (err) { console.error("Failed to submit service", err); } };
  const createExpense = async (formData) => { try { await sendFormData("createExpense", formData); closeModal(); } catch (err) { console.error("Failed to submit expense", err); } };
  const createAdvance = async (formData) => { try { await sendFormData("createAdvance", formData); closeModal(); } catch (err) { console.error("Failed to submit advance", err); } };

  const handleClocking = async (type, formData) => {
    try {
      if (type === "clockin") await sendFormData("createClocking", formData);
      else if (type === "clockout") await sendFormData("updateClocking", formData);
      else console.error("Invalid clocking type");
    } catch (err) {
      console.error("Error handling clocking:", err.response?.data || err.message);
    }
  };

  const CreateTagFee = async (formData) => { try { await createTagFee(formData); closeModal(); } catch (err) { console.error("Failed to submit tag fee", err); } };
  const CreateLateFee = async (formData) => { try { await createLateFee(formData); closeModal(); } catch (err) { console.error("Failed to submit late fee", err); } };

  const appointmentsByStatus = {
    pending: services.filter((s) => s.status === "pending"),
    confirmed: services.filter((s) => s.status === "confirmed"),
    completed: services.filter((s) => s.status === "completed"),
    cancelled: services.filter((s) => s.status === "cancelled"),
  };

  useEffect(() => {
    if (sessions && sessions.length > 0) setSalonStatus(sessions[0].status);
    else setSalonStatus("closed");
  }, [sessions]);

useEffect(()=>{
  fetchUsers()
},[])

  const handleStatusUpdate = async (serviceId, newStatus, cancel_reason = null) => {
    try {
      const service = await fetchServiceById(serviceId);
      if (!service) return;
      await updateService(serviceId, { ...service, status: newStatus, customer_note: cancel_reason });
    } catch (err) {
      console.error("Failed to update service status", err);
    }
  };

  const handleStatusUpdatet = async (serviceId, newStatus) => {
    try {
      const service = await fetchServiceById(serviceId);
      if (!service) return;
      await updateServicet(serviceId, { ...service, status: newStatus });
    } catch (err) {
      console.error("Failed to update service status", err);
    }
  };

  return (
    <>

      <div className="space-y-10">
        <div className="space-y-10">
          {salonStatus === "closed" ? (
            <Button className="bg-green-400 hover:bg-green-300" onClick={() => handleSalonSession("open")}>Open Salon</Button>
          ) : (
            <Button onClick={() => handleSalonSession("closed")}>Close Salon</Button>
          )}
        </div>

        {/* Action Buttons */}
        <Button onClick={() => setModalType("service")}>Add Service</Button>
        <Button onClick={() => setModalType("expense")}>Add Expense</Button>
        <Button onClick={() => setModalType("advance")}>Add Advance</Button>
        <Button onClick={() => setModalType("clocking")}>Employee Clocking</Button>
        <Button onClick={() => setModalType("tagfee")}>Add Tag Fee</Button>
        <Button onClick={() => setModalType("latefee")}>Add Late Fee</Button>

        {/* Modals */}
        <Modal isOpen={modalType !== null} onClose={closeModal}>
          {modalType === "service" && <ServiceForm onSubmit={createService} onClose={closeModal} Services={services} Employees={Employees} createdBy="owner" serviceStatus={null} />}
          {modalType === "expense" && <ExpenseForm onSubmit={createExpense} onClose={closeModal} />}
          {modalType === "advance" && <AdvanceForm onSubmit={createAdvance} onClose={closeModal} />}
          {modalType === "clocking" && <ClockForm onSubmit={handleClocking} onClose={closeModal} employees={Employees} />}
          {modalType === "tagfee" && <TagFeeForm onSubmit={CreateTagFee} onClose={closeModal} feeData={selectedFee} employees={Employees || []} />}
          {modalType === "latefee" && <LateFeeForm onSubmit={CreateLateFee} onClose={closeModal} feeData={selectedFee} employees={Employees || []} />}
        </Modal>
      </div>

      {/* Tabbed Appointments */}
      <section className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Appointments</h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {["pending", "confirmed", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded ${activeTab === status ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              onClick={() => setActiveTab(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex flex-wrap gap-4">
          {appointmentsByStatus[activeTab].length > 0 ? (
            appointmentsByStatus[activeTab].map((s) => {
              const assigned = [
                { label: "Barber", id: s.barber_id },
                { label: "Scrubber", id: s.scrubber_assistant_id },
                { label: "Black Shampoo", id: s.black_shampoo_assistant_id },
                { label: "Super Black", id: s.super_black_assistant_id },
                { label: "Black Mask", id: s.black_mask_assistant_id },
                { label: "Aesthetician", id: s.barber_assistant_id },
              ]
                .filter((a) => a.id)
                .map((a) => {
                  const emp = Employees.find((e) => e.id === a.id);
                  return emp ? { label: a.label, name: `${emp.first_name} ${emp.last_name}` } : null;
                })
                .filter((a) => a !== null);

              const customer = Customers.find((c) => c.id === s.customer_id);

              return (
                <div key={s.id} className={`border rounded-lg p-4 w-[calc(33.333%-1rem)] min-w-[180px] ${activeTab === "pending" ? "bg-yellow-50 border-yellow-200" : activeTab === "confirmed" ? "bg-green-50 border-green-200" : activeTab === "completed" ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"}`}>
                  <p className="font-medium">{s.name}</p>
                  <p>Customer: {customer ? `${customer.first_name} ${customer.last_name}` : "N/A"}</p>
                  <p>Date: {formatDate(s.appointment_date)}</p>
                  <p>Time: {formatTime12h(s.appointment_time)}</p>

                  {assigned.length > 0 ? assigned.map((a, idx) => (
                    <p key={idx} className="text-sm text-gray-700">{a.label}: <span className="font-medium">{a.name}</span></p>
                  )) : <p className="text-sm text-gray-500">No staff assigned</p>}

                  {s.status === "cancelled" && s.cancel_reason && <p className="text-red-600 text-sm mt-2"><strong>Reason:</strong> {s.cancel_reason}</p>}

                  {/* Status Buttons */}
                  {activeTab === "pending" && (
                    <div className="flex gap-2 mt-2">
                      <Button onClick={() => handleStatusUpdate(s.id, "confirmed")}>Confirm</Button>
                      <Button onClick={() => { setCancelServiceId(s.id); setShowCancelModal(true); }}>Cancel</Button>
                    </div>
                  )}
                  {activeTab === "confirmed" && (
                    <div className="flex gap-2 mt-2">
                      <Button onClick={() => handleStatusUpdatet(s.id, "completed")}>Complete</Button>
                      <Button onClick={() => { setCancelServiceId(s.id); setShowCancelModal(true); }}>Cancel</Button>
                    </div>
                  )}
                </div>
              );
            })
          ) : <p className="text-gray-500">No {activeTab} appointments</p>}
        </div>
      </section>

      {/* Cancel Modal */}
      <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)}>
        <CancelReasonForm serviceId={cancelServiceId} onSubmit={handleStatusUpdate} onClose={() => setShowCancelModal(false)} />
      </Modal>
    </>
  );
}
