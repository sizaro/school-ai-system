// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { s3Storage } from "./s3.js";
// import multerS3 from "multer-s3";
// import s3 from "./s3.js";

// // ------------------------
// // LOCAL IMAGE UPLOAD
// // ------------------------

// // Directory to store images locally
// const IMAGES_DIR = path.join(process.cwd(), "uploads/images");

// // Ensure directory exists
// if (!fs.existsSync(IMAGES_DIR)) {
//   fs.mkdirSync(IMAGES_DIR, { recursive: true });
// }

// // Multer storage for local images
// const localStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, IMAGES_DIR);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();

//     let prefix = "file";
//     if (file.fieldname === "image_url") prefix = "user";
//     if (file.fieldname === "service_image") prefix = "service";
//     if (file.fieldname === "product_image") prefix = "product";

//     cb(null, `${prefix}-${Date.now()}${ext}`);
//   },
// });

// // Allowed image types
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|webp/;
//   const ext = path.extname(file.originalname).toLowerCase();
//   const mime = file.mimetype;
//   if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files (jpg, jpeg, png, webp) are allowed!"));
//   }
// };

// // Local image uploader (max 5 MB)
// const upload = multer({
//   storage: localStorage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

// // ------------------------
// // S3 UPLOAD (VIDEOS, DOCS, ETC)
// // ------------------------

// // S3 uploader (max 50 MB)
// export const uploadToS3 = multer({
//   storage: s3Storage,
//   limits: { fileSize: 50 * 1024 * 1024 },
// });

// // ------------------------
// // EXPORTS
// // ------------------------
// export default upload;


// export const s3Storage = multerS3({
//   s3: s3,
//   bucket: process.env.AWS_BUCKET_NAME,
//   acl: "public-read", // makes files publicly readable
//   key: (req, file, cb) => {
//     let folder = "uploads";
//     if (file.mimetype.includes("video")) folder = "videos";
//     if (file.mimetype.includes("pdf") || file.mimetype.includes("msword") || file.mimetype.includes("officedocument")) folder = "docs";

//     const filename = `${folder}/${Date.now()}_${file.originalname}`;
//     cb(null, filename);
//   },
// });
