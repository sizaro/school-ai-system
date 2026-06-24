import { useState } from "react";
import { useData } from "../../context/DataContext";

export default function ChatInput() {
  const { sendMessage } = useData();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) return;

    setLoading(true);
    await sendMessage(text);
    setText("");
    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        style={styles.input}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      <button
        onClick={handleSend}
        disabled={loading}
        style={{
          ...styles.button,
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "..." : "Send"}
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    padding: "10px",
    gap: "8px",
    borderTop: "1px solid #e5e7eb",
    background: "white",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "13px",
  },

  button: {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
  },
};