export async function POST(req, { params }) {
    const { id } = await params;
    console.log("id in backend for feedbakc is", id)
    return new Response(JSON.stringify({ message: "feedback" }), { status: 200 })
}