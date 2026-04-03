import { useState } from "react";
import { useData } from "../../context/DataContext";

export default function EditPaymentModal({ student,onClose, onUpdated }) {
  const { updatePayment } = useData();

  const [form, setForm] = useState({
    amount: payment?.amount || "",
    receiptNumber: payment?.receipt_number || "",
    paymentDate: payment?.payment_date ? new Date(payment.payment_date).toISOString().split("T")[0] : "",
  });

  const handleSubmit = async () => {
    await updatePayment(student.student_id, { payment: form });
    onUpdated && onUpdated(); 
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-lg font-bold mb-4">Edit Payment</h2>
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Receipt Number"
          value={form.receiptNumber}
          onChange={(e) => setForm({ ...form, receiptNumber: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="date"
          value={form.paymentDate}
          onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}