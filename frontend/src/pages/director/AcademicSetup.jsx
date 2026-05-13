import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useData } from "../../context/DataContext";

import Modal from "../../components/common/Modal";
import TermForm from "../../components/academics/TermForm";
import ClassForm from "../../components/academics/ClassForm";
import SubjectForm from "../../components/academics/SubjectForm";
import TuitionForm from "../../components/academics/TuitionForm";
import FinanceTypeForm from "../../components/academics/FinanceTypeForm";

export default function AcademicSetup() {
  const {
    terms,
    classes,
    subjects,
    finances,
    financeTypes,

    fetchTerms,
    fetchClasses,
    fetchSubjects,
    fetchTuition,
    fetchFinanceTypes,

    createTerm,
    createClass,
    createSubject,
    createTuition,
    createFinanceType,

    updateTerm,
    updateClass,
    updateSubject,
    updateTuition,
    updateFinanceType,

    deleteTerm,
    deleteClass,
    deleteSubject,
    deleteTuition,
    deleteFinanceType,
  } = useData();

  // ---------------- TAB ----------------
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "terms";

  const setTab = (value) => {
    setSearchParams({ tab: value });
  };

  // ---------------- MODAL ----------------
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // ---------------- LOAD ----------------
  useEffect(() => {
    fetchTerms();
    fetchClasses();
    fetchSubjects();
    fetchTuition();
    fetchFinanceTypes(); // NEW
  }, []);

console.log(subjects)



  // ---------------- OPEN ----------------
  const openCreate = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  // ---------------- SAVE ----------------
  const handleSave = async (data) => {
    try {
      if (tab === "terms") {
        editItem ? await updateTerm(editItem.id, data) : await createTerm(data);
      }

      if (tab === "classes") {
        editItem ? await updateClass(editItem.id, data) : await createClass(data);
      }

      if (tab === "subjects") {
        editItem ? await updateSubject(editItem.id, data) : await createSubject(data);
      }

      if (tab === "tuition") {
        editItem ? await updateTuition(editItem.id, data) : await createTuition(data);
      }

      if (tab === "finance-types") {
        editItem
          ? await updateFinanceType(editItem.id, data)
          : await createFinanceType(data);
      }

      setModalOpen(false);
      setEditItem(null);

      fetchTerms();
      fetchClasses();
      fetchSubjects();
      fetchTuition();
      fetchFinanceTypes();
    } catch (err) {
      console.error("SAVE ERROR:", err);
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    try {
      if (tab === "terms") await deleteTerm(id);
      if (tab === "classes") await deleteClass(id);
      if (tab === "subjects") await deleteSubject(id);
      if (tab === "tuition") await deleteTuition(id);
      if (tab === "finance-types") await deleteFinanceType(id);

      fetchTerms();
      fetchClasses();
      fetchSubjects();
      fetchTuition();
      fetchFinanceTypes();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  // ---------------- DATA SWITCH ----------------
  const currentData =
  tab === "terms"
    ? terms
    : tab === "classes"
    ? classes
    : tab === "subjects"
    ? subjects
    : tab === "finance-types"
    ? financeTypes
    : finances;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Academic Setup</h1>

      {/* ---------------- TABS ---------------- */}
      <div className="flex gap-4 border-b pb-2">
        {[
          "terms",
          "classes",
          "subjects",
          "finances",
          "finance-types",
        ].map((t) => (
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
              {tab === "terms" && <div className="font-bold">{item.name}</div>}

              {tab === "classes" && <div className="font-bold">{item.name}</div>}

              {tab === "subjects" && (
  <div className="font-bold">
    {item.subject_name} (Class {item.class_name})
  </div>
)}

              {tab === "finances" && (
                <div className="font-bold">
                  {item.class_name} | {item.term_name} | UGX {item.amount}
                </div>
              )}

              {tab === "finance-types" && (
                <div className="font-bold">{item.name}</div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => openEdit(item)} className="text-blue-600">
                Edit
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- MODAL ---------------- */}
      <Modal
        open={modalOpen}
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

        {tab === "finances" && (
          <TuitionForm
            initialData={editItem}
            classes={classes}
            terms={terms}
            onSubmit={handleSave}
          />
        )}

        {tab === "finance-types" && (
          <FinanceTypeForm
            initialData={editItem}
            onSubmit={handleSave}
          />
        )}
      </Modal>
    </div>
  );
}