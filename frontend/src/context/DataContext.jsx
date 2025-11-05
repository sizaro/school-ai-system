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
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "/api";

  // ---------- Fetch All ----------
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [clockingsRes, UsersRes, servicesRes] = await Promise.all([
        axios.get(`${API_URL}/clockings`),
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/services`),
      ]);
      setClockings(clockingsRes.data);
      setUsers(UsersRes.data);
      setServices(servicesRes.data);
      console.log("all services in the data context:", servicesRes.data);
    } catch (err) {
      console.error("Error fetching static data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Fetch Sessions ----------
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/sessions`);
      setSessions(res.data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Reports ----------
  const fetchDailyData = async (date) => {
    setLoading(true);
    try {
      const formatDate = (d) => new Date(d).toISOString().split("T")[0];
      const res = await axios.get(`${API_URL}/reports/daily`, {
        params: { date: formatDate(date) },
      });
      const data = res.data;

      console.log(`daily data in context`, res.data);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyData = async (start, end) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyData = async (year, month) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchYearlyData = async (year) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/reports/yearly`, { params: { year } });
      const data = res.data;
      setServices(data.services);
      setExpenses(data.expenses);
      setAdvances(data.advances);
      return data;
    } catch (err) {
      console.error("Error fetching yearly report:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- NEW: CRUD for Services ----------
  const fetchServiceById = async (id) => {
    setLoading(true);
    try {
      console.log("service id to be fetched", id);
      const res = await axios.get(`${API_URL}/services/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching service by ID:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id, formData) => {
    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/services/${id}`, formData);
      await fetchAllData(); // global refresh
      return res.data;
    } catch (err) {
      console.error("Error updating service:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateServicet = async (id, formData) => {
    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/servicet/${id}`, formData);
      await fetchAllData(); // global refresh
      return res.data;
    } catch (err) {
      console.error("Error updating service:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/services/${id}`);
      await fetchAllData();
    } catch (err) {
      console.error("Error deleting service:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ---------- Employees CRUD ----------
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
      console.log("users in context:", res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching employees:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/users/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching employee by ID:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/users`, userData);
      await fetchUsers();
      return res.data;
    } catch (err) {
      console.error(`error creating ${userData.role}`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/users/${id}`, userData);
      await fetchUsers();
      return res.data;
    } catch (err) {
      console.error(`error updating ${userData.role}`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      await fetchUsers();
    } catch (err) {
      console.error(`error in deleting`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ---------- Advances ----------
  const fetchAdvances = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/advances`);
      setAdvances(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching advances:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvanceById = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/advances/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching advance by ID:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createAdvance = async (advanceData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/advances`, advanceData);
      await fetchAdvances();
      return res.data;
    } catch (err) {
      console.error("Error creating advance:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAdvance = async (id, advanceData) => {
    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/advances/${id}`, advanceData);
      await fetchAdvances();
      return res.data;
    } catch (err) {
      console.error("Error updating advance:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAdvance = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/advances/${id}`);
      await fetchAdvances();
    } catch (err) {
      console.error("Error deleting advance:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ---------- Expenses ----------
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/expenses`);
      setExpenses(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching expenses:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenseById = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/expenses/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching expense by ID:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (expenseData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/expenses`, expenseData);
      await fetchExpenses();
      return res.data;
    } catch (err) {
      console.error("Error creating expense:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id, expenseData) => {
    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/expenses/${id}`, expenseData);
      await fetchExpenses();
      return res.data;
    } catch (err) {
      console.error("Error updating expense:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/expenses/${id}`);
      await fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ---------- Late Fees ----------
  const fetchLateFees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/fees/late_fees`);
      setLateFees(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching late fees:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchLateFeeById = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/fees/late_fees/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching late fee by ID:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createLateFee = async (lateFeeData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/fees/late_fees`, lateFeeData);
      await fetchLateFees();
      return res.data;
    } catch (err) {
      console.error("Error creating late fee:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLateFee = async (id, lateFeeData) => {
    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/fees/late_fees/${id}`, lateFeeData);
      await fetchLateFees();
      return res.data;
    } catch (err) {
      console.error("Error updating late fee:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLateFee = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/fees/late_fees/${id}`);
      await fetchLateFees();
    } catch (err) {
      console.error("Error deleting late fee:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ---------- Tag Fees ----------
  const fetchTagFees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/fees/tag`);
      setTagFees(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching tag fees:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchTagFeeById = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/fees/tag/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching tag fee by ID:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTagFee = async (tagFeeData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/fees/tag_fees`, tagFeeData);
      await fetchTagFees();
      return res.data;
    } catch (err) {
      console.error("Error creating tag fee:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTagFee = async (id, tagFeeData) => {
    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/fees/tag/${id}`, tagFeeData);
      await fetchTagFees();
      return res.data;
    } catch (err) {
      console.error("Error updating tag fee:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTagFee = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/fees/tag/${id}`);
      await fetchTagFees();
    } catch (err) {
      console.error("Error deleting tag fee:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ---------- Auth ----------
  const loginUser = async (credentials) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, credentials, {
        withCredentials: true,
      });
      const { user } = res.data;
      console.log("user in the data context:", user);

      setUser(user);

      if (!user) {
        throw new Error("Invalid login response — user missing");
      }

      return user;
    } catch (err) {
      console.error("Error during loginUser:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/auth/check`, {
        withCredentials: true,
      });
      console.log("user in the checkAuth Context:", res);
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
      console.error("Auth check failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      setUser(null);
      navigate("/");
      setLoading(false);
    }
  };

  // ---------- Send Form ----------
  const sendFormData = async (formIdentifier, formData) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // ---------- useEffect ----------
  useEffect(() => {
    fetchSessions();
    fetchUsers();
    fetchAllData();
    const interval = setInterval(fetchSessions, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    checkAuth();
    fetchUsers();
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
