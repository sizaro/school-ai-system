import React, { useState } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const role = res.data.role;

      // 🎯 Redirect based on role
      if (role === "owner") navigate("/owner");
      else if (role === "manager") navigate("/manager");
      else if (role === "employee") navigate("/employee");
      else navigate("/customer");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="mx-auto mb-10 w-full">
        <Navbar/>
      </div>
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Salon Login
        </h1>
        {error && (
          <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            required
            placeholder="********"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300"
        >
          Sign In
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Forgot your password?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">
            Reset it
          </span>
        </p>
      </form>
      <div className="mx-auto w-full">
         <Footer/>
      </div>
     
    </div>
  );
}
