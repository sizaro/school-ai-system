import { createContext, useContext, useState, useEffect } from "react";
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

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500/api";

  // ---------- Fetch All ----------
  const fetchAllData = async () => {
    try {
      const [clockingsRes, UsersRes, servicesRes] =
        await Promise.all([
          axios.get(`${API_URL}/clockings`),
          axios.get(`${API_URL}/users`),
          axios.get(`${API_URL}/services`),

        ]);
      setClockings(clockingsRes.data);
      setUsers(UsersRes.data);
      setServices(servicesRes.data);
      console.log("all services in the data context:", servicesRes.data)
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

      console.log(`daily data in context`, res.data)
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

  // ---------- NEW: CRUD for Services ----------
  const fetchServiceById = async (id) => {
    try {
      console.log("service id to be fetched",id)
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
      await fetchAllData();// global refresh (still useful)
      return res.data;
    } catch (err) {
      console.error("Error updating service:", err);
      throw err;
    }
  };

   const updateServicet = async (id, formData) => {
    try {
      const res = await axios.put(`${API_URL}/servicet/${id}`, formData);
      await fetchAllData();// global refresh (still useful)
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
    console.log("users in context:", res.data)
    return res.data;
  } catch (err) {
    console.error("Error fetching employees:", err);
    throw err;
  }
};

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
    await fetchUsers(); // refresh list
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
    console.error(`error in deleting`, err);
    throw err;
  }
};


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


    // ===============================
// LATE FEE FUNCTIONS
// ===============================

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
    await fetchLateFees(); // refresh list after adding
    return res.data;
  } catch (err) {
    console.error("Error creating late fee:", err);
    throw err;
  }
};

const updateLateFee = async (id, lateFeeData) => {
  try {
    const res = await axios.put(`${API_URL}/fees/late_fees/${id}`, lateFeeData);
    await fetchLateFees(); // refresh list after updating
    return res.data;
  } catch (err) {
    console.error("Error updating late fee:", err);
    throw err;
  }
};

const deleteLateFee = async (id) => {
  try {
    await axios.delete(`${API_URL}/fees/late_fees/${id}`);
    await fetchLateFees(); // refresh list after deletion
  } catch (err) {
    console.error("Error deleting late fee:", err);
    throw err;
  }
};

        // ===============================
// TAG FEE FUNCTIONS
// ===============================

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
    await fetchTagFees(); // refresh list after adding
    return res.data;
  } catch (err) {
    console.error("Error creating tag fee:", err);
    throw err;
  }
};

const updateTagFee = async (id, tagFeeData) => {
  try {
    const res = await axios.put(`${API_URL}/fees/tag/${id}`, tagFeeData);
    await fetchTagFees(); // refresh list after updating
    return res.data;
  } catch (err) {
    console.error("Error updating tag fee:", err);
    throw err;
  }
};

const deleteTagFee = async (id) => {
  try {
    await axios.delete(`${API_URL}/fees/tag/${id}`);
    await fetchTagFees(); // refresh list after deletion
  } catch (err) {
    console.error("Error deleting tag fee:", err);
    throw err;
  }
};



    const loginUser = async (credentials) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, credentials, {
      withCredentials: true, // allows backend to set HttpOnly cookie
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

 // --- checkAuth function ---
  const checkAuth = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/check`, {
        withCredentials: true, // important to send httpOnly cookie
      });
      setUser(res.data.user); 
      // store the user in state
    } catch (err) {
      setUser(null); // no session or invalid token
      console.error("Auth check failed:", err);
    } finally {
      setLoading(false);
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


  useEffect(() => {
    fetchSessions();
    fetchUsers();
    fetchAllData();
    const interval = setInterval(fetchSessions, 60 * 1000);
    return () => clearInterval(interval);
  }, []);



 useEffect(() => {
  checkAuth(); 
  fetchUsers();// will set user if token is valid
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
    deleteTagFee
  }}
>
  {children}
</DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
