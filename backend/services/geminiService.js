const { GoogleGenAI } = require("@google/genai");

// Initialize the client
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzeWithGemini(resumeText, jobDescription) {
  try {
    // Using the 2.5 Flash model 
    const result = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{
        role: "user",
        parts: [{
          text: `You are an ATS. Analyze the Resume against the JD. 
                 Return ONLY a JSON object with keys: score, missingSkills, suggestions, summary.
                 
                 RESUME: ${resumeText}
                 JD: ${jobDescription || "N/A"}`
        }]
      }],
      config: {
        responseMimeType: "application/json"
      }
    });

    // --- THE ULTIMATE 2026 EXTRACTION ---
    // We check three different places where the text might be hiding 
    // to avoid the "undefined" error.
    let responseText = "";

    if (result.response && typeof result.response.text === 'function') {
      responseText = result.response.text();
    } else if (result.candidates && result.candidates[0].content.parts[0].text) {
      responseText = result.candidates[0].content.parts[0].text;
    } else {
      // If we still can't find it, we log the whole result to see what's inside
      console.log("Full SDK Result:", JSON.stringify(result, null, 2));
      throw new Error("Could not find text in AI response");
    }

    console.log("AI Successfully responded");

    // Return the parsed object
    return JSON.parse(responseText.trim());

  } catch (err) {
    console.error("Gemini 2026 Logic Error:", err.message);

    // Check if it's the quota/limit error
    const isLimit = err.message.includes("429") || err.message.includes("quota");

    return {
      score: 0,
      // We replace the messy technical error with clean text
      missingSkills: [isLimit ? "Limit Reached" : "Error"],
      suggestions: [
        isLimit
          ? "You've hit the daily free limit. Please try again tomorrow!"
          : "Something went wrong. Please check your internet or try a different PDF."
      ],
      summary: isLimit
        ? "Google Gemini API Daily Quota Exceeded."
        : "The AI encountered an unexpected error."
    };
  }
}

module.exports = { analyzeWithGemini };