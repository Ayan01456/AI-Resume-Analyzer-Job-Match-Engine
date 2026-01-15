const express = require("express");
const router = express.Router();
const { analyzeResume } = require("../controllers/analyzeController");

router.post("/", analyzeResume);

module.exports = router;
