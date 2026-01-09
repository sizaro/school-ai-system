const FeesManagement = () => {
  const feeStructures = [
    {
      id: 1,
      className: "Primary 1",
      tuition: 350000,
      development: 50000,
      total: 400000,
    },
    {
      id: 2,
      className: "Primary 5",
      tuition: 450000,
      development: 70000,
      total: 520000,
    },
    {
      id: 3,
      className: "Senior 1",
      tuition: 650000,
      development: 100000,
      total: 750000,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Fees Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Tuition (UGX)</th>
              <th className="p-3 text-left">Development (UGX)</th>
              <th className="p-3 text-left">Total (UGX)</th>
            </tr>
          </thead>
          <tbody>
            {feeStructures.map((fee) => (
              <tr key={fee.id} className="border-t">
                <td className="p-3">{fee.className}</td>
                <td className="p-3">{fee.tuition.toLocaleString()}</td>
                <td className="p-3">{fee.development.toLocaleString()}</td>
                <td className="p-3 font-semibold">
                  {fee.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
          Update Fee Structure
        </button>
      </div>
    </div>
  );
};

export default FeesManagement;
