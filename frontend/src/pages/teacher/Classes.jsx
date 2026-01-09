const MyClasses = () => {
  const classes = [
    { id: 1, name: "Primary 5", subject: "Mathematics" },
    { id: 2, name: "Primary 6", subject: "Science" },
    { id: 3, name: "Senior 1", subject: "Biology" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Classes</h1>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Class</th>
              <th className="text-left p-3">Subject</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id} className="border-t">
                <td className="p-3">{cls.name}</td>
                <td className="p-3">{cls.subject}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyClasses;
