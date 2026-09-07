
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

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

