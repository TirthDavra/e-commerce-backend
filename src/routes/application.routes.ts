import { Router } from "express";
import {
    applyToJob,
    getMyAppliedJobIds,
} from "../controller/application.controller";
import { validate } from "../common/middleware/validate";
import { applyJobSchema } from "../validations/application.validation";
import { protect } from "../common/middleware/auth.middleware";
import { authorize } from "../common/middleware/authorize";

const router = Router();

router.get(
    "/me",
    protect,
    authorize(["candidate"]),
    getMyAppliedJobIds
);

router.post(
    "/",
    protect,
    authorize(["candidate"]),
    validate(applyJobSchema),
    applyToJob
);

export default router;
