import Feedback from "@/models/Feedback";
import { ConnectToDB } from "@/utils/database";
import Interview from "@/models/Interview";

export async function GET(req, { params }) {
    const { id } = params;
    console.log("id in bakcend for peed route is", id)
    try {
        await ConnectToDB();
        const res = await Feedback.findOne({ interviewId: id }).populate("interviewId").lean();
        return new Response(JSON.stringify(res), { status: 200 });
    } catch (err) {
        console.log(err)
        return new Response(JSON.stringify({ message: "error" }), { status: 500 })
    }
}