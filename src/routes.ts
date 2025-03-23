import { Router } from "express";
import { transferTokens } from "./transfer";

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

export default router;
