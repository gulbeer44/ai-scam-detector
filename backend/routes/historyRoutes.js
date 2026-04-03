const express = require("express");
const router = express.Router();
const { getHistory } = require("../controllers/historyController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/history", verifyToken, getHistory);

module.exports = router;