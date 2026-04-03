import { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await axios.post("http://localhost:5000/login", {
      email,
      password
    });

    localStorage.setItem("token", res.data.token);
    window.location.href = "/";
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