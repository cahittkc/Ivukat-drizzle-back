import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(), // Dosyayı bellekte tut
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});