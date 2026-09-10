const express=require("express");
const cors=require("cors");
const bcrypt=require("bcryptjs");
const mongoose=require("mongoose");
const app=express();app.use(cors());app.use(express.json());
mongoose.connect(process.env.MONGODB_URI).then(()=>console.log("MongoDB Connected")).catch(console.error);
const User=mongoose.model("User",new mongoose.Schema({username:{type:String,unique:true},password:String,coins:{type:Number,default:0},score:{type:Number,default:0}}));
app.get("/",(r,s)=>s.send("SmartWinKenya Backend is Running!"));
app.post("/register",async(r,s)=>{try{const{username,password}=r.body;if(!username||!password)return s.json({success:false,message:"Username and password are required."});if(await User.findOne({username}))return s.json({success:false,message:"Username already exists."});const hp=await bcrypt.hash(password,10);await User.create({username,password:hp});s.json({success:true,message:"Registration successful!"});}catch(e){s.json({success:false,message:"Server error."});}});
app.post("/login",async(r,s)=>{try{const{username,password}=r.body;const u=await User.findOne({username});if(!u)return s.json({success:false,message:"Invalid username or password."});if(!await bcrypt.compare(password,u.password))return s.json({success:false,message:"Invalid username or password."});s.json({success:true,message:"Login successful!",username:u.username,coins:u.coins,score:u.score});}catch(e){s.json({success:false,message:"Server error."});}});
// Get Walletconst 
// PORT=process.env.PORT||3000;app.listen(PORT,()=>console.log("Server 
// running on port "+PORT));
app.get("/wallet/:username", async (req, 
res) => {
  try { const user = await User.findOne({ 
    username: req.params.username }); if 
    (!user) {
      return res.json({ success: false, 
      message: "User not found." });
    }
    res.json({ success: true, coins: 
      user.coins, score: user.score
    });
  } catch (err) {
    res.json({ success: false, message: 
    "Server error." });
  }
});
// Update walletconst PORT = 
// process.env.PORT || 3000;
app.post("/update", async (req, res) => 
  {app.listen(PORT, () => { 
  console.log("Server running on port " + 
  PORT); try {});
    const { username, coins, score } = 
    req.body; const user = await 
    User.findOne({ username }); if (!user) 
    {
      return res.json({ success: false, 
        message: "User not found."
      });
    }
    user.coins = coins; user.score = 
    score; await user.save(); res.json({
      success: true, message: "Wallet 
      updated successfully!"
    });
  } catch (err) {
    res.json({ success: false, message: 
      "Server error."
    });
  }
});
