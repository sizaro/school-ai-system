import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";



const DataContext = createContext();


export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);


  const navigate = useNavigate();

  const SOCKET_API_URL = import.meta.env.VITE_API_URL || "https://medanfoafricacommunityschool.onrender.com";
  const API_URL = import.meta.env.VITE_API_URL || "/api";

  const socket = io(SOCKET_API_URL.replace("/api", ""), {
    withCredentials: true,
  transports: ["websocket"],
  secure: true
});


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
      await fetchUsers(); // ✅ fetchUsers handles loading
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


  useEffect(() => {
  // Listen for new appointments
  socket.on("appointment_created", (payload) => {
    console.log("Appointment received via socket:", payload);
    fetchServiceTransactionsApp();
  });

  return () => {
    socket.off("appointment_created");
  };
}, []);

  // ---------- Export ----------
  return (
    <DataContext.Provider
      value={{
        user,
        users,
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
        resetPassword
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
