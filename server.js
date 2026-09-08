
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

let users = [];

app.get("/", (req, res) => {
  res.send("SmartWinKenya Backend is Running!");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({
      success: false,
      message: "Username and password are required."
    });
  }

  const existingUser = users.find(user => user.username === username);

  if (existingUser) {
    return res.json({
      success: false,
      message: "Username already exists."
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    username,
    password: hashedPassword
  });

  res.json({
    success: true,
    message: "Registration successful!"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
