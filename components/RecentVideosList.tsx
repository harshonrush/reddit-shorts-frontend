"use client";

import { useState } from "react";

interface Video {
  id: string;
  thumbnail: string;
  title: string;
  status: "pending" | "uploaded" | "failed";
}

const mockVideos: Video[] = [
  { id: "1", thumbnail: "/thumb1.jpg", title: "Heartbreak Story", status: "uploaded" },
  { id: "2", thumbnail: "/thumb2.jpg", title: "Cheating Drama", status: "pending" },
  { id: "3", thumbnail: "/thumb3.jpg", title: "Regret Tale", status: "failed" },
];

const statusColors = {
  pending: "text-yellow-500",
  uploaded: "text-green-500",
  failed: "text-red-500",
};

export default function RecentVideosList() {
  const [videos] = useState<Video[]>(mockVideos);

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Videos</h3>
      <div className="space-y-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex items-center gap-4 p-3 bg-zinc-950 rounded-lg"
          >
            <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center text-xs text-zinc-500">
              IMG
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{video.title}</p>
              <p className={`text-sm ${statusColors[video.status]}`}>
                {video.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
