const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const fs = require("fs");

// Ensure uploads folder exists
if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}

app.use(cors());
app.use(express.json());
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "awake" });
});

app.get("/", (req, res) => {
  res.send("AI Resume Analyzer Backend is running");
});
const multer = require("multer");
const path = require("path");


const PORT = process.env.PORT || 5000;

const analyzeRoutes = require("./routes/analyze");

app.use("/api/analyze", analyzeRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
