
const express = require("express");
const axios = require("axios");
const { Buffer } = require("buffer");
const Payment = require("../models/Payment");

async function getAccessToken() {
  const auth = Buffer.from(
    process.env.CONSUMER_KEY + ":" + process.env.CONSUMER_SECRET
  ).toString("base64");

  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: "Basic " + auth,
      },
    }
  );
console.log("OAuth Response:", response.data);
	
	console.log("Access Token:", response.data.access_token);
  console.log("OAuth Response:", response.data);
	  return response.data.access_token;
}

module.exports = () => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      const { username, phone, amount } = req.body;

      if (!username || !phone || !amount) {
        return res.json({
          success: false,
          message: "Please fill in all fields.",
        });
      }

      let formattedPhone = phone.trim();

      if (formattedPhone.startsWith("0")) {
        formattedPhone = "254" + formattedPhone.substring(1);
      }

      const timestamp = new Date()
        .toISOString()
        .replace(/[-:TZ.]/g, "")
        .substring(0, 14);

      const password = Buffer.from(
        process.env.BUSINESS_SHORT_CODE +
          process.env.PASSKEY +
          timestamp
      ).toString("base64");

      const token = await getAccessToken();
console.log("Access token received:", !!token);
      const requestBody = {
        BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",        Amount: Number(amount),
        PartyA: formattedPhone,
        PartyB: process.env.BUSINESS_SHORT_CODE,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: username,
        TransactionDesc: "SmartWin Kenya Deposit",
      };
console.log({
	  BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
	  PasskeyLength: process.env.PASSKEY ? process.env.PASSKEY.length : 0,
	  CallbackURL: process.env.CALLBACK_URL,
	  ConsumerKeyExists: !!process.env.CONSUMER_KEY,
	  ConsumerSecretExists: !!process.env.CONSUMER_SECRET
});

      console.log("STK Request Body:");
      console.log(JSON.stringify(requestBody, null, 2));

     console.log("===== DEBUG CONFIG =====");
console.log({
	  BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
	  PasskeyLength: process.env.PASSKEY ? process.env.PASSKEY.length : 0,
	  ConsumerKeyExists: !!process.env.CONSUMER_KEY,
	  ConsumerSecretExists: !!process.env.CONSUMER_SECRET,
	  CallbackURL: process.env.CALLBACK_URL
});
          console.log("========================");

const stkResponse = await axios.post(
	  "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
	  requestBody,
	  {eaders: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );

      await Payment.create({
        username,
        phone: formattedPhone,
        amount: Number(amount),
        merchantRequestID: stkResponse.data.MerchantRequestID,
        checkoutRequestID: stkResponse.data.CheckoutRequestID,
      });

      return res.json(stkResponse.data);

    } catch (err) {
      console.error("========== STK ERROR ==========");
      console.error("Status:", err.response?.status);
      console.error("Headers:", err.response?.headers);
      console.error("Data:", err.response?.data);
      console.error("Message:", err.message);
      console.error("==============================");

      return res.json({
        success: false,
        message: "STK Push failed.",
        error: err.response?.data || err.message,
      });
    }
  });

  return router;
};
