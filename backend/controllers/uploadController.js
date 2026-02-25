import { createFile } from "../models/fileModel.js";

/**
 * Upload a file (PDF, video, docx, etc.) to S3
 * and save the link in Postgres via the model
 */
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { originalname, mimetype, location } = req.file;
    const { school } = req.body;

    if (!school) return res.status(400).json({ error: "School is required" });

    // Call the model to insert into DB
    const fileRecord = await createFile({
      school,
      fileName: originalname,
      fileType: mimetype,
      fileUrl: location,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file: fileRecord,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error during file upload" });
  }
};
