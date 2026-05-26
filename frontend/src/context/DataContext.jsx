import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";



const DataContext = createContext();


export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [terms, setTerms] = useState([]);
const [classes, setClasses] = useState([]);
const [subjects, setSubjects] = useState([]);
const [tuition, setTuition] = useState([]);
const [financeTypes, setFinanceTypes] = useState([]);
const [financeStructures, setFinanceStructures] = useState([]);
const [grades, setGrades] = useState([]);

  const navigate = useNavigate();

  const SOCKET_API_URL = import.meta.env.VITE_API_URL || "https://medanfoafricacommunityschool.onrender.com";
  const API_URL = import.meta.env.VITE_API_URL || "/api";

//   const socket = io(SOCKET_API_URL.replace("/api", ""), {
//     withCredentials: true,
//   transports: ["websocket"],
//   secure: true
// });


const uploadMultipleFiles = async (formData) => {
  try {
    const res = await axios.post(`${API_URL}/flexible-upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { success: true, files: res.data.files };
  } catch (err) {
    console.error("Error uploading files:", err);
    return { success: false, message: err.response?.data?.message || "Server error" };
  }
};



  // ---------- Employees CRUD ----------
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching employees:", err);
      throw err;
  };}

  const fetchUserById = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/users/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching employee by ID:", err);
      throw err;
    }
  };

  const createUser = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/users`, userData);
      await fetchUsers();
      return res.data;
    } catch (err) {
      console.error(`error creating ${userData.role}`, err);
      throw err;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const res = await axios.put(`${API_URL}/users/${id}`, userData);
      await fetchUsers();
      return res.data;
    } catch (err) {
      console.error(`error updating ${userData.role}`, err);
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`, {
  withCredentials: true,
});
      await fetchUsers();
    } catch (err) {
      console.error(`error deleting user`, err);
      throw err;
    }
  };

  // ---------- Auth ----------
  const loginUser = async (credentials) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, credentials, {
        withCredentials: true,
      });
      const { user } = res.data;
      setUser(user);

      if (!user) {
        throw new Error("Invalid login response — user missing");
      }

      return user;
    } catch (err) {
      console.error("Error during loginUser:", err);
      throw err;
    }
  };

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/check`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
      console.error("Auth check failed:", err);
      navigate("/");
    }
  };

  const logoutUser = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      setUser(null);
      navigate("/");
    }
  };


  // inside DataProvider

const forgotPassword = async (email) => {
  try {
    setLoading(true);
    const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    setLoading(false);
    return { success: true, message: res.data.message };
  } catch (err) {
    setLoading(false);
    console.error("Error sending password reset email:", err);
    return { success: false, message: err.response?.data?.message || "Server error" };
  }
};


const resetPassword = async (payload) => {
  try {
    setLoading(true);
    const res = await axios.post(`${API_URL}/auth/reset-password`, payload);
    setLoading(false);
    return { success: true, message: res.data.message };
  } catch (err) {
    setLoading(false);
    console.error("Error resetting password:", err);
    return { success: false, message: err.response?.data?.message || "Server error" };
  }
};




const registerStudent = async (data) => {
  try {
    const formData = new FormData();

    // --------------------------
    // STUDENT (non-file fields)
    // --------------------------
    Object.entries(data.student || {}).forEach(([key, value]) => {
      if (key !== "photo" && value !== null && value !== undefined) {
        formData.append(`student[${key}]`, value);
      }
    });

    // ✅ FILE: student photo (IMPORTANT FIX)
    if (data.student?.photo) {
      formData.append("student_photo", data.student.photo);
    }

    // --------------------------
    // GUARDIAN
    // --------------------------
    Object.entries(data.guardian || {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(`guardian[${key}]`, value);
      }
    });

    // --------------------------
    // MEDICAL
    // --------------------------
    Object.entries(data.medical || {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(`medical[${key}]`, value);
      }
    });

    // --------------------------
    // PAYMENT
    // --------------------------
    Object.entries(data.payment || {}).forEach(([key, value]) => {
      if (key !== "receipt" && value !== null && value !== undefined) {
        formData.append(`payment[${key}]`, value);
      }
    });

    // ✅ FILE: receipt upload
    if (data.payment?.receipt) {
      formData.append("receipt", data.payment.receipt);
    }

    const res = await axios.post(
      `${API_URL}/students/register`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    await fetchStudents();
    return { success: true, data: res.data };

  } catch (err) {
    console.error("Error registering student:", err);
    return {
      success: false,
      message: err.response?.data?.message || "Server error",
    };
  }
};

const fetchStudents = async () => {
  try {
    const res = await axios.get(`${API_URL}/students`);
    setStudents(res.data); 
    console.log("Fetched students:", res.data); // 🔥 check the structure
    return res.data;
  } catch (err) {
    console.error("Error fetching students:", err);
    throw err;
  }
};

const fetchStudentById = async (id) => {
  try {
    console.log("fetching Student profile Id :", id);
    const res = await axios.get(`${API_URL}/students/${id}`);
    setStudentProfile(res.data);
    console.log("Student profile:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching student:", err);
    throw err;
  }
};



const deleteStudent = async (id) => {
  try {
    await axios.delete(`${API_URL}/students/${id}`);
    await fetchStudents(); // refresh list
  } catch (err) {
    console.error("Error deleting student:", err);
    throw err;
  }
};

const updateStudentInfo = async (studentId, data) => {
  await axios.put(`${API_URL}/students/${studentId}/info`, data);
  const updated = await fetchStudentById(studentId);
  setStudentProfile(updated);
};

const updateGuardian = async (studentId, data) => {
  await axios.put(`${API_URL}/students/${studentId}/guardian`, data);
  const updated = await fetchStudentById(studentId);
  setStudentProfile(updated);
};

const updateMedical = async (studentId, data) => {
  await axios.put(`${API_URL}/students/${studentId}/medical`, data);
  const updated = await fetchStudentById(studentId);
  setStudentProfile(updated);
};

const updateAdmission = async (studentId, data) => {
  await axios.put(`${API_URL}/students/${studentId}/admission`, data);
  const updated = await fetchStudentById(studentId);
  setStudentProfile(updated);
};

const updateStudentPhoto = async (id, formData) => {
  console.log("🔥 Calling updateStudentPhoto:", id, formData.get("photo"));

  try {
    const response = await axios.put(`${API_URL}/students/${id}/photo`, formData);
    console.log("🔥 Axios response:", response.data);

    await fetchStudentById(id);

    return response.data;
  } catch (error) {
    console.error("🔥 Error updating student photo:", error);
    throw error;
  }
};

const removeStudentPhoto = async (id) => {
  console.log("🔥 Calling removeStudentPhoto:", id);

  try {
    const response = await axios.delete(`${API_URL}/students/${id}/photo`);
    console.log("🔥 Delete response:", response.data);

    await fetchStudentById(id);

    return response.data;
  } catch (error) {
    console.error("🔥 Error removing student photo:", error);
    throw error;
  }
};

const updatePayment = async (studentId, data) => {
  await axios.put(`${API_URL}/students/${studentId}/payment`, data);
  const updated = await fetchStudentById(studentId);
  setStudentProfile(updated);
};

// Add a payment (general)
const addPayment = async (studentId, formData) => {
  await axios.post(
    `${API_URL}/students/${studentId}/payment`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  const updated = await fetchStudentById(studentId);
  setStudentProfile(updated);
};

// Delete a tuition payment
const deletePayment = async (studentId, paymentId) => {
  await axios.delete(`${API_URL}/students/${studentId}/payment/${paymentId}`);
  const updated = await fetchStudentById(studentId);
  setStudentProfile(updated);
};

const fetchTerms = async () => {
  const res = await axios.get(`${API_URL}/terms`);
  setTerms(res.data)
  return res.data;
};

const fetchTermById = async (id) => {
  const res = await axios.get(`${API_URL}/terms/${id}`);
  return res.data;
};

const createTerm = async (data) => {
  const res = await axios.post(`${API_URL}/terms`, data);
  setTerms(res.data)
  fetchTerms()
  return res.data;
};

const updateTerm = async (id, data) => {
  const res = await axios.put(`${API_URL}/terms/${id}`, data);
  fetchTerms()
  return res.data;
};

const deleteTerm = async (id) => {
  const res = await axios.delete(`${API_URL}/terms/${id}`);
  fetchTerms();
  return res.data;
};

const fetchClasses = async () => {
  const res = await axios.get(`${API_URL}/classes`);
  setClasses(res.data)
  console.log("classes in context", classes)
  return res.data;
};

const fetchClassById = async (id) => {
  const res = await axios.get(`${API_URL}/classes/${id}`);
  return res.data;
};

const createClass = async (data) => {
  const res = await axios.post(`${API_URL}/classes`, data);
  return res.data;
};

const updateClass = async (id, data) => {
  const res = await axios.put(`${API_URL}/classes/${id}`, data);
  fetchClasses();
  return res.data;
};

const deleteClass = async (id) => {
  const res = await axios.delete(`${API_URL}/classes/${id}`);
  fetchClasses();
  return res.data;
};



const fetchSubjects = async () => {
  const res = await axios.get(`${API_URL}/subjects`);
  console.log("subjects in context", res.data)
  setSubjects(res.data)
  return res.data;
};

const fetchSubjectById = async (id) => {
  const res = await axios.get(`${API_URL}/subjects/${id}`);
  return res.data;
};

const createSubject = async (data) => {
  const res = await axios.post(`${API_URL}/subjects`, data);
  fetchSubjects()
  return res.data;
};

const updateSubject = async (id, data) => {
  const res = await axios.put(`${API_URL}/subjects/${id}`, data);
  return res.data;
};

const deleteSubject = async (id) => {
  const res = await axios.delete(`${API_URL}/subjects/${id}`);
  return res.data;
};

const fetchTuition = async () => {
  const res = await axios.get(`${API_URL}/tuition`);
  return res.data;
};

const fetchTuitionById = async (id) => {
  const res = await axios.get(`${API_URL}/tuition/${id}`);
  return res.data;
};

const createTuition = async (data) => {
  const res = await axios.post(`${API_URL}/tuition`, data);
  return res.data;
};

const updateTuition = async (id, data) => {
  const res = await axios.put(`${API_URL}/tuition/${id}`, data);
  return res.data;
};

const deleteTuition = async (id) => {
  const res = await axios.delete(`${API_URL}/tuition/${id}`);
  return res.data;
};

const fetchFinanceTypes = async () => {
  try {
    const res = await axios.get(`${API_URL}/finance-types`);
    setFinanceTypes(res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching finance types:", err);
    throw err;
  }
};

const createFinanceType = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/finance-types`, data);
    await fetchFinanceTypes();
    return res.data;
  } catch (err) {
    console.error("Error creating finance type:", err);
    throw err;
  }
};

const updateFinanceType = async (id, data) => {
  try {
    const res = await axios.put(`${API_URL}/finance-types/${id}`, data);
    await fetchFinanceTypes();
    return res.data;
  } catch (err) {
    console.error("Error updating finance type:", err);
    throw err;
  }
};


const deleteFinanceType = async (id) => {
  try {
    await axios.delete(`${API_URL}/finance-types/${id}`);
    await fetchFinanceTypes();
  } catch (err) {
    console.error("Error deleting finance type:", err);
    throw err;
  }
};


// ============================
// FINANCE STRUCTURE CRUD
// ============================

// GET ALL
const fetchFinanceStructures = async () => {
  try {
    const res = await axios.get(`${API_URL}/finance-structures`);
    setFinanceStructures(res.data);
  } catch (err) {
    console.error("Error fetching finance structures:", err);
    throw err;
  }
};

// CREATE
const createFinanceStructure = async (data) => {
  try {
    console.log("ADD PAYMENT PAYLOAD:", data);
    const res = await axios.post(`${API_URL}/finance-structures`, data);

    setFinanceStructures((prev) => [...prev, res.data]);

    return res.data;
  } catch (err) {
    console.error("Error creating finance structure:", err);
    throw err;
  }
};

// UPDATE
const updateFinanceStructure = async (id, data) => {
  try {
    const res = await axios.put(
      `${API_URL}/finance-structures/${id}`,
      data
    );

    setFinanceStructures((prev) =>
      prev.map((item) =>
        item.id === id ? res.data : item
      )
    );

    return res.data;
  } catch (err) {
    console.error("Error updating finance structure:", err);
    throw err;
  }
};

// DELETE
const deleteFinanceStructure = async (id) => {
  try {
    await axios.delete(`${API_URL}/finance-structures/${id}`);

    setFinanceStructures((prev) =>
      prev.filter((item) => item.id !== id)
    );
  } catch (err) {
    console.error("Error deleting finance structure:", err);
    throw err;
  }
};

// GET BY CLASS + TERM (for dropdown logic later)
const getFinanceStructureByClassTerm = async (class_id, term_id) => {
  try {
    const res = await axios.get(
      `${API_URL}/finance-structures/by-class/${class_id}/term/${term_id}`
    );

    return res.data;
  } catch (err) {
    console.error("Error fetching structure by class/term:", err);
    return [];
  }
};



const fetchStudentPayments = async (studentId) => {
  console.log("🔥 fetchStudentPayments CALLED");
  console.log("👉 studentId:", studentId);

  try {
    const url = `${API_URL}/students/${studentId}/payments`;

    console.log("👉 URL:", url);

    const res = await axios.get(url);

    console.log("✅ PAYMENTS RESPONSE:", res.data);

    return res.data;
  } catch (err) {
    console.error("❌ Error fetching student payments:", err);
    return [];
  }
};


const fetchStudentFinanceSummary = async (studentId) => {
  console.log("🔥 fetchStudentFinanceSummary CALLED");
  console.log("👉 studentId:", studentId);

  try {
    const url = `${API_URL}/students/${studentId}/finance-summary`;

    console.log("👉 URL:", url);

    const res = await axios.get(url);

    console.log("✅ FINANCE SUMMARY RESPONSE:", res.data);

    return res.data;
  } catch (err) {
    console.error("❌ Error fetching finance summary:", err);
    return null;
  }
};


// ================= FETCH GRADES =================
const fetchGrades = async () => {
  try {
    const res = await axios.get(`${API_URL}/grades`);
    setGrades(res.data);

    console.log("Fetched grades:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching grades:", err);
    throw err;
  }
};

// ================= CREATE GRADE =================
const createGrade = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/grades`, data);

    setGrades((prev) => [...prev, res.data]);

    console.log("Created grade:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error creating grade:", err);
    throw err;
  }
};

// ================= UPDATE GRADE =================
const updateGrade = async (id, data) => {
  try {
    const res = await axios.put(`${API_URL}/grades/${id}`, data);

    setGrades((prev) =>
      prev.map((g) => (g.id === id ? res.data : g))
    );

    console.log("Updated grade:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error updating grade:", err);
    throw err;
  }
};

// ================= DELETE GRADE =================
const deleteGrade = async (id) => {
  try {
    await axios.delete(`${API_URL}/grades/${id}`);

    setGrades((prev) => prev.filter((g) => g.id !== id));

    console.log("Deleted grade:", id);
    return true;
  } catch (err) {
    console.error("Error deleting grade:", err);
    throw err;
  }
};


useEffect(() => {
  fetchFinanceTypes();
}, []);



//   useEffect(() => {
//   // Listen for new appointments
//   socket.on("appointment_created", (payload) => {
//     console.log("Appointment received via socket:", payload);
//     fetchServiceTransactionsApp();
//   });

//   return () => {
//     socket.off("appointment_created");
//   };
// }, []);

  // ---------- Export ----------
  return (
    <DataContext.Provider
      value={{
        user,
        users,
        students,
        studentProfile,
        terms,
        classes,
        subjects,
        tuition,
        financeTypes,
        financeStructures,
        grades,
        uploadMultipleFiles,
        fetchUsers,
        fetchUserById,
        createUser,
        updateUser,
        deleteUser,
        loginUser,
        checkAuth,
        logoutUser,
        forgotPassword,
        resetPassword,
        registerStudent,
        fetchStudents,
        fetchStudentById,
        deleteStudent,
        updateStudentPhoto,
        removeStudentPhoto,
        updateStudentInfo,
        updateAdmission,
        updateGuardian,
        updateMedical,
        updatePayment,
        addPayment,
        updatePayment,
        deletePayment,
        fetchTerms,
        updateTerm,
        deleteTerm,
        fetchSubjects,
        updateSubject,
        fetchClasses,
        updateClass,
        deleteClass,
        fetchTuition,
        createTerm,
        createSubject,
        deleteSubject,
        createClass,
        createTuition,
        fetchFinanceTypes,
        createFinanceType,
        updateFinanceType,
        deleteFinanceType,
        fetchFinanceStructures,
        createFinanceStructure,
        updateFinanceStructure,
        deleteFinanceStructure,
        fetchStudentPayments,
        fetchStudentFinanceSummary,
        fetchGrades,
        createGrade,
        updateGrade,
        deleteGrade,
        
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
