const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
	{
		  username: {
			      type: String,
			      required: true
			    },
		  phone: {
			      type: String,
			      required: true
			    },
		  amount: {
			      type: Number,
			      required: true
			    },
		  coins: {
			      type: Number,
			      required: true
			    },
		  status: {
			      type: String,
			      enum: ["pending", "approved", "rejected", "paid"],
			      default: "pending"
			    },
		  mpesaReceipt: {
			      type: String,
			      default: ""
			    }
	},
	{
		  timestamps: true
	});

module.exports = mongoose.model("Withdrawal", withdrawalSchema);
