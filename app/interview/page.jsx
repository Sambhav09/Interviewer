"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { vapi } from '@/lib/vapi.sdk';
import { useSession } from 'next-auth/react';


const Page = () => {
    const { data: session } = useSession()
    const [callStatus, setcallStatus] = useState("inactive")
    const [isspeaking, setisspeaking] = useState(false)
    const [mesage, setmesage] = useState([])
    const [lastMessage, setlastMessage] = useState("hello user")
    console.log(session)



    useEffect(() => {
        const onCallStart = () => { setcallStatus("active") }
        const onCallEnd = () => { setcallStatus("inactive") }
        const onSpeechStart = () => { setisspeaking(true) }
        const onSpeechEnd = () => { setisspeaking(false) }
        const onmessage = (message) => {
            if (mesage.type === "transcript" && message.transcriptType === "final") {
                setmesage((prev) => [...prev, message])
                setlastMessage(message)
            }
            console.log(message)
        }

        vapi.on("call-start", onCallStart)
        vapi.on("call-end", onCallEnd)
        vapi.on("speech-start", onSpeechStart)
        vapi.on("speech-end", onSpeechEnd)
        vapi.on("message", onmessage)
    }, [mesage, callStatus])


    const handleCall = async () => {
        setcallStatus("connecting")
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID, {
            variableValues: {
                username: session?.user?.username,
                userid: session?.user?.id,
            },
        })
    }

    const handleRepeat = async () => {
        window.location.reload()
    }

    const handleCallEnd = async () => {
        await vapi.stop()
        setcallStatus("inactive")
    }


    return (
        <div className='bg-black h-screen'>
            <div className='flex p-10 justify-between pt-24'>
                <div className='bg-red-50 h-70 w-full sm:w-6/12 md:w-5/12 flex rounded-4xl justify-center items-center '>
                    <div className={`rounded-full h-20 w-20 bg-blue-300 flex justify-center items-center transition-all duration-300 ease-in-out ${isspeaking ? "animate-pulse" : ""}`}>
                        <Image src={"/logo.svg"} alt='logo' height={30} width={30} />

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

            </div>
        </div>
    );
}

export default Page;
