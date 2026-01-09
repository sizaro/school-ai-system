const Payments = () => {
  const payments = [
    {
      id: 1,
      student: "John Doe",
      className: "Primary 5",
      amount: 250000,
      method: "Cash",
      date: "2026-01-05",
    },
    {
      id: 2,
      student: "Mary Achieng",
      className: "Senior 1",
      amount: 400000,
      method: "Mobile Money",
      date: "2026-01-06",
    },
    {
      id: 3,
      student: "Peter Okello",
      className: "Primary 1",
      amount: 150000,
      method: "Bank",
      date: "2026-01-07",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payments</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Amount (UGX)</th>
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((pay) => (
              <tr key={pay.id} className="border-t">
                <td className="p-3">{pay.student}</td>
                <td className="p-3">{pay.className}</td>
                <td className="p-3 font-semibold">
                  {pay.amount.toLocaleString()}
                </td>
                <td className="p-3">{pay.method}</td>
                <td className="p-3">{pay.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <button className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700">
          Record New Payment
        </button>
      </div>
    </div>
  );
};

export default Payments;
