"use client";

interface VideoPreviewProps {
  videoUrl?: string | null;
}

export default function VideoPreview({ videoUrl }: VideoPreviewProps) {
  if (!videoUrl) {
    return (
      <div className="w-full aspect-[9/16] bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center">
        <p className="text-zinc-500 text-sm">No video generated yet</p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-[9/16] bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
      <video
        src={videoUrl}
        controls
        className="w-full h-full object-contain"
        poster="/video-placeholder.png"
      />
    </div>
  );
}
