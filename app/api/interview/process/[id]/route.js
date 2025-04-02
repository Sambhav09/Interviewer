import Interview from "@/models/Interview";
import { ConnectToDB } from "@/utils/database";

export async function GET(req, { params }) {
    await ConnectToDB()
    const { id } = await params;
    try {
        const data = await Interview.findById(id)
        if (!data) return new Response(JSON.stringify({ message: "No interview found" }), { status: 404 })
        return new Response(JSON.stringify(data), { status: 200 })
    } catch (err) {
        console.log(err)
        return new Response(JSON.stringify({ message: "error" }), { status: 500 })
    }
}