"use client";

import Image from "next/image";
import Link from "next/link";
import Generated from "@/component/Generated";
import Navbar from "@/component/Navbar";


const Page = () => {

  return (

    <div className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen w-full text-white">
      <Navbar />
      <div className="flex flex-col md:flex-row justify-between items-center p-10 gap-8">
        <div className="max-w-xl">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-400 mb-4">
            Get Interview Ready with Interviewer
          </h2>
          <p className="text-lg md:text-2xl text-red-400 mb-6">
            Practice real interview questions with instant feedback.
          </p>
          <Link href="/interview">
            <button className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-500 transition font-semibold">
              Create an Interview
            </button>
          </Link>
        </div>
        <div>
          <Image src="/robot.png" alt="robot assistant" height={350} width={350} className="rounded-lg shadow-lg" />
        </div>
      </div>
      <Generated />
    </div>
  );
};


export default Page;
