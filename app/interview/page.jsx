

'use client'
import { vapi } from '@/lib/vapi.sdk'
import { useSession } from 'next-auth/react'
import React, { useState, useRef, useEffect } from 'react'



const TryInterviewPage = () => {

    const { data: session } = useSession()

    const [status, setStatus] = useState('idle')
    const [messages, setMessages] = useState([])
    const [connecting, setConnecting] = useState(false)
    const messagesEndRef = useRef(null)

    const interviewer = {
        name: "AI Interview Coach",
        firstMessage: "Hello! I'm your personal AI interview coach. I'm here to help you ace your technical interview.",
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
                    content: `You are a professional AI interviewer designed to conduct structured speech interviews. Your goal is to ask the interviewee a series of questions one at a time, ensuring clarity and focus on each response before moving to the next question. 

1. Let me ask you some basic question to generate a specialize interview according to your need.
2. Ask the interviewee about their desired role for training. Provide options: "What role would you like to train for? (Frontend, Backend, Fullstack)"
3. After receiving their answer, inquire about the type of interview format they prefer. Ask: "What type of interview would you like to conduct? (Behavioral, Mixed)"
4. Once they respond, ask about the technologies they want to include in the interview. Frame the question as: "What technologies would you like to focus on during this interview?"
5. Following their answer, ask about the desired proficiency level for the interview questions: "What level of questions are you interested in? (Beginner, Intermediate, Senior)"
6. Finally, conclude by determining the number of questions they wish to prepare for: "How many questions would you like to prepare for this interview?"
7. After they have answered all questions, thank them for their input and inform them: "Thank you for generating the interview. Your interview will be generated after a short time."

Ensure that after each question, you pause for their response before proceeding to the next question, maintaining a professional and engaging tone throughout the interaction. Remember, you are not conducting the interview yourself; all details will be sent back to the AI for question generation. You are trained on data up to October 2023.
`,
                },
            ],
        },
    };

    useEffect(() => {
        const onCallStart = () => {
            setStatus("active")
        }
        const onCallEnd = () => setStatus("idle")


        const onMessage = (message) => {
            if (message.type === "transcript" && message.transcriptType === "final") {


                setMessages(prev => [...prev, message])
            }
        }

        vapi.on("call-start", onCallStart)
        vapi.on("call-end", onCallEnd)

        vapi.on("message", onMessage)

        return () => {
            vapi.off("call-start", onCallStart)
            vapi.off("call-end", onCallEnd)

            vapi.off("message", onMessage)
        }
    }, [])


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleStart = async () => {
        setConnecting(true)
        setStatus('idle')
        try {
            const response = await vapi.start(interviewer);
            setConnecting(false)
            setStatus('active')
        } catch (err) {
            setConnecting(false)
            setStatus('idle')
            console.error('Failed to start interview:', err);
        }
    }
    const handleStop = async () => {
        vapi.stop()
        setStatus('idle')
        console.log("message is sending to backend")
        const prompt = messages.map(m => m.transcript)
        const transcripts = prompt.join('/n')
        const id = session?.user?.id
        try {
            const response = await fetch('/api/vapi/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: id, transcripts }),
            });
            const data = await response.json()
        } catch (err) {
            console.log("error in gemini request", err)
        }

    }

    return (
        <>
            <style jsx>{`
                /* Hide scrollbar but keep scrolling functionality */
                .scrollbar-hide {
                    -ms-overflow-style: none;  /* Internet Explorer 10+ */
                    scrollbar-width: none;  /* Firefox */
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;  /* Safari and Chrome */
                }
            `}</style>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center py-10 px-2">
                {/* Top Heading */}
                <div className="text-center mb-10">
                    <div className="relative inline-block">
                        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4 tracking-tight">
                            Interviewer
                        </h1>
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 animate-pulse"></div>
                    </div>
                    <p className="text-slate-300 text-xl font-medium">✨ Speak naturally with your AI interviewer ✨</p>
                </div>
                <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
                    {/* Left: Session + Controls, glassmorphism card */}
                    <div className="flex flex-col md:w-1/3 w-full justify-center items-center md:min-h-[32rem]">
                        <div className="relative w-72">
                            {/* Glassmorphism Card */}
                            <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-purple-400/30 shadow-2xl p-8 flex flex-col items-center text-center relative overflow-hidden">
                                {/* Vertical Gradient Accent Bar */}
                                <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-purple-500 via-blue-500 to-pink-400 rounded-l-3xl opacity-70"></div>
                                {/* Icon */}
                                <div className="mb-4">
                                    <svg className="w-10 h-10 text-purple-300 drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                </div>
                                {/* Status Indicator */}
                                <div className="flex flex-col items-center mb-4">
                                    <span className={`w-5 h-5 rounded-full mb-2 ${status === 'active' ? 'bg-green-400 animate-pulse shadow-lg' : connecting ? 'bg-yellow-400 animate-pulse shadow-lg' : 'bg-gray-400'}`}></span>
                                    <span className="text-2xl font-extrabold text-white tracking-wide mb-1">Session</span>
                                    <span className={`text-lg font-semibold ${status === 'active' ? 'text-green-300' : connecting ? 'text-yellow-300' : 'text-gray-300'}`}>{connecting ? 'Connecting...' : status === 'active' ? 'In Progress' : 'Ready'}</span>
                                </div>
                                {/* Button */}
                                {status === 'idle' && !connecting && (
                                    <button
                                        onClick={handleStart}
                                        className="mt-6 w-full py-3 px-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold shadow-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 ring-offset-2 hover:shadow-purple-500/30 hover:scale-105"
                                    >
                                        Start
                                    </button>
                                )}
                                {connecting && (
                                    <div className="mt-6 w-full flex flex-col items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin mb-2"></div>
                                        <span className="text-yellow-200 text-sm font-semibold">Connecting to Interviewer...</span>
                                    </div>
                                )}
                                {status === 'active' && !connecting && (
                                    <button
                                        onClick={handleStop}
                                        className="mt-6 w-full py-3 px-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-lg font-bold shadow-xl hover:from-red-400 hover:to-pink-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400/50 ring-offset-2 hover:shadow-pink-500/30 hover:scale-105"
                                    >
                                        Stop
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Chat Area */}
                    <div className="rounded-xl bg-white/10 border border-white/20 p-5 shadow-lg flex flex-col flex-1 min-h-[32rem] md:w-2/3 w-full overflow-x-hidden">
                        <div className="flex-1 space-y-4 overflow-y-auto max-h-[28rem] py-2 px-1 w-full scrollbar-hide">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                                    {msg.role != 'user' ? (
                                        <div className="relative w-full flex group">
                                            <div className="px-3 py-2 rounded-xl bg-white/30 backdrop-blur-lg border border-purple-300/40 shadow-md text-white text-sm font-medium transition-all duration-300 ease-out max-w-[55%] md:max-w-[40%] break-words whitespace-pre-line overflow-x-hidden w-full hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-400/30 hover:bg-white/40 hover:border-purple-400/60 hover:scale-[1.02] active:-translate-y-2 active:shadow-2xl active:shadow-purple-400/30 active:bg-white/40 active:border-purple-400/60 active:scale-[1.02] focus:-translate-y-2 focus:shadow-2xl focus:shadow-purple-400/30 focus:bg-white/40 focus:border-purple-400/60 focus:scale-[1.02] cursor-pointer touch-manipulation select-none">
                                                <span className="block text-xs opacity-70 mb-1">AI</span>
                                                <span>{msg.transcript}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative w-full flex justify-end group">
                                            <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-blue-500 text-white text-lg font-semibold shadow-md transition-all duration-300 ease-out max-w-[55%] md:max-w-[40%] break-words whitespace-pre-line overflow-x-hidden w-full hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-400/30 hover:from-fuchsia-400 hover:via-purple-500 hover:to-blue-400 hover:scale-[1.02] active:-translate-y-2 active:shadow-2xl active:shadow-blue-400/30 active:from-fuchsia-400 active:via-purple-500 active:to-blue-400 active:scale-[1.02] focus:-translate-y-2 focus:shadow-2xl focus:shadow-blue-400/30 focus:from-fuchsia-400 focus:via-purple-500 focus:to-blue-400 focus:scale-[1.02] cursor-pointer touch-manipulation select-none">
                                                <span className="block text-xs opacity-70 mb-1 text-right">You</span>
                                                <span>{msg.transcript}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TryInterviewPage
