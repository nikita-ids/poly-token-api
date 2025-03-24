import { response, Router } from "express";
import { transferTokens } from "./transfer";
import  {redeemTokens} from "./redeem";
import { Request, Response } from "express";
import { request } from "http";

const router = Router();

router.post("/transfer", async (req, res) => {
  try {
    console.log("Processing token transfers...");
    const transferResults = await transferTokens(); // Call function properly
    res.json({ success: true, transfers: transferResults });
  } catch (error) {
    console.error("Transfer error:", error);
    res.status(500).json({ success: false, error: error || "Token transfer failed." });
  }
});

router.post("/redeem", async (req, res) => {
  try {
    console.log("REQUEST BODY:", req.body);

    // ✅ Ensure request body contains required fields
    const { request, signature } = req.body;
    if (!request || !signature) {
      res.status(400).json({ success: false, error: "Missing request or signature." });
    }

    const { from, to, value, gas, nonce, data } = request; // Extract functionSignature (encoded call)
    if (!from || !data) {
      res.status(400).json({ success: false, error: "Invalid request format." });
    }

    // ✅ Call redeemTokens function
    const result = await redeemTokens(from, to, value, gas, nonce, data, signature);

    // ✅ Validate function execution result
    if (result?.success) {
      res.json({ success: true, txHash: result.txHash });
    } else {
      res.status(500).json({ success: false, error: result?.error || "Transaction failed." });
    }
  } catch (error) {
    console.error("❌ Redemption error:", error);
    res.status(500).json({ success: false, error: error || "Redemption failed." });
  }
});





export default router;
