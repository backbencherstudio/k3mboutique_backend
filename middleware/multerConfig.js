const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

// Ensure directories exist
const ensureDirectoriesExist = () => {
  const audioDir = "uploads/audio/";
  const imageDir = "uploads/images/";

  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }
};

ensureDirectoriesExist();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("audio")) {
      cb(null, "uploads/audio/");
    } else if (file.mimetype.startsWith("image")) {
      cb(null, "uploads/images/");
    } else {
      cb(new Error("Invalid file type"), null);
    }
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const timestamp = Date.now();
    const fileExt = path.extname(originalName);
    const baseName = path.basename(originalName, fileExt);
    const newFilename = `${timestamp}-${baseName}${fileExt}`;

    const filePath = path.join("uploads/audio/", newFilename);

   
    cb(null, newFilename);

    // Convert WAV to MP3 if needed
    if (file.mimetype === "audio/wav") {
      const mp3Filename = `${timestamp}-${baseName}.mp3`;
      const mp3Path = path.join("uploads/audio/", mp3Filename);

      ffmpeg(filePath)
        .toFormat("mp3")
        .on("end", () => {
          fs.unlinkSync(filePath); 
          console.log(`Converted ${filePath} to ${mp3Path}`);
        })
        .on("error", (err) => console.error("Conversion error:", err))
        .save(mp3Path);
    }
  },
});

const upload = multer({ storage });

module.exports = upload;
