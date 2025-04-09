"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import dayjs from 'dayjs'

const Page = () => {
    const { id } = useParams();
    const [feedback, setfeedback] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/interview/${id}/feed`)
            const data = await res.json()
            console.log("data for feedback in feedback page is", data)
            setfeedback(data)
        }
        fetchData()
    }, [])

    return (
        <div className='min-h-screen w-full flex justify-center items-start bg-gray-50 p-4 sm:p-6'>
            {feedback ? (
                <div className='bg-white shadow-lg rounded-xl w-full max-w-3xl p-6 space-y-6'>
                    <h1 className='text-2xl font-bold text-center text-blue-600'>
                        {feedback.interviewId?.role?.toUpperCase() || "Loading..."} DEVELOPER INTERVIEW
                    </h1>

                    <div className='flex flex-col sm:flex-row justify-between sm:items-center text-gray-700'>
                        <p className='text-lg mb-2 sm:mb-0'>
                            Total Score: <span className='font-semibold'>{feedback.total_score}</span>
                        </p>
                        <p className='text-sm text-gray-500'>{dayjs(feedback.createdAt).format('YYYY-MM-DD HH:mm')}</p>
                    </div>

                    {/* Scores Section */}
                    <div className='text-left'>
                        <h2 className='text-xl font-bold underline underline-offset-4 mb-4'>Scores in Different Aspects</h2>
                        <div className='space-y-2'>
                            <p><span className='font-semibold'>Communication Skills:</span> {feedback.category_score.communication_skills}</p>
                            <p><span className='font-semibold'>Technical Knowledge:</span> {feedback.category_score.technical_knowledge}</p>
                            <p><span className='font-semibold'>Problem Solving:</span> {feedback.category_score.problem_solving}</p>
                            <p><span className='font-semibold'>Cultural Role Fit:</span> {feedback.category_score.cultural_role_fit}</p>
                            <p><span className='font-semibold'>Confidence Clarity:</span> {feedback.category_score.confidence_clarity}</p>
                        </div>
                    </div>

                    {/* Strengths Section */}
                    <div className='text-left'>
                        <h2 className='text-lg font-bold underline underline-offset-4 mb-3'>Strengths of the Interviewee</h2>
                        <ul className='list-disc pl-5 space-y-1'>
                            {feedback.strength.map((item, index) => (
                                <li key={index} className='text-md'>{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div className='text-left'>
                        <h2 className='text-lg font-bold underline underline-offset-4 pt-6 mb-3'>Areas for Improvement</h2>
                        <ul className='list-disc pl-5 space-y-1'>
                            {feedback.areasforimprovement.map((item, index) => (
                                <li key={index} className='text-md'>{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Final Assessment */}
                    <div className='text-left'>
                        <h2 className='text-lg font-bold underline underline-offset-4 pt-6 mb-3'>Final Assessment</h2>
                        <ul className='list-disc pl-5 space-y-1'>
                            {feedback.finalassessment.map((item, index) => (
                                <li key={index} className='text-md'>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <p className='text-xl text-gray-500'>Loading...</p>
            )}
        </div>
    )
}

export default Page
