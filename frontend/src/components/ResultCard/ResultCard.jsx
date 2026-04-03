import jsPDF from "jspdf";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import "./ResultCard.css";

function ResultCard({ result, text }) {

  const highlightText = (text, keywords = []) => {
    let words = text.split(" ");
    return words.map((word, i) => {
      if (keywords.includes(word.toLowerCase())) {
        return (
          <span key={i} className="highlight-word">
            {word}{" "}
          </span>
        );
      }
      return word + " ";
    });
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("AI Scam Detection Report", 20, 20);

    doc.setFontSize(12);
    const splitMessage = doc.splitTextToSize(text, 170);

    doc.text("Message:", 20, 40);
    doc.text(splitMessage, 20, 50);

    let y = 50 + splitMessage.length * 8;

    doc.text(`Prediction: ${result.prediction}`, 20, y + 10);
    doc.text(`Confidence: ${result.confidence}`, 20, y + 20);
    doc.text(`Risk Score: ${result.risk_score}`, 20, y + 30);
    doc.text(`Type: ${result.scam_type}`, 20, y + 40);

    doc.text("Reasons:", 20, y + 55);

    result.reasons.forEach((r, i) => {
      doc.text(`- ${r}`, 20, y + 65 + i * 8);
    });

    doc.save("scam-report.pdf");
  };

  const getRiskLevel = (score) => {
    if (score <= 30) return { label: "Low", color: "#22c55e" };
    if (score <= 60) return { label: "Medium", color: "#facc15" };
    return { label: "High", color: "#ef4444" };
  };

  const copyResult = () => {
    const content = `
Prediction: ${result.prediction}
Confidence: ${result.confidence}
Risk Score: ${result.risk_score}
Type: ${result.scam_type}

Message:
${text}
    `;
    navigator.clipboard.writeText(content);
    alert("Copied to clipboard!");
  };

  const shareResult = () => {
    const content = `Scam Detection Result:
${result.prediction}
Risk Score: ${result.risk_score}

Message:
${text}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(content)}`);
  };

  return (
    <Card className="result-card">
      <CardContent>

        <Typography
          variant="h4"
          className={`result-title ${
            result.prediction === "Scam"
              ? "scam"
              : result.prediction === "Invalid"
              ? "invalid"
              : "safe"
          }`}
        >
          {result.prediction === "Scam"
            ? "🚨 Scam Detected"
            : result.prediction === "Invalid"
            ? "⚠️ Invalid Input"
            : "✅ Safe Message"}
        </Typography>

        {result.prediction === "Scam" && (
          <Typography color="error" className="warning-text">
            ⚠️ Do not click suspicious links or share personal information.
          </Typography>
        )}

        {result.prediction !== "Invalid" && (
          <>
            <Typography className="stat">Confidence: {result.confidence?.toFixed(2)}</Typography>
            <Typography className="stat">Scam Type: {result.scam_type}</Typography>
            <Typography className="stat">Risk Score: {result.risk_score}</Typography>

            <Box mt={1}>
              {(() => {
                const risk = getRiskLevel(result.risk_score);
                return (
                  <Typography
                    className="risk-badge"
                    style={{
                      background: `linear-gradient(135deg, ${risk.color}, #111)`,
                      boxShadow: `0 0 10px ${risk.color}`
                    }}
                  >
                    {risk.label} Risk
                  </Typography>
                );
              })()}
            </Box>
          </>
        )}

        {/* Risk Bar */}
        <Box className="risk-bar-container">
          <Typography className="risk-label">Risk Level</Typography>

          <Box className="risk-bar-bg">
            <Box
              className="risk-bar-fill"
              style={{ width: `${result.risk_score}%` }}
            />
          </Box>
        </Box>

        {/* Message */}
        <Box className="section">
          <Typography className="section-title">Message:</Typography>
          <Typography className="message-text">
            {highlightText(text, result.keywords)}
          </Typography>
        </Box>

        {/* Reasons */}
        <Box className="section">
          <Typography className="section-title">Why:</Typography>
          <ul>
            {result.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </Box>

        {/* Suggestions */}
        <Box className="section">
          <Typography className="section-title">What Should You Do:</Typography>
          <ul>
            {result.prediction === "Scam" ? (
              <>
                <li>Do NOT click suspicious links</li>
                <li>Do NOT share OTP or personal information</li>
                <li>Block the sender immediately</li>
                <li>Report this to cybercrime.gov.in</li>
              </>
            ) : (
              <>
                <li>Always verify the sender before trusting</li>
                <li>Never share OTP with anyone</li>
                <li>Stay cautious with unknown links</li>
              </>
            )}
          </ul>
        </Box>

        {/* Buttons */}
        <Box className="button-group">
          {[
            { label: "Download 📄", action: downloadReport },
            { label: "Copy 📋", action: copyResult },
            { label: "Share 📤", action: shareResult }
          ].map((btn, i) => (
            <Button key={i} onClick={btn.action} className="action-btn">
              {btn.label}
            </Button>
          ))}
        </Box>

      </CardContent>
    </Card>
  );
}

export default ResultCard;