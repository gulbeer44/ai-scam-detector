import { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ NEW STATES
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ✅ EMAIL VALIDATION
  const validateEmail = (value) => {
    const regex = /^\S+@\S+\.\S+$/;
    if (!regex.test(value)) {
      setEmailError("Enter a valid email (example: test@gmail.com)");
    } else {
      setEmailError("");
    }
  };

  // ✅ PASSWORD VALIDATION (uppercase added)
  const validatePassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;

    if (!regex.test(value)) {
      setPasswordError(
        "Password must be at least 6 characters, include uppercase, lowercase, number, and special character"
      );
    } else {
      setPasswordError("");
    }
  };

  const handleSignup = async () => {
    // ✅ PREVENT INVALID SUBMIT
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    if (emailError || passwordError) {
      setError("Please fix the errors above");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:5000/signup", {
        email,
        password
      });

      setSuccess("✅ Account created successfully");
      setError("");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

    } catch (err) {
      setSuccess("");

      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <Box className="signup-root">

      <Box className="signup-card">

        <Typography variant="h5" className="signup-title">
          📝 Create Account
        </Typography>

        {/* ✅ EMAIL FIELD */}
        <TextField
          fullWidth
          label="Email"
          className="signup-input"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          error={!!emailError}
          helperText={emailError}
        />

        {/* ✅ PASSWORD FIELD */}
        <TextField
          fullWidth
          type="password"
          label="Password"
          className="signup-input"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
          error={!!passwordError}
          helperText={passwordError}
        />

        {/* ✅ PASSWORD RULES (NEW UI) */}
        <Typography variant="caption" color="text.secondary">
          Password must include:
          <br />• At least 6 characters  
          <br />• One uppercase letter (A-Z)  
          <br />• One lowercase letter (a-z)  
          <br />• One number (0-9)  
          <br />• One special character (@$!%*#?&)
        </Typography>

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