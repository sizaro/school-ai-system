import { useData } from "../../context/DataContext";
import { useEffect, useRef } from "react";

export default function ChatMessages() {
  const { messages } = useData();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.container}>
      {messages.length === 0 && (
        <div style={styles.empty}>
          Ask anything about your school system...
        </div>
      )}

      {messages.map((m, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: m.role === "user" ? "flex-end" : "flex-start",
          }}
        >
          <div style={{
            ...styles.bubble,
            background: m.role === "user" ? "#2563eb" : "#e5e7eb",
            color: m.role === "user" ? "white" : "#111827",
            borderRadius: m.role === "user"
              ? "14px 14px 4px 14px"
              : "14px 14px 14px 4px",
          }}>
            {m.text}
          </div>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}

const styles = {
  container: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  bubble: {
    padding: "10px 12px",
    fontSize: "13px",
    maxWidth: "78%",
    lineHeight: "1.4",
    wordBreak: "break-word",
  },

  empty: {
    color: "#6b7280",
    fontSize: "13px",
    textAlign: "center",
    marginTop: "20px",
  },
};