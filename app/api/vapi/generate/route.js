import Interview from "@/models/Interview"
import { ConnectToDB } from "@/utils/database"
import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function GET() {
    return Response.json({ success: true, data: "tank you" }, { status: 200 })
}

export async function POST(req) {
    const { type, role, level, techstack, amount, userid } = await req.json()
    try {
        await ConnectToDB();

        const { text } = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
        })
        console.log(text)
        const question = JSON.parse(text)
        console.log(question)
        const newInterview = new Interview({
            role,
            type,
            level,
            amount,
            techstack: techstack.split(','),
            question,
            userId: userid,
        })

        await newInterview.save()

        return NextResponse.json({ success: true })

    } catch (err) {
        console.log(err)
        return NextResponse.json(err)
    }
}
