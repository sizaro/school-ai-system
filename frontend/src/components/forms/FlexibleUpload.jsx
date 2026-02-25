import { useState } from "react";
import { useData } from "../../context/DataContext";

const FlexibleUpload = () => {
  const { uploadMultipleFiles } = useData();
  const [files, setFiles] = useState({
    video: null,
    pdf: null,
    doc: null,
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleChange = (e) => {
    setFiles((prev) => ({
      ...prev,
      [e.target.name]: e.target.files[0],
    }));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    const result = await uploadMultipleFiles(formData);
    if (result.success) setUploadedFiles(result.files);
    else alert("Upload failed: " + result.message);
  };

  return (
    <div>
      <h2>Upload Video, PDF, Word/Excel (Flexible)</h2>

      <div>
        <label>Video: </label>
        <input type="file" name="video" onChange={handleChange} />
      </div>

      <div>
        <label>PDF: </label>
        <input type="file" name="pdf" onChange={handleChange} />
      </div>

      <div>
        <label>Word/Excel: </label>
        <input type="file" name="doc" onChange={handleChange} />
      </div>

      <button onClick={handleUpload}>Upload</button>

      <div>
        {uploadedFiles.map((file) => (
          <div key={file.id}>
            <p>{file.name} ({file.category})</p>
            {file.category === "video" && (
              <video src={file.url} controls width="400" />
            )}
            {["pdf", "doc"].includes(file.category) && (
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                Open File
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlexibleUpload;
