import { useRef, useEffect, useState } from "react";
import { useData } from "../../context/DataContext";

export default function EditPhotoModal({ student, onClose, positionRef, onView }) {
  const { updateStudentPhoto, removeStudentPhoto } = useData();

  const menuRef = useRef();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);

  // Close modal if click outside
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

  // File upload handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file.name);
    if (file) setSelectedFile(file);
  };

  // Save photo (upload)
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

  // Remove photo
  const handleRemove = async () => {
    setUploading(true);
    try {
      await removeStudentPhoto(student.student_id);
      console.log("Photo removed");
      setSelectedFile(null);
      onClose();
    } catch (err) {
      console.error("Remove failed:", err);
    } finally {
      setUploading(false);
    }
  };

  // View photo
  const handleView = () => {
    onClose();
    onView();
  };

  // Open camera
  const handleTakePhoto = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  // Capture photo from camera
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
      console.log("Captured file:", file);
      setSelectedFile(file);
      closeCamera();
    }, "image/jpeg");
  };

  // Close camera
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setCameraOpen(false);
  };

  return (
    <div ref={menuRef} className="absolute top-full left-0 mt-1 w-72 bg-white border rounded shadow z-50 p-4">

      {/* View Photo */}
      <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={handleView}>
        View Photo
      </button>

      {/* Upload Photo */}
      <label className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer mt-2 block">
        Upload Photo
        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
      </label>

      {/* Selected file display */}
      {selectedFile && (
        <div className="px-4 py-2 text-sm">
          Selected: {selectedFile.name}
        </div>
      )}

      {/* Save button */}
      {selectedFile && (
        <button
          onClick={handleSave}
          disabled={uploading}
          className="w-full text-left px-4 py-2 mt-2 bg-blue-100 hover:bg-blue-200 rounded"
        >
          {uploading ? "Uploading..." : "Save"}
        </button>
      )}

      {/* Take Photo */}
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100 mt-2"
        onClick={handleTakePhoto}
      >
        Take Photo
      </button>

      {/* Remove Photo */}
      <button
        className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 mt-2"
        onClick={handleRemove}
      >
        Remove Photo
      </button>

      {/* Camera overlay */}
      {cameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
          <video ref={videoRef} className="w-80 h-60 object-cover rounded shadow-md" autoPlay />
          <div className="flex mt-2 space-x-2">
            <button
              onClick={handleCapture}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Capture
            </button>
            <button
              onClick={closeCamera}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}