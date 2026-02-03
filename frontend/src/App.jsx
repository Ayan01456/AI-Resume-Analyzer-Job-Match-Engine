import { useState } from "react";

function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const sectionStyle = {
    background: "#ffffff",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    marginTop: "16px",
  };

  
  const textareaStyle = {
    width: "100%",
    marginTop: "8px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    resize: "vertical",
    boxSizing: "border-box", 
  };

  const analyzeResume = async () => {
    if (loading) return;

    if (!jobDescription.trim()) {
      alert("Please provide a job description.");
      return;
    }

    if (!file && !resumeText.trim()) {
      alert("Please upload a resume PDF or paste resume text.");
      return;
    }

    if (file && file.type !== "application/pdf") {
      alert("Only PDF resumes are supported.");
      return;
    }

    try {
      setLoading(true);
      let response;
      let data;

      if (file) {
        const formData = new FormData();
        formData.append("resume", file);
        formData.append("jobDescription", jobDescription);

        response = await fetch("http://localhost:5000/api/analyze/pdf", {
          method: "POST",
          body: formData,
        });

        data = await response.json();
      } else {
        response = await fetch("http://localhost:5000/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText, jobDescription }),
        });

        data = await response.json();
      }

      if (data.success) {
        setResult(data.data);
      } else {
        alert("Analysis failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while analyzing the resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "65%",
        minWidth: "320px",
        minHeight: "100vh",
        background: "#f5f7fb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "32px 16px",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      {/* GITHUB LINK TOP RIGHT */}
      <a
        href="https://github.com/Ayan01456/AI-Resume-Analyzer-Job-Match-Engine"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          textDecoration: "none",
          color: "#374151",
          fontSize: "14px",
          fontWeight: "600",
          background: "#fff",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        GitHub Code ↗
      </a>
      <div
        style={{
          width: "100%",
          maxWidth: "1200px", // Increased width for the main container
          margin: "0 auto",
          background: "#fff",
          padding: "32px",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
        }}
      >
        <h2
          style={{
            fontSize: "26px",
            fontWeight: "700",
            marginBottom: "24px",
            color: "#111827",
          }}
        >
          AI Resume Analyzer
        </h2>

        {/* Resume Text */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "600" }}>
            Resume Text (optional if PDF uploaded)
          </label>
          <textarea
            placeholder={
              file
                ? "Resume PDF uploaded — text input disabled"
                : "Paste resume text here..."
            }
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={6}
            disabled={!!file}
            style={{
              ...textareaStyle,
              backgroundColor: file ? "#f1f5f9" : "#fff",
              cursor: file ? "not-allowed" : "text",
              color: file ? "#64748b" : "#000",
            }}
          />
        </div>

        {/* Job Description */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "600" }}>Job Description</label>
          <textarea
            placeholder="Paste job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            style={textareaStyle}
          />
        </div>

        {/* PDF Upload - Compact Version */}
        <div style={{ marginBottom: "20px" }}>
          <div
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "#6366f1"; }}
            onDragLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = "#e5e7eb";
              const droppedFile = e.dataTransfer.files[0];
              if (droppedFile?.type === "application/pdf") setFile(droppedFile);
            }}
            onClick={() => document.getElementById("fileInput").click()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "16px", // Reduced padding from 30px to 16px
              border: "2px dashed #e5e7eb",
              borderRadius: "12px",
              background: "#f9fafb",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <input
              id="fileInput"
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                setFile(selectedFile);

                if (selectedFile) {
                  setResumeText(""); // clear pasted resume text
                }
              }}

              style={{ display: "none" }}
            />

            <span style={{ fontSize: "20px" }}>{file ? "✅" : "📄"}</span>

            <div style={{ textAlign: "left" }}>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                {file ? file.name : "Click to upload resume"}
              </p>
              {!file && (
                <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
                  or drag and drop PDF here
                </p>
              )}
            </div>
          </div>
        </div>

        {loading && (
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                height: "6px",
                width: "100%",
                backgroundColor: "#e5e7eb",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "40%",
                  backgroundColor: "#4f46e5",
                  borderRadius: "999px",
                  animation: "progressMove 1.2s infinite linear",
                }}
              />
            </div>
            <p style={{ marginTop: "8px", fontSize: "14px", color: "#555" }}>
              Analyzing resume…
            </p>
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={analyzeResume}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            background: loading ? "#aaa" : "#4f46e5",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {/* Results */}
        {result && (
          <div
            style={{
              marginTop: "32px",
              padding: "20px",
              background: "#f9fafb",
              borderRadius: "12px",
              border: "1px solid #eee",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontWeight: "600", marginBottom: "8px" }}>
                ATS Match Score: {result.score ?? 0}%
              </p>

              <div
                style={{
                  width: "100%",
                  height: "10px",
                  background: "#e5e7eb",
                  borderRadius: "999px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${result.score ?? 0}%`,
                    height: "100%",
                    background: result.score >= 70 ? "#16a34a" : "#f59e0b",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>

            {result.summary && (
              <div style={sectionStyle}>
                <h3 style={{ marginBottom: "8px" }}>Summary</h3>
                <p style={{ color: "#374151" }}>{result.summary}</p>
              </div>
            )}

            {Array.isArray(result.missingSkills) && result.missingSkills.length > 0 && (
              <div style={sectionStyle}>
                <h3 style={{ marginBottom: "12px", fontSize: "18px", fontWeight: "700" }}>Missing Skills</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {result.missingSkills.map((skill, i) => (
                    <span
                      key={i}
                      style={{
                        background: "linear-gradient(145deg, #ffffff, #f9fafb)",
                        color: "#4b5563",
                        padding: "8px 16px",
                        borderRadius: "999px",
                        fontSize: "13px",
                        fontWeight: "600",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        display: "inline-block"
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(result.suggestions) && result.suggestions.length > 0 && (
              <div style={sectionStyle}>
                <h3 style={{ marginBottom: "16px", fontWeight: "700", fontSize: "18px", color: "#111827" }}>
                  Suggestions
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {result.suggestions.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "14px 18px",
                        background: "#ffffff",
                        borderRadius: "12px",
                        border: "1px solid #f3f4f6",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                      }}
                    >
                      {/* The Softened Shadowy Number Box */}
                      <div style={{
                        minWidth: "26px",
                        height: "26px",
                        borderRadius: "6px",
                        background: "#ffffff",
                        color: "#353b46",      
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "12px",
                        fontWeight: "700",
                        border: "1px solid #f3f4f6",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.06)", 
                      }}>
                        {i + 1}
                      </div>
                      <p style={{ margin: 0, color: "#4b5563", fontSize: "14px", fontWeight: "500", lineHeight: "1.5" }}>
                        {s}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <footer style={{
          marginTop: '50px',
          padding: '20px 0',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#4b5563' 
          }}>
            Developed with ✨ by <span style={{ fontWeight: '600', color: '#4f46e5' }}>Ayan</span>
          </p>
          <p style={{
            margin: '4px 0 0',
            fontSize: '12px',
            color: '#9ca3af' 
          }}>
            Powered by Gemini 2.5 Flash • 2026
          </p>
        </footer>
      </div>

    </div>
  );
}

export default App;