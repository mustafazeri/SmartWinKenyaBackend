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

	  return response.data.access_token;
}

function getTimestamp() {
	  const now = new Date();

	  return (
		      now.getFullYear().toString() +
		      String(now.getMonth() + 1).padStart(2, "0") +
		      String(now.getDate()).padStart(2, "0") +
		      String(now.getHours()).padStart(2, "0") +
		      String(now.getMinutes()).padStart(2, "0") +
		      String(now.getSeconds()).padStart(2, "0")
		    );
}

function getPassword(timestamp) {
	  return Buffer.from(
		      process.env.BUSINESS_SHORT_CODE +
		        process.env.PASSKEY +
		        timestamp
		    ).toString("base64");
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

			            const timestamp = getTimestamp();
			            const password = getPassword(timestamp);
			            const accessToken = await getAccessToken();

			            const response = await axios.post(
					            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
					            {
							              BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
							              Password: password,
							              Timestamp: timestamp,
							              TransactionType: "CustomerPayBillOnline",
							              Amount: Number(amount),
							              PartyA: formattedPhone,
							              PartyB: process.env.BUSINESS_SHORT_CODE,
							              PhoneNumber: formattedPhone,
							              CallBackURL: process.env.CALLBACK_URL,
							              AccountReference: username,
							              TransactionDesc: "SmartWin Kenya Deposit",
							            },
					            {
							              headers: {
									                  Authorization: "Bearer " + accessToken,
									                },
							            }
					          );

			            await Payment.create({
					            username,
					            phone: formattedPhone,
					            amount: Number(amount),
					            merchantRequestID: response.data.MerchantRequestID,
					            checkoutRequestID: response.data.CheckoutRequestID,
					            status: "pending",
					          });

			            return res.json(response.data);
			          } catch (err) {
					        console.error("========== STK ERROR ==========");
					        console.error("Status:", err.response?.status);
					        console.error(
							        "Data:",
							        JSON.stringify(err.response?.data, null, 2)
							      );
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
