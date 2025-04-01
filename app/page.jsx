"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";


const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log(session);

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/signin");
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return <div className="bg-black h-screen w-screen">
    <div className="flex justify-between h-90 w-full p-10  ">
      <div>
        <h2 className="p-5 text-4xl text-blue-600">Get interview ready Interviewer</h2>
        <p className="text-2xl pl-5 p-2 text-red-400">Practice real interview question with instant feedback</p>
        <Link href="/interview">
          <button className="border-4 m-8 ml-28 rounded-full p-3 bg-amber-200 hover:bg-amber-500">Create an interview</button>
        </Link>
      </div>
      <div>
        <Image src={"/robot.png"} alt="robo-dude" height={350} width={350} />
      </div>
    </div>
  </div>
};

export default Page;
