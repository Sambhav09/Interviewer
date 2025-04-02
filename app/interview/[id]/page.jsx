"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { vapi } from '@/lib/vapi.sdk'
import Image from 'next/image'
import { useRouter } from 'next/router'

const page = () => {
    const router = useRouter()
    const { id } = useParams()
    const [interview, setinterview] = useState([])
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
            speed: 1.4,
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
                setmesage((prev) => [...prev, message])
                setlastMessage(message.transcript)
                if (message.transcript.includes("thank you for your time") || message.transcript.includes("that concludes our interview")) {
                    handleCallEnd();

                }
            }
            console.log(message)
        }

        vapi.on("call-start", onCallStart)
        vapi.on("call-end", onCallEnd)
        vapi.on("speech-start", onSpeechStart)
        vapi.on("speech-end", onSpeechEnd)
        vapi.on("message", onmessage)
    }, [mesage, callStatus])


    console.log("id in interview page", id)
    useEffect(() => {
        if (!id) {
            return
        }
        const fetchData = async () => {
            const res = await fetch(`/api/interview/process/${id}`)
            const data = await res.json()
            setinterview(data)
            console.log(data)
        }
        fetchData()

    }, [id])
    const handleCall = async () => {
        setcallStatus("connecting")
        await vapi.start(interviewer, {
            variableValues: {
                questions: interview.question
            }
        })
    }

    const handleRepeat = async () => {
        window.location.reload()
    }

    const handleCallEnd = async () => {
        await vapi.stop()
        setcallStatus("generating")
        const res = await fetch(`/api/interview/${id}/feedback`, {
            method: "POST",
            body: JSON.stringify({
                feedback: mesage
            }),
        })
    }

    return (
        <div className='bg-black h-screen'>
            <div className='flex p-10 justify-between pt-24'>
                <div className='bg-red-50 h-70 w-full sm:w-6/12 md:w-5/12 flex rounded-4xl justify-center items-center '>
                    <div className={`rounded-full h-44 w-44 bg-blue-400 flex justify-center items-center transition-all duration-300 ease-in-out ${isspeaking ? "animate-pulse" : ""}`}>
                        <Image src={"/logo.svg"} alt='logo' height={70} width={70} />
                    </div>

                </div>
                <div className='hidden bg-red-50 h-70 w-5/12  md:flex justify-center items-center rounded-4xl'>
                    hello
                </div>
            </div>
            <div className='flex w-full justify-center items-center pt-14'>
                <p className='rounded-full flex justify-center p-3 text-xl  items-center text-center bg-blue-200 w-11/12'>{lastMessage}</p>
            </div>
            <div className='mt-20 w-full gap-10 flex justify-center items-center'>
                {callStatus === "inactive" ? (<button className='p-3 px-10 bg-blue-100 rounded-full' onClick={handleRepeat}>repeat</button>) : ("")}
                {callStatus === "active" && (<button className='p-3 px-10 rounded-full bg-red-400 animate-pulse' onClick={handleCallEnd}>End</button>)}
                {callStatus === "connecting" && (<button disabled className='p-3 px-10 rounded-full bg-green-400 animate-pulse'>Connecting...</button>)}
                {callStatus === "inactive" && (<button className='p-3 border-s-black active:border px-10 rounded-full bg-green-400' onClick={handleCall} >Call</button>)}
                {callStatus === "generating" && (<button disabled className='p-3 px-10 rounded-full bg-green-400 animate-pulse'>Generating...</button>)}
            </div>
        </div>
    );
}

export default page
