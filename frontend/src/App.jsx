import LandingPage from "./pages/LandingPage/LandingPage";
import { useState } from "react";
import axios from "axios";
import Header from "./components/Header/Header";
import TextInput from "./components/TextInput/TextInput";
import ResultCard from "./components/ResultCard/ResultCard";
import History from "./components/History/History";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import './styles/app.css'
import {
  Button,
  CircularProgress,
  Container,
  Typography,
  Box
} from "@mui/material";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#020617",
      paper: "#0f172a"
    }
  },
  shape: {
    borderRadius: 12
  }
});

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const analyze = async () => {
    if (!text.trim()) {
      setError("Please enter a message");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      console.log("TOKEN:", token);

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/analyze`,
        { text },
        token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {}
      );

      setResult(res.data);

    } catch (err) {
      console.log("ERROR:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");

        setError("Session expired. Please login again.");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);

      } else if (err.response) {
        setError(err.response.data?.error || "Server error");

      } else if (err.request) {
        setError("Backend not running");

      } else {
        setError("Something went wrong");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>

          {/* 🔥 NEW: Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* 🔥 YOUR APP MOVED HERE */}
          <Route
            path="/home"
            element={
              <>
                <Header />

                <Container maxWidth="sm" sx={{ mt: 4 }}>

                  {!token ? (
                    <Box textAlign="center" mt={10}>
                      <Typography variant="h4">
                        🔒 Access Restricted
                      </Typography>
                      <Typography mt={2}>
                        Please login to start detecting scam messages
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <TextInput
                        text={text}
                        setText={setText}
                        analyze={analyze}
                        loading={loading}
                      />

                      {loading && (
                        <Box textAlign="center" mt={3}>
                          <CircularProgress />
                          <Typography mt={1}>
                            Analyzing...
                          </Typography>
                        </Box>
                      )}

                      {error && (
                        <Typography color="error" mt={2} align="center">
                          {error}
                        </Typography>
                      )}

                      {result && !loading && (
                        <ResultCard result={result} text={text} />
                      )}

                      <Button
                        fullWidth
                        sx={{ mt: 3 }}
                        onClick={() => setShowHistory(!showHistory)}
                      >
                        {showHistory ? "Hide History" : "Show History"}
                      </Button>

                      {showHistory && <History text={text} />}
                    </>
                  )}
                </Container>
              </>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;