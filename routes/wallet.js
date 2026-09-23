const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get Wallet
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username
    });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found."
      });
    }

    res.json({
      success: true,
      username: user.username,
      coins: user.coins,
      score: user.score
    });

  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: "Server error."
    });
  }
});

// Update Wallet
router.post("/update", async (req, res) => {
  try {
    const { username, coins, score } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found."
      });
    }

    user.coins = coins;
    user.score = score;

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      score: user.score
    });

  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: "Server error."
    });
  }
});

// Daily Bonus
router.post("/dailyBonus", async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found."
      });
    }

    const today = new Date();

    if (
      user.lastDailyBonus &&
      user.lastDailyBonus.toDateString() === today.toDateString()
    ) {
      return res.json({
        success: false,
        message: "Today's bonus already claimed."
      });
    }

    user.coins += 50;
    user.lastDailyBonus = today;

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      message: "Daily bonus added."
    });

  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: "Server error."
    });
  }
});

// Leaderboard
router.get("/leaderboard/top", async (req, res) => {
  try {
    const users = await User.find({}, "username score coins")
      .sort({ score: -1, coins: -1 })
      .limit(10);

    res.json({
      success: true,
      leaderboard: users
    });

  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: "Server error."
    });
  }
});

module.exports = router;