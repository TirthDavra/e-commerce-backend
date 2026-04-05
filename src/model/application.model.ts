import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
    candidateId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
}

const ApplicationSchema = new Schema<IApplication>(
    {
        candidateId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        jobId: {
            type: Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
    },
    { timestamps: true }
);

ApplicationSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

export default mongoose.model<IApplication>("Application", ApplicationSchema);
