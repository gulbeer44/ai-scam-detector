const express = require("express");
const router = express.Router();
const { analyze } = require("../controllers/analyzeController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/analyze", verifyToken, analyze);

module.exports = router;