const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

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

	  coinsAdded: {
		      type: Number,
		      default: 0
		    },

	  status: {
		      type: String,
		      enum: ["pending", "success", "failed"],
		      default: "pending"
		    },

	  mpesaReceipt: {
		      type: String,
		      default: ""
		    },

	  transactionDate: {
		      type: Date,
		      default: Date.now
		    }

});

module.exports = mongoose.model("Payment", paymentSchema);
