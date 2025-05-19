"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { vapi } from '@/lib/vapi.sdk';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [callStatus, setcallStatus] = useState("inactive");
    const [isspeaking, setisspeaking] = useState(false);
    const [mesage, setmesage] = useState([]);
    const [lastMessage, setlastMessage] = useState("hello user");

    useEffect(() => {
        const onCallStart = () => setcallStatus("active");
        const onCallEnd = () => setcallStatus("inactive");
        const onSpeechStart = () => setisspeaking(true);
        const onSpeechEnd = () => setisspeaking(false);
        const onmessage = (message) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                setmesage((prev) => [...prev, message]);
                setlastMessage(message.transcript);
            }
            console.log(message);
        };

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("message", onmessage);
    }, [mesage, callStatus]);

    const handleCall = async () => {
        setcallStatus("connecting");
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID, {
            variableValues: {
                username: session?.user?.username,
                userid: session?.user?.id,
            },
        });
    };

    const handleRepeat = () => {
        window.location.reload();
    };

    const handleCallEnd = async () => {
        await vapi.stop();
        setcallStatus("inactive");
        setTimeout(() => {
            router.push("/");
        }, 2000);
    };

    return (
        <div className="bg-black min-h-screen flex flex-col items-center justify-start p-4">
            <div className="flex flex-col md:flex-row gap-4 w-full pt-24 max-w-7xl">
                {/* Left Circle with Logo */}
                <div className="bg-red-50 w-full md:w-5/12 rounded-4xl flex justify-center items-center py-10">
                    <div
                        className={`rounded-full h-44 w-44 bg-blue-400 flex justify-center items-center transition-all duration-300 ease-in-out ${isspeaking ? "animate-pulse" : ""
                            }`}
                    >
                        <Image src={"/logo.svg"} alt="logo" height={70} width={70} />
                    </div>
                </div>

                {/* Right Circle with User Initial */}
                <div className="hidden md:flex bg-red-50 w-5/12 justify-center items-center rounded-4xl py-10">
                    <div
                        className={`rounded-full h-44 w-44 bg-green-500 flex justify-center items-center text-white text-6xl font-bold transition-all duration-300 ease-in-out ${isspeaking ? "animate-pulse" : ""
                            }`}
                    >
                        {session?.user?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                </div>
            </div>

            {/* Last Message Display */}
            <div className="w-full max-w-3xl mt-10 px-4">
                <p className="rounded-xl p-4 text-xl text-black dark:text-black text-center bg-blue-200 w-full break-words min-h-[60px] shadow">
                    {lastMessage}
                </p>
            </div>

            {/* Buttons */}
            <div className="mt-20 w-full flex flex-wrap gap-6 justify-center items-center">
                {callStatus === "inactive" && (
                    <>
                        <button className="p-3 px-10 bg-blue-100 text-black rounded-full" onClick={handleRepeat}>
                            Repeat
                        </button>
                        <button className="p-3 px-10 bg-green-400 rounded-full" onClick={handleCall}>
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
};

export default Page;
