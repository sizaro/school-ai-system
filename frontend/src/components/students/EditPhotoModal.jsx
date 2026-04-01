import { useRef, useEffect, useState } from "react";
import { useData } from "../../context/DataContext";

export default function EditPhotoModal({ student, onClose, positionRef, onView }) {
  const { updateStudentPhoto } = useData();
  const menuRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Close if click outside
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
    onClose();
    onView();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file.name);
    if (file) setSelectedFile(file);
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {

      const formData = new FormData();
      formData.append("photo", selectedFile);
      const updated = await updateStudentPhoto(student.student_id, formData);
      console.log("Photo updated:", updated);
      setSelectedFile(null);
      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setUploading(true);
    try {
      await updateStudentPhoto(student.student_id, null); // remove photo
      console.log("Photo removed");
      onClose();
    } catch (err) {
      console.error("Remove failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleTakePhoto = () => {
    console.log("Open camera functionality here");
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 mt-1 w-56 bg-white border rounded shadow z-50 p-2"
    >
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={handleView}
      >
        View Photo
      </button>

      <label className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer mt-1 block">
        Upload Photo
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
      </label>

      {selectedFile && (
        <div className="px-4 py-2 text-sm">
          Selected: {selectedFile.name}
        </div>
      )}

      {selectedFile && (
        <button
          onClick={handleSave}
          disabled={uploading}
          className="w-full text-left px-4 py-2 mt-1 bg-blue-100 hover:bg-blue-200 rounded"
        >
          {uploading ? "Uploading..." : "Save"}
        </button>
      )}

      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100 mt-1"
        onClick={handleTakePhoto}
      >
        Take Photo
      </button>

      <button
        className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 mt-1"
        onClick={handleRemove}
      >
        Remove Photo
      </button>
    </div>
  );
}