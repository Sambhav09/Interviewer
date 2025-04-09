"use client"


import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { vapi } from '@/lib/vapi.sdk'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'


const page = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const { id } = useParams()
    const [interview, setinterview] = useState({})
    const [callStatus, setcallStatus] = useState("inactive")
    const [isspeaking, setisspeaking] = useState(false)
    const [mesage, setmesage] = useState([])
    const [lastMessage, setlastMessage] = useState("hello user")

    const interviewer = {
        name: "Interviewer",
        firstMessage:
            "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience. Are you ready for the interview?",
        transcriber: {
            provider: "deepgram",
            model: "nova-2",
            language: "en",
        },
        voice: {
            provider: "11labs",
            voiceId: "sarah",
            stability: 0.4,
            similarityBoost: 0.8,
            speed: 0.9,
            style: 0.5,
            useSpeakerBoost: true,
        },
        model: {
            provider: "openai",
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

                    Interview Guidelines:
Follow the structured question flow:
{{questions}}

Engage naturally & react appropriately:
Listen actively to responses and acknowledge them before moving forward.
Ask brief follow-up questions if a response is vague or requires more detail.
Keep the conversation flowing smoothly while maintaining control.
Be professional, yet warm and welcoming:

Use official yet friendly language.
Keep responses concise and to the point (like in a real voice interview).
Avoid robotic phrasing—sound natural and conversational.
Answer the candidate’s questions professionally:

If asked about the role, company, or expectations, provide a clear and relevant answer.
If unsure, redirect the candidate to HR for more details.

Conclude the interview properly:
Thank the candidate for their time.
Inform them that the company will reach out soon with feedback.
End the conversation on a polite and positive note.

- Be sure to be professional and polite.
- Keep all your responses short and simple. Use official language, but be kind and welcoming.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`,
                },
            ],
        },
    };

    useEffect(() => {
        const onCallStart = () => { setcallStatus("active") }
        const onCallEnd = () => { setcallStatus("inactive") }
        const onSpeechStart = () => { setisspeaking(true) }
        const onSpeechEnd = () => { setisspeaking(false) }
        const onmessage = (message) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                setmesage((prev) => [...prev, message]);
                setlastMessage(message.transcript);
                console.log("New message received:", message.transcript);
            }
            console.log("Current messages:", mesage);
        };

        vapi.on("call-start", onCallStart)
        vapi.on("call-end", onCallEnd)
        vapi.on("speech-start", onSpeechStart)
        vapi.on("speech-end", onSpeechEnd)
        vapi.on("message", onmessage)

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("message", onmessage);
        };

    }, [])


    console.log("id in interview page", id)

    const fetchData = async () => {
        const res = await fetch(`/api/interview/process/${id}`)
        const data = await res.json()
        setinterview(data)

        console.log(data)
    }

    useEffect(() => {
        if (!id) {
            return
        }

        fetchData()

    }, [id])

    const handleCall = async () => {
        setcallStatus("connecting");
        await fetchData();

        try {
            const response = await vapi.start(interviewer, {
                variableValues: {
                    questions: interview.question || "What is your experience?"
                }
            });

            console.log("Vapi Call Response:", response);
            if (!response) {
                throw new Error("Vapi call returned null. Possible API issue.");
            }
        } catch (err) {
            console.error("Error starting Vapi:", err);
        }
    };


    const handleRepeat = async () => {
        window.location.reload()
    }

    const handleCallEnd = async () => {
        vapi.stop();


        setlastMessage("Generating feedback...")

        const res = await fetch(`/api/interview/${id}/feedback`, {
            method: "POST",
            body: JSON.stringify({
                userId: session?.user?.id,
                feedback: mesage,
            }),
        });

        if (res.ok) {
            setTimeout(() => {
                router.push(`/interview/${id}/feedback`);
            }, 1000);
        }
    };


    return (
        <div className="bg-black min-h-screen flex flex-col items-center justify-start p-4">
            {/* Top Section with Logo and Hello */}
            <div className="w-full flex flex-col md:flex-row gap-4 pt-24 max-w-7xl">
                <div className="bg-red-50 w-full md:w-1/2 rounded-4xl flex justify-center items-center py-10">
                    <div
                        className={`rounded-full h-44 w-44 bg-blue-400 flex justify-center items-center transition-all duration-300 ease-in-out ${isspeaking ? "animate-pulse" : ""
                            }`}
                    >
                        <Image src="/logo.svg" alt="logo" height={70} width={70} />
                    </div>
                </div>

                <div className="hidden md:flex bg-red-50 w-1/2 justify-center items-center rounded-4xl py-10">
                    <p className="text-xl text-black">hello</p>
                </div>
            </div>

            {/* Last Message Section */}
            <div className="w-full max-w-4xl mt-10 px-2">
                <p className="rounded-xl p-4 text-xl text-black dark:text-black text-center bg-blue-200 w-full break-words min-h-[60px] shadow">
                    {lastMessage}
                </p>
            </div>

            {/* Buttons Section */}
            <div className="mt-16 w-full flex flex-wrap gap-4 justify-center items-center">
                {callStatus === "inactive" && (
                    <>
                        <button className="p-3 px-10 bg-blue-100 rounded-full" onClick={handleRepeat}>
                            Repeat
                        </button>
                        <button className="p-3 px-10 rounded-full bg-green-400" onClick={handleCall}>
                            Call
                        </button>
                    </>
                )}

                {callStatus === "connecting" && (
                    <button disabled className="p-3 px-10 rounded-full bg-green-400 animate-pulse">
                        Connecting...
                    </button>
                )}

                {callStatus === "active" && (
                    <button className="p-3 px-10 rounded-full bg-red-400 animate-pulse" onClick={handleCallEnd}>
                        End
                    </button>
                )}
            </div>
        </div>
    );

}

export default page
