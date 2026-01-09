const Results = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Student Results</h1>

      <div className="bg-white p-6 rounded shadow">
        <p className="text-gray-600 mb-4">
          Select a class and subject to upload or manage results.
        </p>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Upload Results
        </button>
      </div>
    </div>
  );
};

export default Results;
