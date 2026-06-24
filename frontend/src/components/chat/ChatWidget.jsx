import { useData } from "../../context/DataContext";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

export default function ChatWidget() {
  const { chatOpen, closeChat } = useData();

  if (!chatOpen) return null;

  return (
    <div style={styles.wrapper}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.title}>
          AI Assistant
        </div>

        <button onClick={closeChat} style={styles.closeBtn}>
          ✕
        </button>
      </div>

      {/* BODY */}
      <div style={styles.body}>
        <ChatMessages />
      </div>

      {/* INPUT */}
      <ChatInput />
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "360px",
    height: "520px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 9999,
  },

  header: {
    padding: "12px 14px",
    background: "#2563eb",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "0.3px",
  },

  closeBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
  },

  body: {
    flex: 1,
    background: "#f9fafb",
    overflowY: "auto",
  },
};