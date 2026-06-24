import { useData } from "../../context/DataContext";

export default function ChatButton() {
  const { chatOpen, setChatOpen } = useData();

  return (
    <button
      onClick={() => setChatOpen(!chatOpen)}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        backgroundColor: "#2563eb",
        color: "white",
        fontSize: "22px",
        border: "none",
        cursor: "pointer",
        zIndex: 9999,
      }}
    >
      💬
    </button>
  );
}