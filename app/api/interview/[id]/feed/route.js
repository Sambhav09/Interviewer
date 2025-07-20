import Feedback from "@/models/Feedback";
import Interview from "@/models/Interview";
import { ConnectToDB } from "@/utils/database";

export async function GET(req, { params }) {
    const { id } = await params;

    try {
        await ConnectToDB();

        const feedback = await Feedback.findOne({ interviewId: id }).populate("interviewId").lean();

        if (!feedback) {
            return new Response(JSON.stringify({ message: "No feedback found" }), { status: 404 });
        }

        await Interview.findByIdAndUpdate(id, { $set: { completed: true } });
        delete feedback.__v;

        return new Response(JSON.stringify(feedback), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "error" }), { status: 500 });
    }
}
