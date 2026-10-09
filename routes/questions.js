const express = require("express");
const router = express.Router();

const Question = require("../models/Question");
const User = require("../models/User");

// Add Question
// router.post("/add", async (req, res) => {
//
//     try {
//
//             const {
//                         username,
//                                     category,
//                                                 difficulty,
//                                                             question,
//                                                                         options,
//                                                                                     answer
//                                                                                             } = req.body;
//
//                                                                                                     const admin = await User.findOne({ username });
//
//                                                                                                             if (!admin || !admin.isAdmin) {
//                                                                                                                         return res.json({
//                                                                                                                                         success: false,
//                                                                                                                                                         message: "Admin only."
//                                                                                                                                                                     });
//                                                                                                                                                                             }
//
//                                                                                                                                                                                     const q = new Question({
//                                                                                                                                                                                                 category,
//                                                                                                                                                                                                             difficulty,
//                                                                                                                                                                                                                         question,
//                                                                                                                                                                                                                                     options,
//                                                                                                                                                                                                                                                 answer
//                                                                                                                                                                                                                                                         });
//
//                                                                                                                                                                                                                                                                 await q.save();
//
//                                                                                                                                                                                                                                                                         res.json({
//                                                                                                                                                                                                                                                                                     success: true,
//                                                                                                                                                                                                                                                                                                 message: "Question added."
//                                                                                                                                                                                                                                                                                                         });
//
//                                                                                                                                                                                                                                                                                                             } catch (err) {
//
//                                                                                                                                                                                                                                                                                                                     console.error(err);
//
//                                                                                                                                                                                                                                                                                                                             res.json({
//                                                                                                                                                                                                                                                                                                                                         success: false,
//                                                                                                                                                                                                                                                                                                                                                     message: "Server error."
//                                                                                                                                                                                                                                                                                                                                                             });
//
//                                                                                                                                                                                                                                                                                                                                                                 }
//
//                                                                                                                                                                                                                                                                                                                                                                 });
//
//                                                                                                                                                                                                                                                                                                               
//                                                                                                                                                                                                          // Get All Questions
//                                                                                                                                                                                                          router.get("/all", async (req, res) => {
//
//                                                                                                                                                                                                              try {
//
//                                                                                                                                                                                                                      const questions = await Question.find().sort({
//                                                                                                                                                                                                                                  category: 1
//                                                                                                                                                                                                                                          });
//
//                                                                                                                                                                                                                                                  res.json({
//                                                                                                                                                                                                                                                              success: true,
//                                                                                                                                                                                                                                                                          total: questions.length,
//                                                                                                                                                                                                                                                                                      questions
//                                                                                                                                                                                                                                                                                              });
//
//                                                                                                                                                                                                                                                                                                  } catch (err) {
//
//                                                                                                                                                                                                                                                                                                          console.error(err);
//
//                                                                                                                                                                                                                                                                                                                  res.json({
//                                                                                                                                                                                                                                                                                                                              success: false,
//                                                                                                                                                                                                                                                                                                                                          message: "Server error."
//                                                                                                                                                                                                                                                                                                                                                  });
//
//                                                                                                                                                                                                                                                                                                                                                      }
//
//                                                                                                                                                                                                                                                                                                                                                      });module.exports = router;
