import { useEffect } from "react";

export default function ToastModal({ message, type = "success", duration = 5000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message) return null;

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`${bgColor} fixed top-4 right-4 text-white px-4 py-2 rounded shadow-lg z-50`}
    >
      {message}
    </div>
  );
}
