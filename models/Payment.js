const mongoose = require("mongoose"); 
const paymentSchema = new 
mongoose.Schema({
  username: { type: String, required: true 
  },
  phone: { type: String, required: true }, 
  amount: { type: Number, required: true 
  },
  merchantRequestID: { type: String, 
  default: "" }, checkoutRequestID: { 
  type: String, default: "" }, resultCode: 
  { type: Number, default: null }, 
  resultDesc: { type: String, default: "" 
  },
  mpesaReceipt: { type: String, default: 
  "" }, status: {
    type: String, enum: ["pending", 
    "success", "failed"], default: 
    "pending"
  }
}, {
  timestamps: true
});
module.exports = mongoose.model("Payment", paymentSchema);
