import { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";

export default function EditTuitionModal({ payment, studentId, onClose, }) {
  const { updateTuitionPayment, user } = useData();

  const [form, setForm] = useState({
    payment_date: "",
    amount: "",
    payment_method: "cash",
    receipt: null,
  });
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (payment) {
      setForm({
        payment_date: payment.payment_date?.split("T")[0] || "",
        amount: payment.amount || "",
        payment_method: payment.payment_method || "cash",
        receipt: null,
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, receipt: e.target.files[0] }));
  };

  const handleSave = async (e) => {
  e.preventDefault();
  setLoading(true);
   setError("");

   console.log("NOw handling save")

  try {
    const data = new FormData();
    data.append("amount", form.amount);
    data.append("payment_method", form.payment_method);
    data.append("payment_date", form.payment_date);
    data.append("id", payment.id);
    data.append("student_id", studentId);
    data.append("recorded_by", user.id);

    if (form.receipt) {
      data.append("receipt", form.receipt);
    }

    console.log("🚀 Sending update...");

    const updated = await updateTuitionPayment(studentId, data);

    console.log("✅ Updated response:", updated);

    if (!updated) {
      console.warn("⚠️ No data returned from backend");
      return;
    }
    onClose();

  } catch (err) {
    console.error("❌ Update error:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Tuition Payment</h2>
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
          <label>Payment Data</label>
          <input
          type="date"
          name="payment_date"
          value={form.payment_date}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />
        </div>
        
        <div>
          <label>Amount</label>
          <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="w-full border p-2 mb-3 rounded"
        />
        </div>

        <select
          name="payment_method"
          value={form.payment_method}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        >
          <option value="cash">Cash</option>
          <option value="mobile">Mobile Money</option>
          <option value="bank">Bank</option>
        </select>

          <div>
            <label>Receipt</label>
            <input
              type="file"
              name="receipt"
              onChange={handleFileChange}
              className="w-full mb-4"
            />
          </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}