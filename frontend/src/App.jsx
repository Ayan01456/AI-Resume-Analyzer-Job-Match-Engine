import { useState } from "react";

function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);

  const analyzeResume = async () => {
    const response = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumeText,
        jobDescription,
      }),
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h2>AI Resume Analyzer</h2>

      <textarea
        placeholder="Paste resume text here..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        rows={6}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <textarea
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={6}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button onClick={analyzeResume}>Analyze Resume</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Score:</strong> {result.score}</p>

          <p><strong>Missing Skills:</strong></p>
          <ul>
            {result.missingSkills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>

          <p><strong>Suggestions:</strong></p>
          <ul>
            {result.suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
