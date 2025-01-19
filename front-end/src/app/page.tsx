'use client'
import Hero from "@/components/Hero";
import { useEffect, useRef, useState } from "react";
import Summary from "@/components/Summary";
import Anatomy from "@/components/Anatomy";
import Security from "@/components/Security";

type Contributions = {
  name: string;
  commits: number;
  percentage: number;
}

export default async function Home() {
  const [currentTab, setCurrentTab] = useState<string>("Summary");
  const [url, setUrl] = useState<string>("");
  const tabs = useRef<string[]>(["Summary", "Anatomy", "Security"]);
  const backendUrl = "http://127.0.0.1:8000/";

  useEffect(() => {
    fetch(`${backendUrl}/?repo_url=${url}`)
      .then((response) => console.log(response.json()))
      .catch((error) => console.error("Error:", error))
  }, [url])

  const example = {
    name: "Supabase",
    description:
      "Supabase is an open source Firebase alternative. We are a service to help developers build products faster, by giving them a suite of APIs on top of their database. Supabase adds realtime and restful APIs to Postgres without a single line of code. Our mission is to help developers build products faster.  We are a team of developers who have been frustrated by the current state of development. We believe that software development is too slow, too complex, and too fragmented. We want to make it easier for developers to build products, by giving them the tools they need to build faster, and by providing them with a community of developers who can help them along the way.",
    data: [
      { name: "IcedTea2K", numeric: 70, percentage: 70 },
      { name: "Aqil", numeric: 20, percentage: 20 },
      { name: "Rey", numeric: 5, percentage: 5 },
      { name: "Hasan", numeric: 5, percentage: 5 },
      { name: "Liam", numeric: 10, percentage: 10 },
      { name: "Olivia", numeric: 10, percentage: 10 },
      { name: "Emma", numeric: 10, percentage: 10 },
      { name: "Noah", numeric: 10, percentage: 10 },
      { name: "Sophia", numeric: 10, percentage: 10 },
      { name: "Ava", numeric: 10, percentage: 10 },
      { name: "Mason", numeric: 10, percentage: 10 },
      { name: "Isabella", numeric: 10, percentage: 10 },
      { name: "Ethan", numeric: 10, percentage: 10 },
      { name: "Mia", numeric: 10, percentage: 10 }
    ],
    issues: [
      {
        title: "Issue 1",
        url: "",
        tags: [
          { name: "bug", color: "#d73a4a" },
          { name: "enhancement", color: "#a2eeef" }
        ]
      },
    ]
  };

  return (
    <div
      className="w-full flex flex-col items-center justify-center
      gap-y-20"
    >
      <Hero urlSetter={setUrl}/>
      <div className="flex flex-col w-5/6 ">
        <div className="flex flex-row gap-x-2">
          {tabs.current.map((tab) => (
            <div
              key={tab}
              className={`bg-[#4A665A]/[.18] w-fit px-6 py-2 rounded-t-lg ${
                tab !== currentTab
                  ? "shadow-inner-bottom hover:cursor-pointer hover:bg-[#4A665A]/[.30]"
                  : ""
              }`}
              onClick={() => setCurrentTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
        <div
          className="flex flex-col items-center
              h-[80svh] bg-[#4A665A]/[.18] rounded-b-3xl gap-y-5 px-8 py-6"
        >
          {currentTab === "Summary" && <Summary {...example} />}
          {currentTab === "Anatomy" && <Anatomy />}
          {currentTab === "Security" && <Security />}
        </div>
      </div>
    </div>
  );
}
