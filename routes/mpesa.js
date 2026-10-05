const express = require("express");
const axios = require("axios");
const Payment = require("../models/Payment");
const User = require("../models/User");
const {
  getAccessToken,
  getTimestamp,
  getPassword,
  BUSINESS_SHORT_CODE
} = require("../utils/mpesa");

const router = express.Router();

const CALLBACK_URL = process.env.CALLBACK_URL;

// STK Push
router.post("/deposit", async (req, res) => {
  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({
        success: false,
        message: "Phone number and amount are required."
      });
    }

    const accessToken = await getAccessToken();
    const timestamp = getTimestamp();
    const password = getPassword(timestamp);

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Number(amount),
        PartyA: phone,
        PartyB: BUSINESS_SHORT_CODE,
        PhoneNumber: phone,
        CallBackURL: CALLBACK_URL,
        AccountReference: "SmartWinKenya",
        TransactionDesc: "Deposit"
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      success: true,
      data: response.data
    });

  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
});
router.post("/callback", async (req, res) => {
	  try {
		      console.log("M-Pesa Callback:", JSON.stringify(req.body, null, 2));

		      const callback = req.body.Body.stkCallback;

		      const payment = await Payment.findOne({
			            checkoutRequestID: callback.CheckoutRequestID
			          });

		      if (payment) {
			      if (payment.status === "success") {
				        console.log("Duplicate callback ignored:", payment.checkoutRequestID);

				        return res.json({
						    ResultCode: 0,
						    ResultDesc: "Accepted"
						  });
			      }
			            payment.resultCode = callback.ResultCode;
			            payment.resultDesc = callback.ResultDesc;

			            if (callback.ResultCode === 0) {
					            payment.status = "success";

					            const receipt = callback.CallbackMetadata.Item.find(
							              item => item.Name === "MpesaReceiptNumber"
							            );

					            if (receipt) {
							              payment.mpesaReceipt = receipt.Value;
							            }

					            const user = await User.findOne({
							              username: payment.username
							            });

					            if (user) {
							              user.coins += payment.amount * 2;
							              await user.save();
							              console.log("Coins credited:", user.username, user.coins);
							            }

					          } else {
							          payment.status = "failed";
							        }

			            await payment.save();
			          }

		      console.log("===== END CALLBACK =====");

		      res.json({
			            ResultCode: 0,
			            ResultDesc: "Accepted"
			          });

		    } catch (err) {
			        console.error(err);
			        res.json({
					      ResultCode: 0,
					      ResultDesc: "Accepted"
					    });
			      }
});
router.get("/history/:username", async (req, res) => {
	  try {
		      const payments = await Payment.find({
			            username: req.params.username
			          }).sort({ createdAt: -1 });

		      res.json({
			            success: true,
			            payments
			          });
		    } catch (err) {
			        console.error(err);

			        res.json({
					      success: false,
					      message: "Server error."
					    });
			      }
});
module.exports = router;
