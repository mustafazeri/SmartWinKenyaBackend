const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

	  username: {
		      type: String,
		      required: true,
		      unique: true,
		      trim: true
		    },

	  password: {
		      type: String,
		      required: true
		    },

	  isAdmin: {
		      type: Boolean,
		      default: false
		    },

	  // 1 Coin = KSh 1
	//   coins: {
	//       type: Number,
	//           default: 0,
	//               min: 0
	//                 },
	//
	//                   score: {
	//                       type: Number,
	//                           default: 0
	//                             },
	//
	//                               gamesPlayed: {
	//                                   type: Number,
	//                                       default: 0
	//                                         },
	//
	//                                           gamesWon: {
	//                                               type: Number,
	//                                                   default: 0
	//                                                     },
	//
	//                                                       gamesLost: {
	//                                                           type: Number,
	//                                                               default: 0
	//                                                                 },
	//
	//                                                                   totalDeposited: {
	//                                                                       type: Number,
	//                                                                           default: 0
	//                                                                             },
	//
	//                                                                               totalWithdrawn: {
	//                                                                                   type: Number,
	//                                                                                       default: 0
	//                                                                                         },
	//
	//                                                                                           referralCode: {
	//                                                                                               type: String,
	//                                                                                                   unique: true,
	//                                                                                                       sparse: true
	//                                                                                                         },
	//
	//                                                                                                           referredBy: {
	//                                                                                                               type: String,
	//                                                                                                                   default: null
	//                                                                                                                     },
	//
	//                                                                                                                       referralRewardPaid: {
	//                                                                                                                           type: Boolean,
	//                                                                                                                               default: false
	//                                                                                                                                 },
	//
	//                                                                                                                                   // Questions this player has already answered
	//                                                                                                                                     seenQuestions: [{
	//                                                                                                                                         type: mongoose.Schema.Types.ObjectId,
	//                                                                                                                                             ref: "Question"
	//                                                                                                                                               }],
	//
	//                                                                                                                                                 createdAt: {
	//                                                                                                                                                     type: Date,
	//                                                                                                                                                         default: Date.now
	//                                                                                                                                                           }
	//
	//                                                                                                                                                           });
	//
	//                                                                                                                                                           module.exports = mongoose.model("User", userSchema);
