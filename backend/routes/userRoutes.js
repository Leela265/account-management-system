import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import supabase from "../config/supabaseClient.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id,name,email");

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;