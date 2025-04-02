import Interview from "@/models/Interview"
import { ConnectToDB } from "@/utils/database"

export async function GET(req, { params }) {
    const { id } = await params;
    try {

        console.log("id in baclkend for interview", id)
        await ConnectToDB()
        const interview = await Interview.find({ userId: id }).sort({ createdAt: -1 })
        console.log("interview", interview)
        if (!interview) return new Response(JSON.stringify({ message: "No interview found" }), { status: 404 })
        return new Response(JSON.stringify(interview), { status: 200 })
    } catch (err) {
        console.log(err)
        return new Response(JSON.stringify({ message: "error" }), { status: 500 })
    }
}

