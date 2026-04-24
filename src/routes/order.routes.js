import { Router } from "express";
import { createOrder } from "../controller/order.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, createOrder);

export default router;
