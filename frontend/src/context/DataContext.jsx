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

    // Student fields
    Object.entries(data.student).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(`student[${key}]`, value);
      }
    });

    // Guardian
    Object.entries(data.guardian).forEach(([key, value]) => {
      formData.append(`guardian[${key}]`, value);
    });

    // Medical
    Object.entries(data.medical).forEach(([key, value]) => {
      formData.append(`medical[${key}]`, value);
    });

    // Payment
    Object.entries(data.payment).forEach(([key, value]) => {
      formData.append(`payment[${key}]`, value);
    });

    const res = await axios.post(`${API_URL}/students/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
  await axios.post(`${API_URL}/students/${studentId}/payment`, formData);
  const updated = await fetchStudentById(studentId);
  setStudentProfile(updated);
};


const updateTuitionPayment = async (studentId, formData) => {
  console.log("Now using update tuition function")
  const res = await axios.put(`${API_URL}/students/${studentId}/payment/tuition`,
    formData,
  );

  console.log("Data returned after updating Tuition", res.data)
 const updated = await fetchStudentById(studentId);
  setStudentProfile(updated);

  return res.data;
};

// Delete a tuition payment
const deleteTuitionPayment = async (studentId, formData) => {
  await axios.delete(`${API_URL}/students/${studentId}/payment/tuition`, { data: formData });
  const updated = await fetchStudentById(studentId);
  setStudentProfile(updated);
};


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
        updateTuitionPayment,
        deleteTuitionPayment,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
