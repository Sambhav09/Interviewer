"use client"

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const Generated = () => {
    const { data: session } = useSession()

    const [interview, setinterview] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/interview/${session?.user?.id}`)
            const data = await res.json()
            setinterview(data)

            console.log(data)
        }
        fetchData()
    }, [])

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-black gap-4 p-10'>
            {interview.map((item) => (
                <div key={item._id} className='bg-gray-800 p-1 relative rounded-lg shadow-lg h-60'>
                    <span className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-sm rounded">
                        {item.type}
                    </span>
                    <h1 className='text-2xl text-orange-400 p-3 pt-10'>{item.role} Developer Interview</h1>
                    <p className='text-cyan-400 px-5 py-2'>You haven't taken the interview yet. Take it to improve your skills</p>
                    <div className='flex justify-between'>
                        <p className='text-sm text-gray-400 p-5'>{item.techstack}</p>
                        <Link href={`/interview/${item._id}`}>
                            <button className='p-2 m-5 rounded-full bg-cyan-200'>Take the interview</button>
                        </Link>
                    </div>

                </div>
            ))}
        </div>
    )
}

export default Generated
