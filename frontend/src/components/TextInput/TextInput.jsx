import { Box, TextField, Button, Stack, Typography } from "@mui/material";
import "./TextInput.css";

function TextInput({ text, setText, analyze, loading }) {

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      analyze();
    }
  };

  return (
    <Box className="textinput-container">

      <Stack className="textinput-box" spacing={2}>

        {/* 📝 Input Field */}
        <TextField
          label="Enter suspicious message"
          multiline
          rows={4}
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="outlined"
          className="textinput-field"
        />

        {/* 🔢 Character Counter */}
        <Typography className="textinput-counter" align="right">
          {text.length} characters
        </Typography>

        {/* 🔘 Button */}
        <Button
          fullWidth
          onClick={analyze}
          disabled={loading}
          className="textinput-button"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </Button>

      </Stack>
    </Box>
  );
}

export default TextInput;