import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

/* ================= PUBLIC LANDING PAGES ================= */
import Home from "./pages/landing/Home.jsx";
import About from "./pages/landing/About.jsx";
import Contact from "./pages/landing/Contact.jsx";
import Admissions from "./pages/landing/Admissions.jsx";
import Academics from "./pages/landing/Academics.jsx";
import Events from "./pages/landing/Events.jsx";
import News from "./pages/landing/News.jsx";
import Alumni from "./pages/landing/Alumni.jsx";
import CampusLife from "./pages/landing/CampusLife.jsx";
import Tuition from "./pages/landing/Tuition.jsx";
import ResetPassword from "./pages/landing/ResetPassword.jsx";

/* ================= DASHBOARD LAYOUTS ================= */
import DirectorLayout from "./components/layout/DirectorLayout.jsx";
import HeadmasterLayout from "./components/layout/HeadmasterLayout.jsx";
import TeacherLayout from "./components/layout/TeacherLayout.jsx";
import BursarLayout from "./components/layout/BursarLayout.jsx";
import StudentLayout from "./components/layout/StudentLayout.jsx";

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  /* ================= RESTORE CHAT ON OPEN ================= */
  useEffect(() => {
    if (chatOpen) {
      const saved = localStorage.getItem("chat_messages");
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    }
  }, [chatOpen]);

  /* ================= SAVE CHAT DURING SESSION ================= */
  useEffect(() => {
    if (chatOpen) {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
    }
  }, [messages, chatOpen]);

  return (
    <div>

      {/* ================= FLOATING CHAT BUTTON ================= */}
      <button
        onClick={() => setChatOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#2563eb",
          color: "white",
          fontSize: "24px",
          border: "none",
          cursor: "pointer",
          zIndex: 9999,
        }}
      >
        💬
      </button>

      {/* ================= CHAT WINDOW ================= */}
      {chatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "320px",
            height: "420px",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
          }}
        >

          {/* HEADER */}
          <div
            style={{
              padding: "10px",
              borderBottom: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>School AI Assistant</span>

            <button
              onClick={() => {
                setChatOpen(false);
                setMessages([]);
                setInput("");
                localStorage.removeItem("chat_messages");
              }}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* MESSAGES */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.role === "user" ? "right" : "left",
                  margin: "6px 0",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px",
                    borderRadius: "10px",
                    backgroundColor:
                      msg.role === "user" ? "#2563eb" : "#eee",
                    color: msg.role === "user" ? "white" : "black",
                    maxWidth: "80%",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* INPUT AREA */}
          <div
            style={{
              padding: "10px",
              borderTop: "1px solid #ddd",
              display: "flex",
              gap: "5px",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: "8px",
              }}
            />

            <button
              onClick={() => {
                if (!input.trim()) return;

                setMessages((prev) => [
                  ...prev,
                  { role: "user", text: input },
                ]);

                setInput("");
              }}
              style={{
                padding: "8px 12px",
                background: "#2563eb",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* ================= ROUTES ================= */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/tuition" element={<Tuition />} />
        <Route path="/events" element={<Events />} />
        <Route path="/news" element={<News />} />
        <Route path="/alumni" element={<Alumni />} />
        <Route path="/school-life" element={<CampusLife />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/director/*"
          element={
            <ProtectedRoute role="director">
              <DirectorLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/headmaster/*"
          element={
            <ProtectedRoute role="headmaster">
              <HeadmasterLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute role="teacher">
              <TeacherLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bursar/*"
          element={
            <ProtectedRoute role="bursar">
              <BursarLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/*"
          element={
            <ProtectedRoute role="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;