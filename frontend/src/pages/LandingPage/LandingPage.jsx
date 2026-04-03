import { Box, Typography, Button, Grid, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box className="landing-root">

      {/* 🔥 BACKGROUND GLOW */}
      <Box className="landing-glow" />

      {/* 🔥 HERO SECTION */}
      <Container maxWidth="md" className="landing-hero">
        <Typography variant="h3" className="landing-title">
          🔍 AI Scam Detector
        </Typography>

        <Typography className="landing-subtitle">
          Detect scam messages instantly using AI + smart analysis
        </Typography>

        <Button
          onClick={() => navigate("/home")}
          className="landing-btn"
        >
          🚀 Start Scanning
        </Button>
      </Container>

      {/* 🔥 FEATURES */}
      <Container maxWidth="xl" className="landing-features">
        <Grid container spacing={4} justifyContent="center">

          {[
            { title: "🤖 AI Detection", desc: "Detect scams using ML + rules" },
            { title: "📊 Smart Insights", desc: "Understand scam patterns" },
            { title: "📄 PDF Reports", desc: "Download detailed reports" },
            { title: "🔐 Secure Login", desc: "JWT based authentication" }
          ].map((item, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Box className="feature-card">
                <Typography variant="h6" className="feature-title">
                  {item.title}
                </Typography>
                <Typography className="feature-desc">
                  {item.desc}
                </Typography>
              </Box>
            </Grid>
          ))}

        </Grid>
      </Container>

      {/* 🔥 ABOUT */}
      <Container maxWidth="md" className="landing-about">
        <Typography variant="h5" className="about-title">
          About This Project
        </Typography>

        <Typography className="about-text">
          This application uses machine learning and rule-based detection
          to identify scam messages and protect users from fraud attempts.
        </Typography>
      </Container>

    </Box>
  );
}

export default LandingPage;