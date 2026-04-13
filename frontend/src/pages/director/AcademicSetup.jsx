import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useData } from "../../context/DataContext";

import Modal from "../../components/common/Modal";
import TermForm from "../../components/academics/TermForm";
import ClassForm from "../../components/academics/ClassForm";
import SubjectForm from "../../components/academics/SubjectForm";
import TuitionForm from "../../components/academics/TuitionForm";

export default function AcademicSetup() {
  const {
    terms,
    classes,
    subjects,
    tuition,

    fetchTerms,
    fetchClasses,
    fetchSubjects,
    fetchTuition,

    createTerm,
    createClass,
    createSubject,
    createTuition,

    updateTerm,
    updateClass,
    updateSubject,
    updateTuition,

    deleteTerm,
    deleteClass,
    deleteSubject,
    deleteTuition,
  } = useData();

  // ---------------- TAB (URL CONTROL) ----------------
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "terms";

  const setTab = (value) => {
    setSearchParams({ tab: value });
  };

  // ---------------- MODAL STATE ----------------
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    fetchTerms();
    fetchClasses();
    fetchSubjects();
    fetchTuition();
  }, []);

  // ---------------- OPEN MODAL ----------------
  const openCreate = () => {
    console.log("OPEN CREATE CLICKED - TAB:", tab);

    setEditItem(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    console.log("OPEN EDIT CLICKED:", item);

    setEditItem(item);
    setModalOpen(true);
  };

  // ---------------- SAVE ----------------
  const handleSave = async (data) => {
    console.log("🔥 SAVE CLICKED");
    console.log("TAB:", tab);
    console.log("DATA:", data);
    console.log("EDIT ITEM:", editItem);

    try {
      if (tab === "terms") {
        editItem
          ? await updateTerm(editItem.id, data)
          : await createTerm(data);
      }

      if (tab === "classes") {
        editItem
          ? await updateClass(editItem.id, data)
          : await createClass(data);
      }

      if (tab === "subjects") {
        editItem
          ? await updateSubject(editItem.id, data)
          : await createSubject(data);
      }

      if (tab === "tuition") {
        editItem
          ? await updateTuition(editItem.id, data)
          : await createTuition(data);
      }

      setModalOpen(false);
      setEditItem(null);

      console.log("✅ SAVE SUCCESS");

      fetchTerms();
      fetchClasses();
      fetchSubjects();
      fetchTuition();
    } catch (err) {
      console.error("❌ SAVE ERROR:", err);
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    console.log("DELETE CLICKED:", id);

    try {
      if (tab === "terms") await deleteTerm(id);
      if (tab === "classes") await deleteClass(id);
      if (tab === "subjects") await deleteSubject(id);
      if (tab === "tuition") await deleteTuition(id);

      fetchTerms();
      fetchClasses();
      fetchSubjects();
      fetchTuition();
    } catch (err) {
      console.error("❌ DELETE ERROR:", err);
    }
  };

  // ---------------- DATA ----------------
  const currentData =
    tab === "terms"
      ? terms
      : tab === "classes"
      ? classes
      : tab === "subjects"
      ? subjects
      : tuition;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Academic Setup</h1>

      {/* ---------------- TABS ---------------- */}
      <div className="flex gap-4 border-b pb-2">
        {["terms", "classes", "subjects", "tuition"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={
              tab === t
                ? "font-bold border-b-2 border-blue-500"
                : "text-gray-500"
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* ---------------- ADD ---------------- */}
      <button
        type="button"
        onClick={openCreate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Add {tab}
      </button>

      {/* ---------------- LIST ---------------- */}
      <div className="space-y-2">
        {currentData?.length === 0 && (
          <div className="text-gray-400 p-4 border rounded">
            No records found
          </div>
        )}

        {currentData?.map((item) => (
          <div
            key={item.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              {tab === "terms" && (
                <>
                  <div className="font-bold">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    {item.academic_year} |{" "}
                    {item.start_date?.split("T")[0]} →{" "}
                    {item.end_date?.split("T")[0]}
                  </div>
                </>
              )}

              {tab === "classes" && (
                <div className="font-bold">{item.name}</div>
              )}

              {tab === "subjects" && (
                <div className="font-bold">
                  {item.name} (Class {item.class_id})
                </div>
              )}

              {tab === "tuition" && (
                <div className="font-bold">
                  {item.class_name} | {item.term_name} | UGX {item.amount}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => openEdit(item)}
                className="text-blue-600"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- MODAL (FIXED) ---------------- */}
      <Modal
        open={modalOpen}   // ✅ FIXED HERE
        title={`${editItem ? "Edit" : "Add"} ${tab}`}
        onClose={() => {
          setModalOpen(false);
          setEditItem(null);
        }}
      >
        {tab === "terms" && (
          <TermForm initialData={editItem} onSubmit={handleSave} />
        )}

        {tab === "classes" && (
          <ClassForm initialData={editItem} onSubmit={handleSave} />
        )}

        {tab === "subjects" && (
          <SubjectForm
            initialData={editItem}
            classes={classes}
            onSubmit={handleSave}
          />
        )}

        {tab === "tuition" && (
          <TuitionForm
            initialData={editItem}
            classes={classes}
            terms={terms}
            onSubmit={handleSave}
          />
        )}
      </Modal>
    </div>
  );
}