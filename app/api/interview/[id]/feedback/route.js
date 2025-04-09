// import Feedback from "@/models/Feedback";
// import { ConnectToDB } from "@/utils/database";
// import { google } from "@ai-sdk/google";
// import { generateText } from "ai";

// export async function POST(req, { params }) {
//     const { id } = await params;

//     const { userId, transcript } = await req.json()

//     try {
//         await ConnectToDB()

//         const response = await generateText({
//             model: google("gemini-2.0-flash-001"),
//             prompt: `You are an professional interviewer and taking a professional interview for a company. Your task is to the evaluate the performance of the interviewee on the basis of his ansser of the answer in the transcript.
//             Provide the response strictly in the following json format:
//                \`\`\`json
//             {
//                 "total_score" : 85,
//                 "communication_skills" : 70,
//                 "technical_knowledge" : 77,
//                 "problem_solving" : 89,
//                 "cultural_role_fit" : 92,
//                 "confidence_clarity" : 65,
//                 "strength" : "What are the major strength of the interviewee and give it in 5 to 10 points",
//                 "areasforimprovement" : "What are the areas where the interviewee can improve so he perform better in the interviewee . Provide it in points",
//                 "finalassessment" : "What is your final thougths on the interviewee is he good, bad or average and give it in 10 points"
//             }
//         \`\`\`
//         Transcript : ${transcript}
//         `
//         })

//         console.log(response)

//         const aiFeedback = response

//         const newFeedback = new Feedback({
//             userId,
//             interviewId: id,
//             total_score: Number(aiFeedback.total_score),
//             category_score: {
//                 communication_skills: Number(aiFeedback.communication_skills),
//                 technical_knowledge: Number(aiFeedback.technical_knowledge),
//                 problem_solving: Number(aiFeedback.problem_solving),
//                 cultural_role_fit: Number(aiFeedback.cultural_role_fit),
//                 confidence_clarity: Number(aiFeedback.confidence_clarity)
//             },
//             strength: aiFeedback.strength,
//             areasforimprovement: aiFeedback.areasforimprovement,
//             finalassessment: aiFeedback.finalassessment,
//         })

//         await newFeedback.save()

//         return Response.json({ message: "Feedback generated succesfully" })
//     } catch (err) {
//         console.log(err)
//         return Response.json({ message: "Error in genrating feedback" })
//     }
// }


import Feedback from "@/models/Feedback";
import { ConnectToDB } from "@/utils/database";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req, { params }) {
    const { id } = params;
    const { userId, transcript } = await req.json();

    try {
        await ConnectToDB();

        const response = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `You are a professional interviewer evaluating an interviewee's performance based on the given transcript.

            Return your response strictly in this JSON format:
            \`\`\`json
            {
              "total_score": 85,
              "communication_skills": 70,
              "technical_knowledge": 77,
              "problem_solving": 89,
              "cultural_role_fit": 92,
              "confidence_clarity": 65,
              "strength": ["Strength point 1", "Strength point 2", "Strength point 3", "Strength point 4", "Strength point 5"],
              "areas_for_improvement": ["Improvement 1", "Improvement 2", "Improvement 3", "Improvement 4", "Improvement 5", "Improvement 6", "Improvement 7", "Improvement 8"],
              "final_assessment": ["Assessment 1", "Assessment 2", "Assessment 3", "Assessment 4", "Assessment 5", "Assessment 6", "Assessment 7", "Assessment 8", "Assessment 9", "Assessment 10"]
            }
            \`\`\`
            
            Transcript:
            ${transcript}`

        });

        console.log("Raw AI Response:", response);

        // Extract JSON from triple backticks
        const jsonMatch = response.text.match(/```json\n([\s\S]*?)\n```/);
        if (!jsonMatch) {
            throw new Error("Invalid AI response format");
        }

        const aiFeedback = JSON.parse(jsonMatch[1]); // Parse JSON safely

        // // Validate extracted data before saving
        // const totalScore = Number(aiFeedback.total_score) || 0;
        // const communicationSkills = Number(aiFeedback.communication_skills) || 0;
        // const technicalKnowledge = Number(aiFeedback.technical_knowledge) || 0;
        // const problemSolving = Number(aiFeedback.problem_solving) || 0;
        // const culturalRoleFit = Number(aiFeedback.cultural_role_fit) || 0;
        // const confidenceClarity = Number(aiFeedback.confidence_clarity) || 0;

        const newFeedback = new Feedback({
            userId,
            interviewId: id,
            total_score: Number(aiFeedback.total_score) || 0,
            category_score: {
                communication_skills: Number(aiFeedback.communication_skills) || 0,
                technical_knowledge: Number(aiFeedback.technical_knowledge) || 0,
                problem_solving: Number(aiFeedback.problem_solving) || 0,
                cultural_role_fit: Number(aiFeedback.cultural_role_fit) || 0,
                confidence_clarity: Number(aiFeedback.confidence_clarity) || 0
            },
            strength: Array.isArray(aiFeedback.strength) ? aiFeedback.strength : [],
            areasforimprovement: Array.isArray(aiFeedback.areas_for_improvement) ? aiFeedback.areas_for_improvement : [],
            finalassessment: Array.isArray(aiFeedback.final_assessment) ? aiFeedback.final_assessment : []
        });


        await newFeedback.save();
        return Response.json({ message: "Feedback generated successfully" });
    } catch (err) {
        console.error("Error:", err);
        return Response.json({ message: "Error generating feedback", error: err.message }, { status: 500 });
    }
}
