import { z } from "zod";

export const applyJobSchema = z.object({
    jobId: z.string().min(1, "Job id is required"),
});
