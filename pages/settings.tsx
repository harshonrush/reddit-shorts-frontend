"use client";

import Navbar from "../components/Navbar";
import YouTubeConnect from "../components/YouTubeConnect";
import PostingSchedule from "../components/PostingSchedule";

export default function Settings() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-zinc-400">Configure your YouTube integration and posting schedule</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <YouTubeConnect />
            <PostingSchedule />
          </div>
        </div>
      </main>
    </div>
  );
}
