import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import Feedback from '@/models/Feedback';
import { ConnectToDB } from '@/utils/database';
import Interview from '@/models/Interview';

export async function POST(req, { params }) {
    const { id } = await params;
    const { userId, Questions, transcripts } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

    try {

        await ConnectToDB()
        console.log("transcript is", transcripts)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are an interview feedback generator. Below is a transcript of a mock interview chat between an interviewer and a candidate. Based on this chat, generate a structured feedback as a JSON array. The array should include the following keys:

- summary: a short paragraph summarizing the overall interview performance.
- strength: a list of key strengths the candidate demonstrated.
- area_of_improvement: a list of areas where the candidate can improve.
- tips: actionable tips to help the candidate improve.
- total_score: an integer score out of 10 representing overall performance.
- communication_score: an integer score out of 10 for the candidate's communication skills.
- technical_score: an integer score out of 10 for the candidate's technical skills.
- practice_questions: a list of 3–5 additional practice questions tailored to the candidate’s weak areas.

Here is the transcript:

"""
${transcripts}
"""

Return the output as a single JSON array with one object containing these keys.
`;

        const result = await model.generateContent(prompt);

        const text = result.response.candidates[0].content.parts[0].text;

        const cleanJsonString = text.replace(/```json\n?/, "").replace(/```/, "").trim();

        const data = JSON.parse(cleanJsonString);

        const feedback = data[0];

        await Interview.findByIdAndUpdate(id, { completed: true }, { new: true })

        const doc = new Feedback({
            userId,
            interviewId: id,
            questions: Questions.map(q => q.trim()).filter(Boolean),
            summary: feedback.summary,
            strength: feedback.strength,
            area_of_improvement: feedback.area_of_improvement,
            tips: feedback.tips,
            total_score: feedback.total_score,
            communication_score: feedback.communication_score,
            technical_score: feedback.technical_score,
            practice_question: feedback.practice_questions, // note plural
        });

        await doc.save()

        return NextResponse.json({ id, Questions, data });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 });
    }
}
