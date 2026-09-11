
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));
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
  }
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("SmartWinKenya Backend is Running!");
});
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        success: false,
        message: "Username and password are required."
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.json({
        success: false,
        message: "Username already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPassword,
      coins: 0,
      score: 0
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
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        success: false,
        message: "Username and password are required."
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid username or password."
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.json({
        success: false,
        message: "Invalid username or password."
      });
    }

    res.json({
      success: true,
      message: "Login successful!",
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
// Get Wallet
app.get("/wallet/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

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
app.post("/update", async (req, res) => {
  try {
    const { username, coins, score } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found."
      });
    }

    if (typeof coins === "number") {
      user.coins = coins;
    }

    if (typeof score === "number") {
      user.score = score;
    }

    await user.save();

    res.json({
      success: true,
      message: "Wallet updated successfully!",
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

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
