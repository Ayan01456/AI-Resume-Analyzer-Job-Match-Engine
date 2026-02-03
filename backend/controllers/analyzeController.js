const { analyzeWithGemini } = require("../services/geminiService");

exports.analyzeResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        error: "resumeText and jobDescription are required",
      });
    }

    const aiResult = await analyzeWithGemini(resumeText, jobDescription);

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
