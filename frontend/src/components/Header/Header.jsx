import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <AppBar position="sticky" elevation={0} className="header-appbar">
      <Toolbar className="header-toolbar">

        {/* 🔥 LOGO */}
        <Typography variant="h6" className="header-logo">
          🔍 AI Scam Detector
        </Typography>

        {/* 🔥 ACTIONS */}
        <Box className="header-actions">

          {token ? (
            <Button onClick={logout} className="header-btn">
              Logout
            </Button>
          ) : (
            <>
              <Button component={Link} to="/login" className="header-btn">
                Login
              </Button>

              <Button
                component={Link}
                to="/signup"
                className="header-btn signup-btn"
              >
                Signup
              </Button>
            </>
          )}

        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default Header;