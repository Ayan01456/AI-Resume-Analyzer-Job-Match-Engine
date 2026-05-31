const { analyzeWithGemini } = require("../services/geminiService");
const crypto = require("crypto");

exports.analyzeResume = async (req, res) => {
  try {
    const { redisClient } = req;
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        error: "resumeText and jobDescription are required",
      });
    }
    const combinedInput = `${resumeText}_${jobDescription}`;
    const hash = crypto.createHash("md5").update(combinedInput).digest("hex");
    const cacheKey = `resume:analysis:${hash}`;

    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("CACHE HIT: Serving analysis instantly from Redis!");
      
      return res.json({
        success: true,
        data: JSON.parse(cachedData),
        isCached: true 
      });
    }

    const aiResult = await analyzeWithGemini(resumeText, jobDescription);

    await redisClient.setEx(cacheKey, 7200, JSON.stringify(aiResult));

    return res.json({
      success: true,
      data: aiResult,
    });
  } catch (error) {
    console.error("Analyze error:", error.message || error);
    return res.status(500).json({
      success: false,
      error: "Resume analysis failed",
    });
  }
};
