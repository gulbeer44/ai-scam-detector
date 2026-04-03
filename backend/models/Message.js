const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: String,
  prediction: String,
  scamType: String,   // ✅ ADD THIS
  userId: String
},{ timestamps :true });

module.exports = mongoose.model("Message", messageSchema);