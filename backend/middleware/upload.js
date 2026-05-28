import multer from "multer";
import path from "path";
import fs from "fs";

// ==============================
// 1. DEFINE UPLOAD MAP
// ==============================
const uploadFolders = {
  images: "uploads/images",
  academic: "uploads/academics",
  receipts: "uploads/receipts",
  documents: "uploads/documents",
};

// ==============================
// 2. ENSURE ALL FOLDERS EXIST
// ==============================
Object.values(uploadFolders).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ==============================
// 3. STORAGE ENGINE
// ==============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = file.fieldname;

    switch (type) {
      case "file_url":
        cb(null, uploadFolders.academic);
        break;

      case "receipt":
        cb(null, uploadFolders.receipts);
        break;

      case "image":
      case "photo":
        cb(null, uploadFolders.images);
        break;

      default:
        cb(null, uploadFolders.documents);
        break;
    }
  },

  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// ==============================
// 4. FILE FILTER
// ==============================
const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

// ==============================
// 5. EXPORT MULTER
// ==============================
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

export default upload;