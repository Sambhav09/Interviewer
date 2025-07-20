import mongoose from "mongoose";

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
    questions: {
        type: Array,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    strength: {
        type: Array,
        required: true
    },
    area_of_improvement: {
        type: Array,
        required: true
    },
    tips: {
        type: Array,
        required: true
    },
    total_score: {
        type: Number,
        required: true
    },
    communication_score: {
        type: Number,
        required: true
    },
    technical_score: {
        type: Number,
        required: true
    },
    practice_question: {
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