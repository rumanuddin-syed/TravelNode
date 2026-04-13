import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure support sub-directory exists
const supportDir = "public/uploads/support";
if (!fs.existsSync(supportDir)) {
  fs.mkdirSync(supportDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, supportDir);
  },
  filename: (req, file, cb) => {
    // Basic sanitization
    const cleanOrig = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    cb(null, `${Date.now()}-${cleanOrig}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|pdf/;
  const mimeType = allowedFileTypes.test(file.mimetype);
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extname) {
    return cb(null, true);
  }
  cb(new Error("Only images (jpeg, jpg, png) and PDFs are allowed"));
};

const supportUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for support docs
});

export default supportUpload;
