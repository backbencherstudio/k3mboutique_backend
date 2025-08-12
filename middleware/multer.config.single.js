const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(process.cwd(), "uploads/images");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    console.log("Invalid file type. Only image files are allowed.");
    cb(new Error("Invalid file type. Only image files are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware that accepts either avatar or lawnphoto
exports.uploadProfileImage = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'lawnphoto', maxCount: 1 },
  { name: 'lawncoverphoto', maxCount: 1 },
  { name : 'refundphoto', maxCount: 1}
]);