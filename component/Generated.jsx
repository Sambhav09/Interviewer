"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Generated = () => {
    const { data: session } = useSession();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!session?.user?.id) {
                setLoading(false);
                return;
            }
            setLoading(true);
            const res = await fetch(`/api/interview/${session.user.id}`);
            const data = await res.json();
            setInterviews(data);
            setLoading(false);
        };
        fetchData();
    }, [session]);

    const incomplete = interviews.filter((item) => item.completed === false);
    const completed = interviews.filter((item) => item.completed === true);

    return (
        <div className="p-6 md:p-10 text-white">
            {/* Loading State */}
            {loading && (
                <p className="text-center text-gray-400 mt-10">Loading...</p>
            )}
            {/* Incomplete Section */}
            {!loading && incomplete.length > 0 && (
                <>
                    <h2 className="text-3xl font-extrabold text-cyan-400 mb-6 tracking-tight flex items-center gap-2">
                        <span className="inline-block w-2 h-6 bg-cyan-400 rounded-full"></span>
                        Generated Interviews
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
                        {incomplete.map((item) => (
                            <div
                                key={item._id}
                                className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-3xl shadow-2xl border-2 border-cyan-400 hover:scale-105 transition-transform duration-300 group"
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">{item.type}</span>
                                    <span className="bg-gray-700 text-cyan-300 text-xs px-2 py-1 rounded-full">{item.level}</span>
                                </div>
                                <h1 className="text-2xl text-orange-300 font-bold mb-2 flex items-center gap-2">
                                    {item.role}
                                </h1>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {item.techstack.map((tech, idx) => (
                                        <span key={idx} className="bg-cyan-700 text-xs px-2 py-1 rounded-full text-white font-semibold">{tech}</span>
                                    ))}
                                </div>
                                <div className="mb-3 flex items-center gap-2">
                                    <span className="text-xs text-gray-400">Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                                    <span className="ml-auto bg-cyan-500/20 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full shadow">{item.numberOfQuestions} Questions</span>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-xs font-bold text-cyan-400 animate-pulse">Incomplete</span>
                                    <Link href={`/interview/${item._id}`}>
                                        <button className="px-4 py-2 rounded-full bg-cyan-400 hover:bg-cyan-500 text-sm font-bold shadow transition">Take Interview</button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Completed Section */}
            {!loading && completed.length > 0 && (
                <>
                    <h2 className="text-3xl font-extrabold text-green-400 mb-6 tracking-tight flex items-center gap-2">
                        <span className="inline-block w-2 h-6 bg-green-400 rounded-full"></span>
                        Taken Interviews
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {completed.map((item) => (
                            <div
                                key={item._id}
                                className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 p-6 rounded-3xl shadow-xl border-2 border-green-400 hover:scale-105 transition-transform duration-300 group"
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">{item.type}</span>
                                    <span className="bg-gray-700 text-green-300 text-xs px-2 py-1 rounded-full">{item.level}</span>
                                </div>
                                <h1 className="text-2xl text-orange-200 font-bold mb-2 flex items-center gap-2">
                                    {item.role}
                                </h1>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {item.techstack.map((tech, idx) => (
                                        <span key={idx} className="bg-green-700 text-xs px-2 py-1 rounded-full text-white font-semibold">{tech}</span>
                                    ))}
                                </div>
                                <div className="mb-3 flex items-center gap-2">
                                    <span className="text-xs text-gray-400">Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                                    <span className="ml-auto bg-green-500/20 text-green-300 text-xs font-bold px-3 py-1 rounded-full shadow">{item.numberOfQuestions} Questions</span>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-xs font-bold text-green-400">Completed</span>
                                    <Link href={`/interview/${item._id}/feedback`}>
                                        <button className="px-4 py-2 rounded-full bg-green-400 hover:bg-green-500 text-sm font-bold shadow transition">Review Interview</button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* If nothing exists */}
            {!loading && incomplete.length === 0 && completed.length === 0 && (
                <p className="text-center text-gray-400 mt-10">No interviews found.</p>
            )}
        </div>
    );
};

export default Generated;
