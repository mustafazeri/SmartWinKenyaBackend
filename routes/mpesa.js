const express = require("express");
const axios = require("axios");

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

// Callback
router.post("/callback", (req, res) => {
  console.log(
    "M-Pesa Callback:",
    JSON.stringify(req.body, null, 2)
  );

  res.json({
    ResultCode: 0,
    ResultDesc: "Accepted"
  });
});

module.exports = router;