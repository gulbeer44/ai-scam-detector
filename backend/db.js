const mongoose = require("mongoose");
require("dotenv").config(); // 🔥 IMPORTANT

mongoose.connect(process.env.ATLASDB_URL)
  .then(() => {
    console.log("MongoDB Atlas Connected");
  })
  .catch((err) => {
    console.log("DB Error:", err);
  });