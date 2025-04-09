import mongoose from "mongoose";
import { array, intersection } from "zod";

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    interviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview",
        required: true
    },
    total_score: {
        type: Number,
        required: true
    },
    category_score: {
        communication_skills: { type: Number, required: true },
        technical_knowledge: { type: Number, required: true },
        problem_solving: { type: Number, required: true },
        cultural_role_fit: { type: Number, required: true },
        confidence_clarity: { type: Number, required: true },
    },
    strength: {
        type: Array,
        required: true
    },
    areasforimprovement: {
        type: Array,
        required: true
    },
    finalassessment: {
        type: Array,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema)
export default Feedback;