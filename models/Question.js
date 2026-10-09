const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
	  category: {
		      type: String,
		      default: "General"
		    },

	  question: {
		      type: String,
		      required: true,
		      unique: true
		    },

	  options: [{
		      type: String,
		      required: true
		    }],

	  answer: {
		      type: Number,
		      required: true
		    },

	  difficulty: {
		      type: String,
		      default: "Normal"
		    }
});

module.exports = mongoose.model("Question", questionSchema);
