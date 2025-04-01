"use client"

import React, { useEffect } from 'react';
import Image from 'next/image';
import { vapi } from '@/lib/vapi.sdk';
import { useSession } from 'next-auth/react';


const Page = () => {
    const { data: session } = useSession()
    console.log(session)

    const handleCall = async () => {
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID, {
            variableValues: {
                username: sambhav,
                userid: 736336363636,
            },
        })
    }


    return (
        <div>
            <div className='flex p-20 justify-between'>
                <div className='bg-red-50 h-70 w-5/12 flex justify-center items-center'>
                    <div className='rounded-full h-20 w-20 bg-blue-300 flex justify-center items-center'>
                        <Image src={"/logo.svg"} alt='logo' height={40} width={40} />

                    </div>

                </div>
                <div className='bg-red-50 h-70 w-5/12 flex justify-center items-center'>
                    <button onClick={handleCall}>call</button>
                </div>
            </div>
        </div>
    );
}

export default Page;