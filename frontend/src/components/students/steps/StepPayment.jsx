import React, { useMemo, useEffect } from "react";
import { useData } from "../../../context/DataContext";

export default function StepPayment({ formData, setFormData }) {
  const {
    financeTypes = [],
    financeStructures = [],
    terms = [],
    classes = [],

    // 👇 IMPORTANT: these must exist in your context
    fetchFinanceTypes,
    fetchFinanceStructures,
    fetchTerms,
    fetchClasses,
  } = useData();

  const student = formData.student || {};
  const guardian = formData.guardian || {};
  const medical = formData.medical || {};
  const payment = formData.payment || {};

  // ================= FETCH DATA ON MOUNT =================
  useEffect(() => {
    console.log("📦 Loading finance data...");

    fetchFinanceTypes?.();
    fetchFinanceStructures?.();
    fetchTerms?.();
    fetchClasses?.();
  }, []);

  // ================= DEBUG =================
  useEffect(() => {
    console.log("🧠 student:", student);
    console.log("💰 payment:", payment);
    console.log("🏗 financeStructures:", financeStructures);
  }, [student, payment, financeStructures]);

  // ================= MATCH STRUCTURE =================
  const matchedStructure = useMemo(() => {
    const classId = Number(student.class_id);
    const termId = Number(payment.term_id);
    const typeId = Number(payment.finance_type_id);

    console.log("🔍 Matching check:", {
      classId,
      termId,
      typeId,
      financeStructuresLength: financeStructures.length,
    });

    if (!classId || !termId || !typeId) return null;

    const match = financeStructures.find((item) => {
      return (
        Number(item.class_id) === classId &&
        Number(item.term_id) === termId &&
        Number(item.finance_type_id) === typeId &&
        item.is_active !== false
      );
    });

    console.log("🎯 matchedStructure:", match);

    return match || null;
  }, [
    student.class_id,
    payment.term_id,
    payment.finance_type_id,
    financeStructures,
  ]);

  // ================= AUTO-FILL AMOUNT =================
  useEffect(() => {
    const amount = matchedStructure?.amount;

    console.log("💡 Auto-fill amount:", amount);

    if (!amount) return;

    setFormData((prev) => {
      if (prev.payment?.amount === amount) return prev;

      return {
        ...prev,
        payment: {
          ...prev.payment,
          amount,
        },
      };
    });
  }, [matchedStructure, setFormData]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        [name]: files ? files[0] : value,
      },
    }));
  };

  return (
    <div className="space-y-6">

      {/* ================= PAYMENT DETAILS ================= */}
      <div className="bg-white border rounded-2xl p-5 space-y-4">

        <h3 className="text-xl font-semibold">
          Payment Details
        </h3>

        {/* TERM */}
        <div>
          <label>School Term</label>
          <select
            name="term_id"
            value={payment.term_id || ""}
            onChange={handleChange}
            className="w-full border p-3"
          >
            <option value="">Select Term</option>
            {terms.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* FINANCE TYPE */}
        <div>
          <label>Finance Type</label>
          <select
            name="finance_type_id"
            value={payment.finance_type_id || ""}
            onChange={handleChange}
            className="w-full border p-3"
          >
            <option value="">Select Type</option>
            {financeTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* AMOUNT */}
        <div>
          <label>Required Amount</label>
          <input
            disabled
            value={
              matchedStructure
                ? `${Number(matchedStructure.amount).toLocaleString()} UGX`
                : "No structure found"
            }
            className="w-full border p-3 bg-gray-100"
          />
        </div>

        {/* PAYMENT METHOD */}
        <select
          name="payment_method"
          value={payment.payment_method || ""}
          onChange={handleChange}
          className="w-full border p-3"
        >
          <option value="">Payment Method</option>
          <option value="cash">Cash</option>
          <option value="mobile_money">Mobile Money</option>
          <option value="bank">Bank</option>
        </select>

        {/* DATE */}
        <input
          type="date"
          name="payment_date"
          value={payment.payment_date || ""}
          onChange={handleChange}
          className="w-full border p-3"
        />

        {/* RECEIPT */}
        <input
          type="text"
          name="receipt_number"
          value={payment.receipt_number || ""}
          onChange={handleChange}
          placeholder="Receipt Number"
          className="w-full border p-3"
        />

        <input
          type="file"
          name="receipt"
          onChange={handleChange}
          className="w-full border p-3"
        />
      </div>

      {/* ================= FINAL REVIEW ================= */}
      <div className="border p-4 bg-gray-50">

        <h3>Final Review</h3>

        <p>
          Student: {student.firstName} {student.lastName}
        </p>

        <p>
          Class:{" "}
          {classes.find(
            (c) => Number(c.id) === Number(student.class_id)
          )?.name || "N/A"}
        </p>

        <p>
          Term:{" "}
          {terms.find(
            (t) => Number(t.id) === Number(payment.term_id)
          )?.name || "N/A"}
        </p>

        <p>
          Fee Type:{" "}
          {financeTypes.find(
            (f) =>
              Number(f.id) === Number(payment.finance_type_id)
          )?.name || "N/A"}
        </p>

        <p>
          Amount:{" "}
          {payment.amount
            ? `${Number(payment.amount).toLocaleString()} UGX`
            : "N/A"}
        </p>

      </div>
    </div>
  );
}