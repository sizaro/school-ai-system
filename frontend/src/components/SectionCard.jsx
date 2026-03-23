export default function SectionCard({ title, children, onEdit }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">{title}</h2>

        {onEdit && (
          <button
            onClick={onEdit}
            className="text-blue-600 text-sm hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {children}
    </div>
  );
}