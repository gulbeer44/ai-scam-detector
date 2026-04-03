const axios = require("axios");
const Message = require("../models/Message");

const AI_URL = process.env.AI_URL;

exports.analyze = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 5) {
      return res.status(400).json({
        error: "Please enter a meaningful message"
      });
    }

    let result;

    try {
      const response = await axios.post(AI_URL, { text });
      result = response.data;
    } catch {
      return res.status(503).json({
        error: "AI service not running"
      });
    }

    if (result.prediction === "Invalid") {
      return res.json(result);
    }

    const msg = new Message({
      text,
      prediction: result.prediction,
      scamType: result.scam_type || "Unknown",
      userId: req.userId
    });

    await msg.save();

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};