import Interview from "@/models/Interview"
import { ConnectToDB } from "@/utils/database"

export async function GET(req) {
    try {
        await ConnectToDB()
        const interview = await Interview.find().sort({ createdAt: -1 })
        if (!interview) return new Response(JSON.stringify({ message: "No interview found" }), { status: 404 })
        return new Response(JSON.stringify(interview), { status: 200 })
    } catch (err) {
        console.log(err)
        return new Response(JSON.stringify({ message: "error" }), { status: 500 })
    }
}

