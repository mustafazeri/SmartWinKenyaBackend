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

			            console.log("Sending STK Request...");
			            console.log({
					            BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
					            Password: password,
					            Timestamp: timestamp,
					            PartyA: formattedPhone,
					            PhoneNumber: formattedPhone,
					            CallBackURL: process.env.CALLBACK_URL,
					            Amount: Number(amount)
					          });

			            const stkResponse = await axios.post(
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
							              TransactionDesc: "SmartWin Kenya Deposit"
							            },
					            {
							              headers: {
									                  Authorization: "Bearer " + token,
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
