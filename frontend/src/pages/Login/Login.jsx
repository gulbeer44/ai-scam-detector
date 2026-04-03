import { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);

      setSuccess("✅ Login successful");
      setError("");

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);

    } catch (err) {
      setSuccess("");

      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Invalid login credentials");
      }
    }
  };

  return (
    <Box className="login-root">

      <Box className="login-card">

        <Typography variant="h5" className="login-title">
          🔐 Secure Login
        </Typography>

        <TextField
          fullWidth
          label="Email"
          className="login-input"
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          className="login-input"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ✅ ERROR MESSAGE */}
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        {/* ✅ SUCCESS MESSAGE */}
        {success && (
          <Typography color="success.main" sx={{ mt: 1 }}>
            {success}
          </Typography>
        )}

        <Button
          fullWidth
          onClick={handleLogin}
          className="login-btn"
        >
          Login
        </Button>

      </Box>

    </Box>
  );
}

export default Login;