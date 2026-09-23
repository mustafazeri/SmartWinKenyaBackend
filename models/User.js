const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  coins: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  lastDailyBonus: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model("User", userSchema);