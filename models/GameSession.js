const mongoose = require("mongoose");

const gameSessionSchema = new mongoose.Schema({

	  username: {
		      type: String,
		      required: true
		    },

	  stake: {
		      type: Number,
		      required: true
		    },

	  reward: {
		      type: Number,
		      required: true
		    },

	  questions: [{
		      type: mongoose.Schema.Types.ObjectId,
		      ref: "Question"
		    }],

	  currentQuestion: {
		      type: Number,
		      default: 0
		    },

	  score: {
		      type: Number,
		      default: 0
		    },

	  status: {
		      type: String,
		      enum: ["playing", "won", "lost", "quit"],
		      default: "playing"
		    },

	  startedAt: {
		      type: Date,
		      default: Date.now
		    },

	  finishedAt: {
		      type: Date,
		      default: null
		    }

});

module.exports = mongoose.model("GameSession", gameSessionSchema);
