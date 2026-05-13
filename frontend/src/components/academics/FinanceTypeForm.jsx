export default function FinanceTypeForm({ initialData, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name: e.target.name.value,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        defaultValue={initialData?.name || ""}
        placeholder="Finance Type (e.g Tuition, Development, Registration)"
        className="w-full border p-2"
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Save
      </button>
    </form>
  );
}