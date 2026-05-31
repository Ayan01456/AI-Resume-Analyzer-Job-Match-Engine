const express = require("express");
const cors = require("cors");
const redis = require("redis");
require("dotenv").config();

const app = express();

const fs = require("fs");

// Ensure uploads folder exists
if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = redis.createClient({
    url: redisUrl
});

redisClient.on('connect', () => console.log('Connected to Redis successfully!'));
redisClient.on('error', (err) => console.error('Redis Client Error:', err));

(async () => {
    await redisClient.connect();
})();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    req.redisClient = redisClient;
    next();
});
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
