require("dotenv").config();

const express = require("express"); const 
cors = require("cors"); const bcrypt = 
require("bcryptjs"); const mongoose = 
require("mongoose"); const depositRoutes = 
require("./routes/deposit");
const withdrawRoutes = require("./routes/withdraw");
const b2cRoutes = require("./routes/b2c");
const adminRoutes = require("./routes/admin");
const mpesaRoutes = require("./routes/mpesa");
const Payment = require("./models/Payment");
const User = require("./models/User");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/deposit", depositRoutes());
app.use("/mpesa", mpesaRoutes);
app.use("/withdraw", withdrawRoutes);
app.use("/b2c", b2cRoutes);
app.use("/admin", adminRoutes);
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Error:", err);
  });

// Home Route
app.get("/", (req, res) => {
  res.send("SmartWinKenya Backend is Running!");
});

// Register
app.post("/register", async (req, res) => {
  try {
    const { username, password, referralCode } = req.body;

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
let referrer = null;

	  if (referralCode) {
		    referrer = await User.findOne({ referralCode });

		    if (!referrer) {
			        return res.json({
					      success: false,
					      message: "Invalid referral code."
					    });
			      }
	  }
	  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
	      username,
	      password: hashedPassword,
	      coins: referrer ? 50 : 0,
	      score: 0,
	      referralCode: username.toUpperCase() + Math.floor(Math.random() * 10000),
	      referredBy: referrer ? referrer.username : "",
	      lastDailyBonus: null
    });

    await user.save();
if (referrer) {
	  referrer.coins += 100;
	  await referrer.save();
}
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
app.get("/leaderboard", async (req, res) => {
	  try {
		      const users = await User.find({}, "-password")
		        .sort({ score: -1, coins: -1 })
		        .limit(20);

		      res.json({
			            success: true,
			            users
			          });
		    } catch (err) {
			        console.error(err);

			        res.json({
					      success: false,
					      message: "Server error."
					    });
			      }
});
app.get("/referral/:username", async (req, res) => {
	  try {
		      const user = await User.findOne(
			            { username: req.params.username },
			            "username referralCode"
			          );

		      if (!user) {
			            return res.json({
					            success: false,
					            message: "User not found."
					          });
			          }

		      res.json({
			            success: true,
			            referralCode: user.referralCode
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

    if (!user.referralCode) {
	      user.referralCode =
		        user.username.toUpperCase() + Math.floor(Math.random() * 10000);
	      await user.save();
    }

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

// Daily Bonus
app.post("/dailyBonus", async (req, res) => {
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
        message: "You have already claimed today's bonus."
      });
    }

    user.coins += 50;
    user.lastDailyBonus = today;

    await user.save();

    res.json({
      success: true,
      message: "🎁 You received 50 bonus coins!",
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




