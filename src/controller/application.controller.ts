import type { Response } from "express";
import mongoose from "mongoose";
import type { AuthRequest } from "../common/middleware/auth.middleware";
import Job from "../model/job.model";
import Application from "../model/application.model";
import type { z } from "zod";
import type { applyJobSchema } from "../validations/application.validation";

type ApplyBody = z.infer<typeof applyJobSchema>;

export const applyToJob = async (req: AuthRequest, res: Response) => {
    try {
        const { jobId } = req.body as ApplyBody;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: "Invalid job id" });
        }

        const job = await Job.findById(jobId).lean();
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        if (!job.isOpen) {
            return res
                .status(400)
                .json({ message: "This job is no longer open" });
        }

        try {
            await Application.create({
                candidateId: req.user!.id,
                jobId,
            });
        } catch (err: unknown) {
            const code =
                err && typeof err === "object" && "code" in err
                    ? (err as { code: number }).code
                    : null;
            if (code === 11000) {
                return res
                    .status(400)
                    .json({ message: "You already applied to this job" });
            }
            throw err;
        }

        return res.status(201).json({ message: "Application submitted" });
    } catch {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getMyAppliedJobIds = async (req: AuthRequest, res: Response) => {
    try {
        const rows = await Application.find({ candidateId: req.user!.id })
            .select("jobId")
            .lean();

        const jobIds = rows.map((r) => String(r.jobId));

        return res.status(200).json({ jobIds });
    } catch {
        return res.status(500).json({ message: "Internal server error" });
    }
};
