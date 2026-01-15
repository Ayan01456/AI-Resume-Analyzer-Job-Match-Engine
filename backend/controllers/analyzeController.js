exports.analyzeResume = async (req, res) => {
  const { resumeText, jobDescription } = req.body;

  if (!resumeText || !jobDescription) {
    return res.status(400).json({
      error: "resumeText and jobDescription are required",
    });
  }

  return res.json({
    score: 75,
    missingSkills: ["System Design", "AWS"],
    suggestions: [
      "Highlight measurable impact in experience",
      "Mention any cloud or backend projects",
    ],
  });
};
