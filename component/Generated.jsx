"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Generated = () => {
    const { data: session } = useSession();
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!session?.user?.id) return;
            const res = await fetch(`/api/interview/${session.user.id}`);
            const data = await res.json();
            setInterviews(data);
        };
        fetchData();
    }, [session]);

    const incomplete = interviews.filter((item) => item.completed === false);
    const completed = interviews.filter((item) => item.completed === true);

    return (
        <div className="p-6 md:p-10 text-white">
            {/* Incomplete Section */}
            {incomplete.length > 0 && (
                <>
                    <h2 className="text-2xl font-bold text-cyan-400 mb-4">Generated Interviews</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                        {incomplete.map((item) => (
                            <div
                                key={item._id}
                                className="bg-gray-900 p-5 rounded-xl shadow-lg border border-gray-700 hover:scale-105 transition-transform duration-300"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                        {item.type}
                                    </span>
                                </div>
                                <h1 className="text-xl text-orange-300 font-semibold mb-2">
                                    {item.role} Developer Interview
                                </h1>
                                <p className="text-sm text-cyan-300 mb-4">
                                    You haven't taken the interview yet. Take it to improve your skills.
                                </p>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-400 italic">{item.techstack}</p>
                                    <Link href={`/interview/${item._id}`}>
                                        <button className="px-4 py-2 rounded-full bg-cyan-400 hover:bg-cyan-500 text-sm font-semibold transition">
                                            Take Interview
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Completed Section */}
            {completed.length > 0 && (
                <>
                    <h2 className="text-2xl font-bold text-green-400 mb-4">Taken Interviews</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {completed.map((item) => (
                            <div
                                key={item._id}
                                className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-600 hover:scale-105 transition-transform duration-300"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                        {item.type}
                                    </span>
                                </div>
                                <h1 className="text-xl text-orange-200 font-semibold mb-2">
                                    {item.role} Developer Interview
                                </h1>
                                <p className="text-sm text-green-300 mb-4">
                                    You’ve already taken this interview. Review your performance or try again!
                                </p>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-300 italic">{item.techstack}</p>
                                    <Link href={`/interview/${item._id}`}>
                                        <button className="px-4 py-2 rounded-full bg-green-400 hover:bg-green-500 text-sm font-semibold transition">
                                            Review Interview
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* If nothing exists */}
            {incomplete.length === 0 && completed.length === 0 && (
                <p className="text-center text-gray-400 mt-10">No interviews found.</p>
            )}
        </div>
    );
};

export default Generated;
