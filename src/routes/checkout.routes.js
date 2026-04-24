import { Router } from "express";
import { createCheckoutSession } from "../controller/checkout.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, createCheckoutSession);

export default router;
