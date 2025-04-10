import React from 'react'
import Image from 'next/image'
import { signOut } from 'next-auth/react'

const Navbar = () => {
    return (
        <div className='p-7 flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-500'>
            <div className='flex justify-center items-center gap-4'>
                <Image src="/logo.svg" width={50} height={50} alt='logo' />
                <h1 className='text-3xl font-bold text-gray-950'>Interviewer</h1>
            </div>
            <button onClick={signOut} className='p-3 border bg-gray-800 rounded-full hover:scale-105 active:bg-gray-500'>Sign Out</button>
        </div>
    )
}

export default Navbar
