const Message = require("../models/Message");

exports.getHistory = async (req, res) => {
  try {
    const search = req.query.search || "";
    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const data = await Message.find({
      userId: req.userId,
      text: { $regex: safeSearch, $options: "i" }
    })
      .sort({ _id: -1 })
      .limit(10);

    res.json(data);

  } catch {
    res.status(500).json({
      error: "SERVER_ERROR",
      message: "Failed to fetch history"
    });
  }
};