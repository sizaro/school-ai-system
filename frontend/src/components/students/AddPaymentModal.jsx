import { useState } from "react";
import { useData } from "../../context/DataContext";

export default function AddPaymentModal({ studentId, onClose, onCreated }) {
  const { addPayment } = useData();

  const [form, setForm] = useState({
    amount: "",
    type: "general",
    payment_method: "",
    payment_date: new Date().toISOString().split("T")[0],
    receipt: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, receipt: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("amount", form.amount);
      data.append("type", form.type);
      data.append("payment_method", form.payment_method);
      data.append("payment_date", form.payment_date);
      if (form.receipt) data.append("receipt", form.receipt);

      await addPayment(studentId, data);
      onCreated(); // close modal
    } catch (err) {
      console.error("Add payment error:", err);
      setError("Failed to add payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Add Payment</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label>Amount (UGX)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="tuition">Tuition</option>
              <option value="registration">Registration</option>
              <option value="general">General</option>
            </select>
          </div>

          <div>
            <label>Payment Method</label>
            <input
              type="text"
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Payment Date</label>
            <input
              type="date"
              name="payment_date"
              value={form.payment_date}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label>Receipt (optional)</label>
            <input type="file" name="receipt" onChange={handleFileChange} />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}