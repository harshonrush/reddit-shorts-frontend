"use client";

interface EnhancedVideoPreviewProps {
  videoUrl?: string | null;
  isLoading?: boolean;
  captionStyle?: "viral" | "word-by-word";
  imagesApplied?: boolean;
  error?: string | null;
}

export default function EnhancedVideoPreview({
  videoUrl,
  isLoading,
  captionStyle = "viral",
  imagesApplied,
  error,
}: EnhancedVideoPreviewProps) {
  if (error) {
    return (
      <div className="w-full aspect-[9/16] bg-red-950 rounded-xl border border-red-900 flex flex-col items-center justify-center p-6">
        <span className="text-3xl mb-3">⚠️</span>
        <p className="text-red-300 font-semibold text-center">Generation Failed</p>
        <p className="text-red-200 text-sm text-center mt-2">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full aspect-[9/16] bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-zinc-700 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
          </div>
          <p className="text-zinc-300 font-semibold">Generating Video...</p>
          <p className="text-zinc-500 text-sm mt-2">
            This may take 1-2 minutes
          </p>
        </div>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="w-full aspect-[9/16] bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col items-center justify-center p-6">
        <span className="text-4xl mb-3">🎬</span>
        <p className="text-zinc-300 font-semibold">Ready to Generate</p>
        <p className="text-zinc-500 text-sm text-center mt-2">
          Configure your settings and click "Generate" to create your video
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Video Container */}
      <div className="w-full aspect-[9/16] bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden mb-4">
        <video
          src={videoUrl}
          controls
          className="w-full h-full object-contain bg-black"
          poster="/video-placeholder.png"
        />
      </div>

      {/* Features Used */}
      <div className="grid grid-cols-2 gap-3">
        {/* Caption Style Badge */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">
            {captionStyle === "word-by-word" ? "✨" : "🎬"}
          </div>
          <p className="text-xs font-semibold text-blue-300">
            {captionStyle === "word-by-word"
              ? "Word-by-Word"
              : "Viral Captions"}
          </p>
          <p className="text-xs text-blue-200 mt-1">Animation Style</p>
        </div>

        {/* Image Badge */}
        <div className={`rounded-lg p-3 text-center border ${
          imagesApplied
            ? "bg-green-500/10 border-green-500/30"
            : "bg-zinc-800/30 border-zinc-700"
        }`}>
          <div className="text-2xl mb-1">
            {imagesApplied ? "🖼️" : "📹"}
          </div>
          <p className={`text-xs font-semibold ${
            imagesApplied ? "text-green-300" : "text-zinc-400"
          }`}>
            {imagesApplied ? "AI Images" : "Standard"}
          </p>
          <p className={`text-xs mt-1 ${
            imagesApplied ? "text-green-200" : "text-zinc-500"
          }`}>
            {imagesApplied ? "Applied" : "No Images"}
          </p>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={() => {
          const a = document.createElement("a");
          a.href = videoUrl;
          a.download = `reddit-short-${Date.now()}.mp4`;
          a.click();
        }}
        className="w-full mt-4 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        ⬇️ Download Video
      </button>
    </div>
  );
}
