const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    match: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).+$/
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);