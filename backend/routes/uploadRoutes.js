// import express from "express";
// import { uploadToS3 } from "../config/s3.js";
// import pool from "../models/db.js"; // Postgres connection

// const router = express.Router();

// // Accept multiple named fields
// const uploadFields = uploadToS3.fields([
//   { name: "video", maxCount: 1 },
//   { name: "pdf", maxCount: 1 },
//   { name: "doc", maxCount: 1 },
// ]);

// router.post("/flexible-upload", uploadFields, async (req, res) => {
//   try {
//     const files = req.files;
//     if (!files || Object.keys(files).length === 0) {
//       return res.status(400).json({ message: "No files uploaded" });
//     }

//     const savedFiles = [];

//     for (const key of ["video", "pdf", "doc"]) {
//       if (files[key]) {
//         const file = files[key][0]; // multer stores each field as an array
//         const { originalname, mimetype, size, location } = file;

//         const result = await pool.query(
//           `INSERT INTO trial_files (name, type, size, url, category) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
//           [originalname, mimetype, size, location, key]
//         );

//         savedFiles.push(result.rows[0]);
//       }
//     }

//     res.json({ message: "Files uploaded!", files: savedFiles });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Upload failed" });
//   }
// });

// export default router;
