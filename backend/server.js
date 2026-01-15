const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Resume Analyzer Backend is running");
});

const PORT = process.env.PORT || 5000;

const analyzeRoutes = require("./routes/analyze");

app.use("/api/analyze", analyzeRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
