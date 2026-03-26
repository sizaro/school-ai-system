import { useRef, useEffect, useState } from "react";
import { useData } from "../../context/DataContext";

export default function EditPhotoModal({ student, onClose, positionRef }) {
  const { updateStudentPhoto } = useData(); // function from context
  const menuRef = useRef();
  const [option, setOption] = useState(""); // current option selected
  const [file, setFile] = useState(null);

  // Close if click outside the menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !positionRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, positionRef]);

  const handleView = () => {
    if (student.photo_url) window.open(student.photo_url, "_blank");
  };

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    // For demo: assuming updateStudentPhoto accepts a file and updates the URL
    const updated = await updateStudentPhoto(student.student_id, selectedFile);
    console.log("Photo updated:", updated);
    onClose();
  };

  const handleTake = () => {
    console.log("Open camera functionality here");
    onClose();
  };

  const handleRemove = async () => {
    await updateStudentPhoto(student.student_id, null); // null to remove photo
    console.log("Photo removed");
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 mt-1 w-44 bg-white border rounded shadow z-50"
    >
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={handleView}
      >
        View Photo
      </button>

      {/* Upload Input hidden but triggers modal */}
      <label className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
        Upload Photo
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
          accept="image/*"
        />
      </label>

      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={handleTake}
      >
        Take Photo
      </button>

      <button
        className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
        onClick={handleRemove}
      >
        Remove Photo
      </button>
    </div>
  );
}