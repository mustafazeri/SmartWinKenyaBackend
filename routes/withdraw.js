const express = require("express");
const router = express.Router();

const Withdrawal = require("../models/Withdrawal");
const User = require("../models/User");

router.post("/", async (req, res) => {
	  try {
		      const { username, phone, amount } = req.body;

		      if (!username || !phone || !amount) {
			            return res.json({
					            success: false,
					            message: "Please fill in all fields."
					          });
			          }

		      const user = await User.findOne({ username });

		      if (!user) {
			            return res.json({
					            success: false,
					            message: "User not found."
					          });
			          }

		      const coinsNeeded = Number(amount) * 2;

		      if (user.coins < coinsNeeded) {
			            return res.json({
					            success: false,
					            message: "Not enough coins."
					          });
			          }

		      user.coins -= coinsNeeded;
		      await user.save();

		      await Withdrawal.create({
			            username,
			            phone,
			            amount: Number(amount),
			            coins: coinsNeeded
			          });

		      res.json({
			            success: true,
			            message: "Withdrawal request submitted.",
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

module.exports = router;
