import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";

export default function PerformanceForm() {
  const {
    students,
    terms,
    fetchStudents,
    fetchTerms,
    fetchClassSubjects,
    addPerformance,
    user
  } = useData();

  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState({
    student_id: "",
    subject_id: "",
    term_id: "",
    assessment_type: "midterm",
    marks_obtained: "",
    marks_total: "",
    grade: "",
    remarks: ""
  });

  useEffect(() => {
    fetchStudents();
    fetchTerms();
  }, []);

  // 🔥 When student changes → load subjects
  useEffect(() => {
    const loadSubjects = async () => {
      if (!form.student_id) return;

      const student = students.find(s => s.id == form.student_id);
      if (!student) return;

      const res = await fetchClassSubjects(student.class_id);
      setSubjects(res);
    };

    loadSubjects();
  }, [form.student_id, students]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 auto grade (optional smart feature)
  const calculateGrade = (score, total) => {
    const percent = (score / total) * 100;

    if (percent >= 80) return "A";
    if (percent >= 70) return "B";
    if (percent >= 60) return "C";
    if (percent >= 50) return "D";
    return "F";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const grade = calculateGrade(
        Number(form.marks_obtained),
        Number(form.marks_total)
      );

      const payload = {
        ...form,
        marks_obtained: Number(form.marks_obtained),
        marks_total: Number(form.marks_total),
        grade,
        recorded_by: user?.id
      };

      await addPerformance(payload);

      alert("Performance recorded");

      setForm({
        student_id: "",
        subject_id: "",
        term_id: "",
        assessment_type: "midterm",
        marks_obtained: "",
        marks_total: "",
        grade: "",
        remarks: ""
      });

      setSubjects([]);

    } catch (err) {
      console.error(err);
      alert("Error saving performance");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Record Performance</h2>

      <select name="student_id" value={form.student_id} onChange={handleChange} required>
        <option value="">Select Student</option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.first_name} {s.last_name}
          </option>
        ))}
      </select>

      <select name="subject_id" value={form.subject_id} onChange={handleChange} required>
        <option value="">Select Subject</option>
        {subjects.map((sub) => (
          <option key={sub.id} value={sub.id}>
            {sub.name}
          </option>
        ))}
      </select>

      <select name="term_id" value={form.term_id} onChange={handleChange} required>
        <option value="">Select Term</option>
        {terms.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <select name="assessment_type" onChange={handleChange}>
        <option value="beginning">Beginning</option>
        <option value="midterm">Midterm</option>
        <option value="endterm">End Term</option>
      </select>

      <input
        type="number"
        name="marks_obtained"
        placeholder="Marks Obtained"
        value={form.marks_obtained}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="marks_total"
        placeholder="Total Marks"
        value={form.marks_total}
        onChange={handleChange}
        required
      />

      <textarea
        name="remarks"
        placeholder="Remarks"
        value={form.remarks}
        onChange={handleChange}
      />

      <button type="submit">Save Performance</button>
    </form>
  );
}