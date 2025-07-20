import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    numberOfQuestions: {
        type: Number,
        required: true
    },
    techstack: {
        type: [String],
        required: true
    },
    questions: {
        type: [String],
        required: true,
    },

    completed: {
        type: Boolean,
        default: false,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Interview = mongoose.models.Interview || mongoose.model("Interview", InterviewSchema);

export default Interview;

