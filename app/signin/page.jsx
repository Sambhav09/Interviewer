'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setError(res.error);
        } else {
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100 px-4">
            <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200">
                <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800 tracking-tight">Sign In</h1>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-200 p-2 rounded-lg shadow-sm animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition-all shadow-sm"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition-all shadow-sm"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all text-lg tracking-wide"
                    >
                        Sign In
                    </button>
                </form>
                <p className='flex justify-center items-center pt-7 text-gray-500 text-sm'>
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className='text-blue-600 hover:underline font-semibold ml-1'>Sign up</Link>
                </p>
            </div>
        </div>
    );
}
