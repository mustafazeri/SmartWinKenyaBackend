const express = require("express");
const router = express.Router();

router.post("/pay", async (req, res) => {
	  const { username, phone, amount } = req.body;

	  return res.json({
		      success: false,
		      message: "B2C integration is not enabled yet.",
		      username,
		      phone,
		      amount
		    });
});

module.exports = router;
