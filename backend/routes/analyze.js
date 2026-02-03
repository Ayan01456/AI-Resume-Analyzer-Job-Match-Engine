
const express = require("express");
const router = express.Router();
const { analyzeResume } = require("../controllers/analyzeController");



// Existing JSON route
router.post("/", analyzeResume);

// NEW: PDF upload route
const fs = require("fs");

// This handles the library whether it exports a function or an object
const pdfParse = require("pdf-parse");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, "uploads/"); },
  filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"), false);
  }
});

router.post("/pdf", upload.single("resume"), async (req, res) => {
  try {
    console.log("PDF received:", req.file?.originalname);

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    // Inject data into request body
    req.body.resumeText = resumeText;
    req.body.jobDescription = req.body.jobDescription || "";

    // Hand over control to controller
    return analyzeResume(req, res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to parse PDF" });

  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log("Cleanup: Temporary file deleted.");
    }
  }
});


module.exports = router;


