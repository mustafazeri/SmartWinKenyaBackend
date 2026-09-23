const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        success: false,
        message: "Username and password are required."
      });
    }

    const exists = await User.findOne({ username });

    if (exists) {
      return res.json({
        success: false,
        message: "Username already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPassword
    });

    res.json({
      success: true,
      message: "Registration successful!"
    });

  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: "Server error."
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid username or password."
      });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.json({
        success: false,
        message: "Invalid username or password."
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

module.exports = router;