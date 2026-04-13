import { useEffect, useState } from "react";

export default function SubjectForm({ initialData, classes, onSubmit }) {
  const [form, setForm] = useState({
    subject_id: "",
    class_id: "",
    subject_name: "",
    class_name: "",
  });


  useEffect(() => {
  if (initialData) {
    setForm({
      subject_id: initialData.subject_id,
      class_id: initialData.class_id,
      subject_name: initialData.subject_name,
      class_name: initialData.class_name,
    });
  }
}, [initialData]);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(form);
    }}>

      <input
        value={form.subject_name}
        onChange={(e) =>
          setForm({ ...form, subject_name: e.target.value })
        }
      />

      <input
        value={form.class_name}
        onChange={(e) =>
          setForm({ ...form, class_name: e.target.value })
        }
      />

      <button>Save</button>
    </form>
  );
}