import { useState } from "react";
import Button from "./Button";

export default function CancelReasonForm({ serviceId, onSubmit, onClose }) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return alert("Please enter a reason for cancellation.");
    onSubmit(serviceId, "cancelled", reason);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Cancel Appointment
      </h2>
      <p className="text-sm text-gray-600">
        Please provide a short reason for cancelling this appointment.
      </p>

      <textarea
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
        rows="4"
        placeholder="Type your reason..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-black"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-red-500 hover:bg-red-400">
          Submit Reason
        </Button>
      </div>
    </form>
  );
}
