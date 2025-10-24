import { useState, useEffect } from "react";
import Modal from "../../components/Modal.jsx";
import ServiceForm from "../../components/ServiceForm.jsx";
import Button from "../../components/Button.jsx";
import { useData } from "../../context/DataContext.jsx";

export default function CustomerDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [adverts, setAdverts] = useState([]);
  const { employees, sendFormData } = useData();

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // ✅ Handle Appointment Submission
  const handleAppointmentSubmit = async (formData) => {
    try {
      await sendFormData("createAppointment", formData);
      alert("Appointment booked successfully!");
      closeModal();
    } catch (err) {
      console.error("Failed to submit appointment:", err);
      alert("Failed to book appointment. Please try again.");
    }
  };

  // ✅ Fetch Adverts (simulate or fetch from context/backend)
  useEffect(() => {
    const fetchAdverts = async () => {
      // Example placeholder adverts
      const promos = [
        { id: 1, title: "10% Off all Services", desc: "Book this week and save big!" },
        { id: 2, title: "Loyalty Bonus", desc: "Earn a free hair treatment after 5 visits!" },
      ];
      setAdverts(promos);
    };
    fetchAdverts();
  }, []);

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>

      {/* ✅ Special Adverts Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Special Offers</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {adverts.map((ad) => (
            <div key={ad.id} className="border p-4 rounded-xl shadow-sm bg-gray-50">
              <h3 className="text-lg font-semibold">{ad.title}</h3>
              <p className="text-gray-600">{ad.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Appointment Button */}
      <div className="text-center">
        <Button onClick={openModal} className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-xl">
          Book an Appointment
        </Button>
      </div>

      {/* ✅ Appointment Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal}>
        <ServiceForm
          employees={employees}
          onSubmit={handleAppointmentSubmit}
          onClose={closeModal}
          isCustomer={true}
          serviceStatus={"pending"}
          createdBy={"customer"}
        />
      </Modal>
    </div>
  );
}
