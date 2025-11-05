import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [clockings, setClockings] = useState([]);
  const [lateFees, setLateFees] = useState([]);
  const [tagFees, setTagFees] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false); // Only used for fetchUsers
  const [user, setUser] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "/api";

  // ---------- Fetch All ----------
  const fetchAllData = async () => {
    try {
      const [clockingsRes, servicesRes] = await Promise.all([
        axios.get(`${API_URL}/clockings`),
        axios.get(`${API_URL}/services`),
      ]);
      setClockings(clockingsRes.data);
      setServices(servicesRes.data);
      console.log("all services in the data context:", servicesRes.data);
    } catch (err) {
      console.error("Error fetching static data:", err);
    }
  };

  // ---------- Fetch Sessions ----------
  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_URL}/sessions`);
      setSessions(res.data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  // ---------- Reports ----------
  const fetchDailyData = async (date) => {
    try {
      const formatDate = (d) => new Date(d).toISOString().split("T")[0];
      const res = await axios.get(`${API_URL}/reports/daily`, {
        params: { date: formatDate(date) },
      });
      const data = res.data;

      setServices(data.services);
      setExpenses(data.expenses);
      setAdvances(data.advances);
      setClockings(data.clockings);
      setUsers(data.users);
      setTagFees(data.tagFees);
      setLateFees(data.lateFees);
      return data;
    } catch (err) {
      console.error("Error fetching daily report:", err);
      throw err;
    }
  };

  const fetchWeeklyData = async (start, end) => {
    try {
      const formatDate = (date) => date.toISOString().split("T")[0];
      const res = await axios.get(`${API_URL}/reports/weekly`, {
        params: { startDate: formatDate(start), endDate: formatDate(end) },
      });
      const data = res.data;
      setServices(data.services);
      setExpenses(data.expenses);
      setAdvances(data.advances);
      return data;
    } catch (err) {
      console.error("Error fetching weekly report:", err);
    }
  };

  const fetchMonthlyData = async (year, month) => {
    try {
      const res = await axios.get(`${API_URL}/reports/monthly`, {
        params: { year, month },
      });
      const data = res.data;
      setServices(data.services);
      setExpenses(data.expenses);
      setAdvances(data.advances);
      return data;
    } catch (err) {
      console.error("Error fetching monthly report:", err);
      throw err;
    }
  };

  const fetchYearlyData = async (year) => {
    try {
      const res = await axios.get(`${API_URL}/reports/yearly`, { params: { year } });
      const data = res.data;
      setServices(data.services);
      setExpenses(data.expenses);
      setAdvances(data.advances);
      return data;
    } catch (err) {
      console.error("Error fetching yearly report:", err);
    }
  };

  // ---------- Services CRUD ----------
  const fetchServiceById = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/services/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching service by ID:", err);
      throw err;
    }
  };

  const updateService = async (id, formData) => {
    try {
      const res = await axios.put(`${API_URL}/services/${id}`, formData);
      await fetchAllData();
      return res.data;
    } catch (err) {
      console.error("Error updating service:", err);
      throw err;
    }
  };

  const updateServicet = async (id, formData) => {
    try {
      const res = await axios.put(`${API_URL}/servicet/${id}`, formData);
      await fetchAllData();
      return res.data;
    } catch (err) {
      console.error("Error updating service:", err);
      throw err;
    }
  };

  const deleteService = async (id) => {
    try {
      await axios.delete(`${API_URL}/services/${id}`);
      await fetchAllData();
    } catch (err) {
      console.error("Error deleting service:", err);
      throw err;
    }
  };

  // ---------- Employees CRUD ----------
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
      console.log("users in context:", res.data);
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
      await axios.delete(`${API_URL}/users/${id}`);
      await fetchUsers();
    } catch (err) {
      console.error(`error deleting user`, err);
      throw err;
    }
  };

  // ---------- Advances ----------
  const fetchAdvances = async () => {
    try {
      const res = await axios.get(`${API_URL}/advances`);
      setAdvances(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching advances:", err);
      throw err;
    }
  };

  const fetchAdvanceById = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/advances/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching advance by ID:", err);
      throw err;
    }
  };

  const createAdvance = async (advanceData) => {
    try {
      const res = await axios.post(`${API_URL}/advances`, advanceData);
      await fetchAdvances();
      return res.data;
    } catch (err) {
      console.error("Error creating advance:", err);
      throw err;
    }
  };

  const updateAdvance = async (id, advanceData) => {
    try {
      const res = await axios.put(`${API_URL}/advances/${id}`, advanceData);
      await fetchAdvances();
      return res.data;
    } catch (err) {
      console.error("Error updating advance:", err);
      throw err;
    }
  };

  const deleteAdvance = async (id) => {
    try {
      await axios.delete(`${API_URL}/advances/${id}`);
      await fetchAdvances();
    } catch (err) {
      console.error("Error deleting advance:", err);
      throw err;
    }
  };

  // ---------- Expenses ----------
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API_URL}/expenses`);
      setExpenses(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching expenses:", err);
      throw err;
    }
  };

  const fetchExpenseById = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/expenses/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching expense by ID:", err);
      throw err;
    }
  };

  const createExpense = async (expenseData) => {
    try {
      const res = await axios.post(`${API_URL}/expenses`, expenseData);
      await fetchExpenses();
      return res.data;
    } catch (err) {
      console.error("Error creating expense:", err);
      throw err;
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      const res = await axios.put(`${API_URL}/expenses/${id}`, expenseData);
      await fetchExpenses();
      return res.data;
    } catch (err) {
      console.error("Error updating expense:", err);
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API_URL}/expenses/${id}`);
      await fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
      throw err;
    }
  };

  // ---------- Late Fees ----------
  const fetchLateFees = async () => {
    try {
      const res = await axios.get(`${API_URL}/fees/late_fees`);
      setLateFees(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching late fees:", err);
      throw err;
    }
  };

  const fetchLateFeeById = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/fees/late_fees/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching late fee by ID:", err);
      throw err;
    }
  };

  const createLateFee = async (lateFeeData) => {
    try {
      const res = await axios.post(`${API_URL}/fees/late_fees`, lateFeeData);
      await fetchLateFees();
      return res.data;
    } catch (err) {
      console.error("Error creating late fee:", err);
      throw err;
    }
  };

  const updateLateFee = async (id, lateFeeData) => {
    try {
      const res = await axios.put(`${API_URL}/fees/late_fees/${id}`, lateFeeData);
      await fetchLateFees();
      return res.data;
    } catch (err) {
      console.error("Error updating late fee:", err);
      throw err;
    }
  };

  const deleteLateFee = async (id) => {
    try {
      await axios.delete(`${API_URL}/fees/late_fees/${id}`);
      await fetchLateFees();
    } catch (err) {
      console.error("Error deleting late fee:", err);
      throw err;
    }
  };

  // ---------- Tag Fees ----------
  const fetchTagFees = async () => {
    try {
      const res = await axios.get(`${API_URL}/fees/tag`);
      setTagFees(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching tag fees:", err);
      throw err;
    }
  };

  const fetchTagFeeById = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/fees/tag/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching tag fee by ID:", err);
      throw err;
    }
  };

  const createTagFee = async (tagFeeData) => {
    try {
      const res = await axios.post(`${API_URL}/fees/tag_fees`, tagFeeData);
      await fetchTagFees();
      return res.data;
    } catch (err) {
      console.error("Error creating tag fee:", err);
      throw err;
    }
  };

  const updateTagFee = async (id, tagFeeData) => {
    try {
      const res = await axios.put(`${API_URL}/fees/tag/${id}`, tagFeeData);
      await fetchTagFees();
      return res.data;
    } catch (err) {
      console.error("Error updating tag fee:", err);
      throw err;
    }
  };

  const deleteTagFee = async (id) => {
    try {
      await axios.delete(`${API_URL}/fees/tag/${id}`);
      await fetchTagFees();
    } catch (err) {
      console.error("Error deleting tag fee:", err);
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

  // ---------- Send Form ----------
  const sendFormData = async (formIdentifier, formData) => {
    try {
      let res;
      switch (formIdentifier) {
        case "createService":
          res = await axios.post(`${API_URL}/services`, formData);
          await fetchAllData();
          break;
        case "createAdvance":
          res = await axios.post(`${API_URL}/advances`, formData);
          await fetchAllData();
          break;
        case "createExpense":
          res = await axios.post(`${API_URL}/expenses`, formData);
          await fetchAllData();
          break;
        case "createClocking":
          res = await axios.post(`${API_URL}/clockings`, formData);
          await fetchAllData();
          break;
        case "updateClocking":
          res = await axios.put(`${API_URL}/clockings`, formData);
          await fetchAllData();
          break;
        case "openSalon":
        case "closeSalon":
          res =
            formIdentifier === "openSalon"
              ? await axios.post(`${API_URL}/sessions`, formData)
              : await axios.put(`${API_URL}/sessions`, formData);
          await fetchSessions();
          break;
        default:
          throw new Error("Unknown form identifier: " + formIdentifier);
      }

      return res.data;
    } catch (err) {
      console.error(`Error in sendFormData for ${formIdentifier}:`, err);
      throw err;
    }
  };

  // ---------- useEffect ----------
  useEffect(() => {
    const initializeApp = async () => {
      try {
        fetchSessions();        // ✅ fetch sessions in background
      } catch (err) {
        console.error("Error initializing app:", err);
      }
    };

    initializeApp();

    const interval = setInterval(fetchSessions, 60 * 1000); // refresh sessions every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(()=>{
    checkAuth();
  }, [])


useEffect(() => {
  let didCancel = false;
  const loadData = async () => {
    try {
      // Run all fetches in parallel for faster load
      await Promise.all([
        fetchUsers(),
        fetchservices(),
        fetchAdvances(),
        fetchTagFees(),
        fetchLateFees(),
        fetchExpenses(),
      ]);
    } catch (err) {
      console.error("❌ Error while loading data:", err);
    } finally {
      // ✅ even if something fails, don't stay stuck loading
      if (!didCancel) {
        setIsDataLoaded(true);
      }
    }
  };

  loadData();

  // ⏰ Safety timeout: after 5 seconds, show dashboard even if data is incomplete
  const timeout = setTimeout(() => {
    if (!didCancel) {
      setIsDataLoaded(true);
    }
  }, 50000);

  return () => {
    didCancel = true;
    clearTimeout(timeout);
  };
}, []);
  // ---------- Export ----------
  return (
    <DataContext.Provider
      value={{
        user,
        services,
        users,
        expenses,
        advances,
        clockings,
        sessions,
        loading,
        lateFees,
        tagFees,
        isDataLoaded,
        fetchAllData,
        sendFormData,
        fetchDailyData,
        fetchWeeklyData,
        fetchMonthlyData,
        fetchYearlyData,
        fetchServiceById,
        updateService,
        updateServicet,
        deleteService,
        fetchUsers,
        fetchUserById,
        createUser,
        updateUser,
        deleteUser,
        fetchAdvances,
        fetchAdvanceById,
        createAdvance,
        updateAdvance,
        deleteAdvance,
        fetchExpenses,
        fetchExpenseById,
        createExpense,
        updateExpense,
        deleteExpense,
        loginUser,
        checkAuth,
        logoutUser,
        fetchLateFeeById,
        createLateFee,
        updateLateFee,
        deleteLateFee,
        fetchTagFees,
        fetchTagFeeById,
        createTagFee,
        updateTagFee,
        deleteTagFee,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
