import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "./s3.js"; // your S3Client

export const uploadFile = async (file, folder = "uploads") => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${folder}/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    return fileUrl; // public URL
  } catch (err) {
    console.error("S3 upload error:", err);
    throw err;
  }
};
