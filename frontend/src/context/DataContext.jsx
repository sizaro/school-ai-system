import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [clockings, setClockings] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500/api";

  // ---------- Fetch All ----------
  const fetchAllData = async () => {
    try {
      const [servicesRes, advancesRes, expensesRes, clockingsRes, employeeRes] =
        await Promise.all([
          axios.get(`${API_URL}/services`),
          axios.get(`${API_URL}/advances`),
          axios.get(`${API_URL}/expenses`),
          axios.get(`${API_URL}/clockings`),
          axios.get(`${API_URL}/employees`),
        ]);

      setServices(servicesRes.data);
      setAdvances(advancesRes.data);
      setExpenses(expensesRes.data);
      setClockings(clockingsRes.data);
      setEmployees(employeeRes.data);
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

  // ---------- NEW: CRUD for Services ----------
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
      await fetchAllData(); // global refresh (still useful)
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
const fetchEmployees = async () => {
  try {
    const res = await axios.get(`${API_URL}/employees`);
    setEmployees(res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching employees:", err);
    throw err;
  }
};

const fetchEmployeeById = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/employees/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching employee by ID:", err);
      throw err;
    }
  };

const createEmployee = async (employeeData) => {
  try {
    const res = await axios.post(`${API_URL}/employees`, employeeData);
    await fetchEmployees(); // refresh list
    return res.data;
  } catch (err) {
    console.error("Error creating employee:", err);
    throw err;
  }
};

const updateEmployee = async (id, employeeData) => {
  try {
    const res = await axios.put(`${API_URL}/employees/${id}`, employeeData);
    await fetchEmployees();
    return res.data;
  } catch (err) {
    console.error("Error updating employee:", err);
    throw err;
  }
};

const deleteEmployee = async (id) => {
  try {
    await axios.delete(`${API_URL}/employees/${id}`);
    await fetchEmployees();
  } catch (err) {
    console.error("Error deleting employee:", err);
    throw err;
  }
};


//--- Advances layer

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
        await fetchAdvances(); // refresh list after adding
        return res.data;
      } catch (err) {
        console.error("Error creating advance:", err);
        throw err;
      }
    };

    const updateAdvance = async (id, advanceData) => {
      try {
        const res = await axios.put(`${API_URL}/advances/${id}`, advanceData);
        await fetchAdvances(); // refresh list after updating
        return res.data;
      } catch (err) {
        console.error("Error updating advance:", err);
        throw err;
      }
    };

    const deleteAdvance = async (id) => {
      try {
        await axios.delete(`${API_URL}/advances/${id}`);
        await fetchAdvances(); // refresh list after deletion
      } catch (err) {
        console.error("Error deleting advance:", err);
        throw err;
      }
    };

  //--Advances layer
    // --- Expenses layer ---

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
        await fetchExpenses(); // refresh list after adding
        return res.data;
      } catch (err) {
        console.error("Error creating expense:", err);
        throw err;
      }
    };

    const updateExpense = async (id, expenseData) => {
      try {
        const res = await axios.put(`${API_URL}/expenses/${id}`, expenseData);
        await fetchExpenses(); // refresh list after updating
        return res.data;
      } catch (err) {
        console.error("Error updating expense:", err);
        throw err;
      }
    };

    const deleteExpense = async (id) => {
      try {
        await axios.delete(`${API_URL}/expenses/${id}`);
        await fetchExpenses(); // refresh list after deletion
      } catch (err) {
        console.error("Error deleting expense:", err);
        throw err;
      }
    };
        

  // ---------- Send Form ----------
  const sendFormData = async (formIdentifier, formData) => {
    try {
      let res;
      switch (formIdentifier) {
        case "createEmployee":
          res = await axios.post(`${API_URL}/employees`, formData);
          await fetchAllData();
          break;
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

  // ---------- Effects ----------
  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ---------- Export ----------
  return (
    <DataContext.Provider
  value={{
    services,
    employees,
    expenses,
    advances,
    clockings,
    sessions,
    loading,
    fetchAllData,
    sendFormData,
    fetchDailyData,
    fetchWeeklyData,
    fetchMonthlyData,
    fetchYearlyData,
    fetchServiceById,
    updateService,
    deleteService,
    fetchEmployees,
    fetchEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    fetchAdvances,
    fetchAdvanceById,
    createAdvance,
    updateAdvance,
    deleteAdvance,
    fetchExpenses,
    fetchExpenseById,
    createExpense,
    updateExpense,
    deleteExpense
  }}
>
  {children}
</DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
