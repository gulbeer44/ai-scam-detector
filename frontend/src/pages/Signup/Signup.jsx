import { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    await axios.post("http://localhost:5000/signup", {
      email,
      password
    });

    window.location.href = "/login";
  };

  return (
    <Box className="signup-root">

      <Box className="signup-card">

        <Typography variant="h5" className="signup-title">
          📝 Create Account
        </Typography>

        <TextField
          fullWidth
          label="Email"
          className="signup-input"
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          className="signup-input"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          onClick={handleSignup}
          className="signup-btn"
        >
          Signup
        </Button>

      </Box>

    </Box>
  );
}

export default Signup;