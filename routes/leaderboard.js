
const express = require("express");

module.exports = (User) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const users = await User.find({}, "username coins score")
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

  return router;
};

