import { useState, useEffect } from "react";
import Modal from "../../components/Modal.jsx";
import ServiceForm from "../../components/ServiceForm";
import ExpenseForm from "../../components/ExpenseForm";
import AdvanceForm from "../../components/AdvanceForm";
import ClockForm from "../../components/ClockForm";
import TagFeeForm from "../../components/TagFeeForm.jsx";
import LateFeeForm from "../../components/LateFeeForm.jsx";
import Button from "../../components/Button";
import { useData } from "../../context/DataContext.jsx";

export default function OwnerDashboard() {
  const [modalType, setModalType] = useState(null);
  const [salonStatus, setSalonStatus] = useState("closed");
  const [selectedFee, setSelectedFee] = useState(null);

  const { sendFormData, sessions, employees } = useData();

  // ✅ Handle Salon open/close
  const handleSalonSession = async (status) => {
    try {
      let formData;

      if (status === "open") {
        formData = {
          openTime: new Date().toISOString(),
          closeTime: null,
          status: "open",
        };

        const res = await sendFormData("openSalon", formData);
        console.log("Salon opened:", res.data);
        setSalonStatus(status);
      } else if (status === "closed") {
        formData = {
          closeTime: new Date().toISOString(),
          status: "closed",
        };

        const res = await sendFormData("closeSalon", formData);
        console.log("Salon closed:", res.data);
        setSalonStatus(status);
      }
    } catch (err) {
      console.error("Error handling salon session:", err.response?.data || err.message);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedFee(null);
  };

  // ✅ Create or edit a service
  const createService = async (formData) => {
    try {
      await sendFormData("createService", formData);
      closeModal();
    } catch (err) {
      console.error("Failed to submit service", err);
    }
  };

  // ✅ Create or edit expense
  const createExpense = async (formData) => {
    try {
      await sendFormData("createExpense", formData);
      closeModal();
    } catch (err) {
      console.error("Failed to submit expense", err);
    }
  };

  // ✅ Create or edit advance
  const createAdvance = async (formData) => {
    try {
      await sendFormData("createAdvance", formData);
      closeModal();
    } catch (err) {
      console.error("Failed to submit advance", err);
    }
  };

  // ✅ Clock in/out
  const handleClocking = async (type, formData) => {
    try {
      if (type === "clockin") {
        const res = await sendFormData("createClocking", formData);
        console.log("Clock in success:", res);
      } else if (type === "clockout") {
        const res = await sendFormData("updateClocking", formData);
        console.log("Clock out success:", res.data);
      } else {
        console.error("Invalid clocking type");
      }
    } catch (err) {
      console.error("Error handling clocking:", err.response?.data || err.message);
    }
  };

  // ✅ Handle Tag Fee submission
  const createTagFee = async (formData) => {
    try {
      await sendFormData("createTagFee", formData);
      closeModal();
    } catch (err) {
      console.error("Failed to submit tag fee", err);
    }
  };

  // ✅ Handle Late Fee submission
  const createLateFee = async (formData) => {
    try {
      await sendFormData("createLateFee", formData);
      closeModal();
    } catch (err) {
      console.error("Failed to submit late fee", err);
    }
  };

  // ✅ Check salon session on load
  useEffect(() => {
    const fetchStatus = async () => {
      if (sessions && sessions.length > 0) {
        const todaySession = sessions[0];
        console.log("Fetched salon status:", todaySession.status);
        setSalonStatus(todaySession.status);
      } else {
        setSalonStatus("closed");
      }
    };

    fetchStatus();
  }, [sessions]);

  return (
    <div className="space-y-10">
      <div className="space-y-10">
        {salonStatus === "closed" && (
          <Button
            className="bg-green-400 hover:bg-green-300"
            onClick={() => handleSalonSession("open")}
          >
            Open Salon
          </Button>
        )}
        {salonStatus === "open" && (
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
        {modalType === "service" && (
          <ServiceForm onSubmit={createService} onClose={closeModal} />
        )}
        {modalType === "expense" && (
          <ExpenseForm onSubmit={createExpense} onClose={closeModal} />
        )}
        {modalType === "advance" && (
          <AdvanceForm onSubmit={createAdvance} onClose={closeModal} />
        )}
        {modalType === "clocking" && (
          <ClockForm onSubmit={handleClocking} onClose={closeModal} />
        )}
        {modalType === "tagfee" && (
          <TagFeeForm
            onSubmit={createTagFee}
            onClose={closeModal}
            feeData={selectedFee}
            employees={employees || []}
          />
        )}
        {modalType === "latefee" && (
          <LateFeeForm
            onSubmit={createLateFee}
            onClose={closeModal}
            feeData={selectedFee}
            employees={employees || []}
          />
        )}
      </Modal>
    </div>
  );
}
