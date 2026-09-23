require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const walletRoutes = require("./routes/wallet");
const mpesaRoutes = require("./routes/mpesa");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// Routes
app.use("/auth", authRoutes);
app.use("/wallet", walletRoutes);
app.use("/", mpesaRoutes);

// Home
app.get("/", (req, res) => {
  res.send("🚀 SmartWin Kenya Backend V2 is Running!");
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
  console.log(`🚀 Server running on port ${PORT}`);
});