function analyzeText(resumeText, jobDescription = "") {
  // Later Gemini will go here
  return {
    score: 75,
    missingSkills: ["System Design", "AWS"],
    suggestions: [
      "Highlight measurable impact in experience",
      "Mention any cloud or backend projects",
    ],
  };
}

exports.analyzeResume = async (req, res) => {
  const { resumeText, jobDescription } = req.body;

  if (!resumeText || !jobDescription) {
    return res.status(400).json({
      error: "resumeText and jobDescription are required",
    });
  }

  const result = analyzeText(resumeText, jobDescription);
  return res.json(result);
};

exports.analyzeText = analyzeText;
