import { useState } from "react";

function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);


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

  const handlePdfUpload = async () => {
    if (!file) {
      alert("Please select a PDF first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    const response = await fetch("http://localhost:5000/api/analyze/pdf", {
      method: "POST",
      body: formData
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
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handlePdfUpload}>
        Analyze PDF
      </button>

      <button onClick={analyzeResume}>Analyze Resume</button>

      {result && (
        <div>
          <p>Score: {result.score}</p>

          {Array.isArray(result.missingSkills) && (
            <>
              <h3>Missing Skills:</h3>
              <ul>
                {result.missingSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </>
          )}

          {Array.isArray(result.suggestions) && (
            <>
              <h3>Suggestions:</h3>
              <ul>
                {result.suggestions.map((s, index) => (
                  <li key={index}>{s}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

    </div>
  );
}

export default App;
