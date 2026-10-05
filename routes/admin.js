const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Payment = require("../models/Payment");
const Withdrawal = require("../models/Withdrawal");

router.get("/stats", async (req, res) => {
	  try {
		      const users = await User.countDocuments();
		      const deposits = await Payment.countDocuments();
		      const withdrawals = await Withdrawal.countDocuments();

		      res.json({
			            success: true,
			            users,
			            deposits,
			            withdrawals
			          });
		    } catch (err) {
			        console.error(err);

			        res.json({
					      success: false,
					      message: "Server error."
					    });
			      }
});

router.get("/payments", async (req, res) => {
	  try {
		const payments = await Payment.find()
		  .sort({ createdAt: -1 })
		  .limit(20);

		      res.json({
			            success: true,
			            payments
			          });
		    } catch (err) {
			        console.error(err);

			        res.json({
					      success: false,
					      message: "Server error."
					    });
			      }
});
router.get("/users", async (req, res) => {
	  try {
		      const users = await User.find({}, "-password")
		        .sort({ username: 1 });

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
module.exports = router;
