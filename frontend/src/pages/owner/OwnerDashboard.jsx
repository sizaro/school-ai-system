import { useState, useEffect } from "react";
import Modal from "../../components/Modal.jsx";
import ServiceForm from "../../components/ServiceForm";
import SectionForm from "../../components/SectionForm.jsx";
import NewServiceForm from "../../components/NewServiceForm.jsx";
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
  const [selectedItem, setSelectedItem] = useState(null); // For editing sections/services
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
    sections,
    serviceDefinitions,
    createServiceDefinition,
    updateServiceDefinition,
    serviceRoles,
    fetchSections,
    createSection,
    updateSection,
    deleteSection,
    fetchServiceDefinitions,
    fetchServiceRoles,
    createServiceTransaction,
  } = useData();

  const Employees = (users || []).filter(
    (user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase() !== "ntege saleh" &&
      user.role !== "customer"
  );

  const createdbyID = (users || []).find(
    (user) => `${user.role}`.toLowerCase() === "owner"
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
    setSelectedItem(null);
  };

  const createService = async (formData) => {
    try {
      await sendFormData("createService", formData);
      closeModal();
    } catch (err) {
      console.error("Failed to submit service", err);
    }
  };

  const createExpense = async (formData) => {
    try {
      await sendFormData("createExpense", formData);
      closeModal();
    } catch (err) {
      console.error("Failed to submit expense", err);
    }
  };

  const createAdvance = async (formData) => {
    try {
      await sendFormData("createAdvance", formData);
      closeModal();
    } catch (err) {
      console.error("Failed to submit advance", err);
    }
  };

  const handleClocking = async (type, formData) => {
    try {
      if (type === "clockin") await sendFormData("createClocking", formData);
      else if (type === "clockout") await sendFormData("updateClocking", formData);
      else console.error("Invalid clocking type");
    } catch (err) {
      console.error("Error handling clocking:", err.response?.data || err.message);
    }
  };

  const CreateTagFee = async (formData) => {
    try {
      await createTagFee(formData);
      closeModal();
    } catch (err) {
      console.error("Failed to submit tag fee", err);
    }
  };

  const CreateLateFee = async (formData) => {
    try {
      await createLateFee(formData);
      closeModal();
    } catch (err) {
      console.error("Failed to submit late fee", err);
    }
  };

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

  useEffect(() => {
    fetchUsers();
    fetchSections();
    fetchServiceDefinitions();
  }, []);

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

  const handleEditSection = (section) => {
    setSelectedItem(section);
    setModalType("edit_section");
  };

  const handleEditServiceDefinition = (serviceDef) => {
    setSelectedItem(serviceDef);
    setModalType("edit_service_definition");
  };

  return (
    <>
      <div className="space-y-10">
        <div className="space-y-10">
          {salonStatus === "closed" ? (
            <Button className="bg-green-400 hover:bg-green-300" onClick={() => handleSalonSession("open")}>
              Open Salon
            </Button>
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

        {/* New Setup Section */}
        <h2 className="text-lg font-semibold mt-10">Service Setup</h2>
        <div className="flex gap-3 mt-3">
          <Button onClick={() => setModalType("new_section")}>Add Section</Button>
          <Button onClick={() => setModalType("new_service_definition")}>Add New Service</Button>
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

        {/* Sections Table */}
        <section className="mt-6">
          <h3 className="text-md font-semibold mb-2">Sections</h3>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections && sections.length > 0 ? (
                sections.map((section) => (
                  <tr key={section.id}>
                    <td className="border px-4 py-2">{section.section_name}</td>
                    <td className="border px-4 py-2 flex gap-2">
                      <Button onClick={() => handleEditSection(section)}>Edit</Button>
                      <Button onClick={() => deleteSection(section.id)}>Delete</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border px-4 py-2" colSpan={2}>No sections available</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Service Definitions Table */}
        <section className="mt-6">
          <h3 className="text-md font-semibold mb-2">Service Definitions</h3>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Section</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {serviceDefinitions && serviceDefinitions.length > 0 ? (
                serviceDefinitions.map((service) => (
                  <tr key={service.id}>
                    <td className="border px-4 py-2">{service.name}</td>
                    <td className="border px-4 py-2">{sections.find(s => s.id === service.section_id)?.name || "N/A"}</td>
                    <td className="border px-4 py-2 flex gap-2">
                      <Button onClick={() => handleEditServiceDefinition(service)}>Edit</Button>
                      <Button onClick={() => deleteServiceDefinition(service.id)}>Delete</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border px-4 py-2" colSpan={3}>No service definitions available</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Modals */}
        <Modal isOpen={modalType !== null} onClose={closeModal}>
          {modalType === "service" && (
            <ServiceForm
              onSubmit={createServiceTransaction}
              onClose={closeModal}
              Services={serviceDefinitions}
              Roles={serviceRoles}
              Employees={Employees}
              Sections={sections}
              createdBy={createdbyID.id}
              serviceStatus={null}
            />
          )}
          {modalType === "expense" && <ExpenseForm onSubmit={createExpense} onClose={closeModal} />}
          {modalType === "advance" && <AdvanceForm onSubmit={createAdvance} onClose={closeModal} />}
          {modalType === "clocking" && <ClockForm onSubmit={handleClocking} onClose={closeModal} employees={Employees} />}
          {modalType === "tagfee" && <TagFeeForm onSubmit={CreateTagFee} onClose={closeModal} feeData={selectedFee} employees={Employees || []} />}
          {modalType === "latefee" && <LateFeeForm onSubmit={CreateLateFee} onClose={closeModal} feeData={selectedFee} employees={Employees || []} />}
          {modalType === "new_section" && (
            <SectionForm
              onSubmit={createSection}
              onClose={closeModal}
              sectionData={null}
            />
          )}
          {modalType === "edit_section" && (
            <SectionForm
              onSubmit={(data) => updateSection(selectedItem.id, data)}
              onClose={closeModal}
              sectionData={selectedItem}
            />
          )}
          {modalType === "new_service_definition" && (
            <NewServiceForm
              onSubmit={createServiceDefinition}
              onClose={closeModal}
              Sections={sections}
            />
          )}
          {modalType === "edit_service_definition" && (
            <NewServiceForm
              onSubmit={(data) => updateServiceDefinition(selectedItem.id, data)}
              onClose={closeModal}
              Sections={sections}
              serviceData={selectedItem}
            />
          )}
        </Modal>

        {/* Cancel Modal */}
        <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)}>
          <CancelReasonForm serviceId={cancelServiceId} onSubmit={handleStatusUpdate} onClose={() => setShowCancelModal(false)} />
        </Modal>
      </div>
    </>
  );
}
