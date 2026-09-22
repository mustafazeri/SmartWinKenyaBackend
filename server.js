require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Error:", err);
  });// User Schema
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

const User = mongoose.model("User", userSchema);

// Home Route
app.get("/", (req, res) => {
  res.send("SmartWinKenya Backend is Running!");
});

// Register
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
    const user = new User({
      username,
      password: hashedPassword,
      coins: 0,
      score: 0,
      lastDailyBonus: null
    });

    await user.save();

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

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

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
});// Get Wallet
app.get("/wallet/:username", async (req, res) => {
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

    user.coins = coins;
    user.score = score;

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
});// Update Coins
app.post("/coins", async (req, res) => {
  try {
    const { username, coins } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found."
      });
    }

    user.coins = coins;

    await user.save();

    res.json({
      success: true,
      coins: user.coins
    });

  } catch (err) {
    console.error(err);

    res.json({
      success: false,
      message: "Server error."
    });
  }
});
app.post("/deposit", async (req, res) => { 
  try {// Daily Bonus
    const { phone, amount } = 
  req.body;app.post("/dailyBonus", async 
  (req, res) => { try {
    const { username } = req.body; if 
    (!phone || !amount) { const user = 
    await User.findOne({ username });
      return res.status(400).json({ if 
    (!user) {
        success: false, return res.json({ 
        success: false, message: "User not 
        found." message: "Phone number and 
        amount are required."  });
      }); }
    }
    const today = new Date();

    if ( user.lastDailyBonus && 
      user.lastDailyBonus.toDateString() 
      === today.toDateString()
    res.json({ ) { return res.json({ 
      success: true, success: false, 
      ResponseCode: "0", message: "You 
      have already claimed today's bonus." 
      ResponseDescription: "Deposit 
      endpoint is working."  });
    }); }

    user.coins += 50; user.lastDailyBonus 
    = today;
  } catch (err) {
    console.error(err); await user.save(); 
    res.status(500).json({ res.json({
      success: false, success: true, 
      message: "🎁 You received 50 bonus 
      coins!", coins: user.coins message: 
      "Server error."  });
    });
  }  } catch (err) {
});    console.error(err);

    res.json({
      success: false,
      message: "Server error."
    });
  }
});

// Health Check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "Backend is healthy"
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {

	  console.log(`Server running on port ${PORT}`);
});




