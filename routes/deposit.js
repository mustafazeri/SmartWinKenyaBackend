const express = require("express"); 
module.exports = () => {
  const router = express.Router(); 
  router.post("/", async (req, res) => {
    try { const { username, phone, amount 
      } = req.body;
      if (!username || !phone || !amount) 
      {
        return res.json({ success: false, 
          message: "Please fill in all 
          fields."
        });
      }
      res.json({ success: true, message: 
        `Deposit request received for KSh 
        ${amount}.`
      });
    } catch (err) {
      console.error(err); res.json({ 
        success: false, message: "Server 
        error."
      });
    }
  });
  return router;
};
