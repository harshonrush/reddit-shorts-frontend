"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import TopicInput from "../components/TopicInput";
import GenerateButton from "../components/GenerateButton";
import VideoPreview from "../components/VideoPreview";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Generate Reel</h1>
            <p className="text-zinc-400">Enter a topic to generate a Reddit story reel</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <TopicInput value={topic} onChange={setTopic} />
              <GenerateButton topic={topic} onGenerate={setGeneratedVideoUrl} />
            </div>
            <VideoPreview videoUrl={generatedVideoUrl} />
          </div>
        </div>
      </main>
    </div>
  );
}
