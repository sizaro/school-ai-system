const TeacherDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold text-lg">My Classes</h3>
          <p className="text-gray-600">Classes assigned to you</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold text-lg">Students</h3>
          <p className="text-gray-600">Students under your care</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold text-lg">Pending Results</h3>
          <p className="text-gray-600">Results to be submitted</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
