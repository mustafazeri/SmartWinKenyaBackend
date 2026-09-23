const axios = require("axios");

const BUSINESS_SHORT_CODE = process.env.BUSINESS_SHORT_CODE;
const PASSKEY = process.env.PASSKEY;
const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;

async function getAccessToken() {
  const auth = Buffer.from(
    `${CONSUMER_KEY}:${CONSUMER_SECRET}`
  ).toString("base64");

  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`
      }
    }
  );

  return response.data.access_token;
}

function getTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");

  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

function getPassword(timestamp) {
  return Buffer.from(
    BUSINESS_SHORT_CODE + PASSKEY + timestamp
  ).toString("base64");
}

module.exports = {
  getAccessToken,
  getTimestamp,
  getPassword,
  BUSINESS_SHORT_CODE
};