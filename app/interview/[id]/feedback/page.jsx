"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const Page = () => {
    const { id } = useParams();

    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);

    const getFeedback = async () => {
        try {
            console.log("id for interview is", id);
            const result = await fetch(`/api/interview/${id}/feed`);
            const data = await result.json();
            setFeedback(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getFeedback();
    }, []);

    const SectionIcon = ({ emoji }) => (
        <span className="mr-2 text-xl align-middle">{emoji}</span>
    );

    const ProgressBar = ({ value, color }) => (
        <div className="w-full bg-gray-200 rounded-full h-3">
            <div
                className={`h-3 rounded-full transition-all duration-500 ${color}`}
                style={{ width: `${value * 10}%` }}
            ></div>
        </div>
    );

    if (loading || !feedback) {
        return <div className="text-center p-10 text-lg">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-yellow-50 py-10 px-4">
            <div className="max-w-3xl mx-auto space-y-10">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-xl p-8 flex flex-col md:flex-row md:items-center md:justify-between overflow-hidden">
                    <div className="flex items-center space-x-4">
                        <img
                            src="/robot.png"
                            alt="AI Avatar"
                            className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-white object-cover"
                        />
                        <div>
                            <h1 className="text-4xl font-extrabold text-white mb-1 drop-shadow">
                                Interview Feedback
                            </h1>
                        </div>
                    </div>
                    <div className="flex flex-col md:items-end mt-6 md:mt-0 space-y-2 min-w-[200px]">
                        <div className="flex items-center space-x-2">
                            <span className="text-white text-lg font-semibold">Total</span>
                            <span className="text-2xl font-bold text-yellow-200">
                                {feedback.total_score}/10
                            </span>
                        </div>
                        <ProgressBar value={feedback.total_score} color="bg-yellow-300" />

                        <div className="flex items-center space-x-2 mt-2">
                            <span className="text-white text-lg font-semibold">Communication</span>
                            <span className="text-2xl font-bold text-green-200">
                                {feedback.communication_score}/10
                            </span>
                        </div>
                        <ProgressBar
                            value={feedback.communication_score}
                            color="bg-green-300"
                        />

                        <div className="flex items-center space-x-2 mt-2">
                            <span className="text-white text-lg font-semibold">Technical</span>
                            <span className="text-2xl font-bold text-blue-200">
                                {feedback.technical_score}/10
                            </span>
                        </div>
                        <ProgressBar
                            value={feedback.technical_score}
                            color="bg-blue-300"
                        />
                    </div>

                    <div className="absolute right-0 bottom-0 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                </div>

                {/* Question */}
                <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-7 border border-gray-100">
                    <h2 className="text-2xl font-bold flex items-center mb-3 text-indigo-700">
                        <SectionIcon emoji="❓" /> Questions
                    </h2>
                    <ul className="list-decimal list-inside text-gray-800 text-lg leading-relaxed space-y-1">
                        {feedback.questions?.map((q, i) => (
                            <li key={i}>{q}</li>
                        ))}
                    </ul>
                </div>


                {/* Summary */}
                <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-7 border border-gray-100">
                    <h2 className="text-2xl font-bold flex items-center mb-3 text-blue-700">
                        <SectionIcon emoji="📝" /> Summary
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        {feedback.summary}
                    </p>
                </div>

                {/* Strengths & Areas of Improvement */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-green-50/80 backdrop-blur rounded-2xl shadow p-7 border border-green-100">
                        <h2 className="text-xl font-semibold flex items-center mb-3 text-green-700">
                            <SectionIcon emoji="✅" /> Strengths
                        </h2>
                        <ul className="list-disc list-inside text-green-900 space-y-2 text-base">
                            {feedback.strength.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-red-50/80 backdrop-blur rounded-2xl shadow p-7 border border-red-100">
                        <h2 className="text-xl font-semibold flex items-center mb-3 text-red-700">
                            <SectionIcon emoji="⚠️" /> Areas of Improvement
                        </h2>
                        <ul className="list-disc list-inside text-red-900 space-y-2 text-base">
                            {feedback.area_of_improvement?.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-50/80 backdrop-blur rounded-2xl shadow p-7 border border-blue-100">
                    <h2 className="text-xl font-semibold flex items-center mb-3 text-blue-700">
                        <SectionIcon emoji="💡" /> Tips
                    </h2>
                    <ul className="list-disc list-inside text-blue-900 space-y-2 text-base">
                        {feedback.tips?.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Practice Questions */}
                <div className="bg-yellow-50/80 backdrop-blur rounded-2xl shadow p-7 border border-yellow-100">
                    <h2 className="text-xl font-semibold flex items-center mb-3 text-yellow-700">
                        <SectionIcon emoji="🎯" /> Practice Questions
                    </h2>
                    <ul className="list-decimal list-inside text-yellow-900 space-y-2 text-base">
                        {feedback.practice_question?.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Page;
