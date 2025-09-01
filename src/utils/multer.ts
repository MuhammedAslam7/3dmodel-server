import multer from "multer";

// Use memory storage (good for streaming to DB/GridFS)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // max 100MB
});