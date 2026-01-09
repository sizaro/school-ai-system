const BursarDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bursar Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Fees Collected</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            UGX 120,500,000
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Outstanding Balances</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">
            UGX 34,200,000
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Payments Today</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            UGX 3,450,000
          </p>
        </div>
      </div>
    </div>
  );
};

export default BursarDashboard;
