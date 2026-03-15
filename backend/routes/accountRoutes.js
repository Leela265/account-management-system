import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getBalance, transferMoney, getStatement } from "../controllers/accountController.js";

const router = express.Router();

router.get("/balance", authMiddleware, getBalance);
router.post("/transfer", authMiddleware, transferMoney);
router.get("/statement", authMiddleware, getStatement);

export default router;