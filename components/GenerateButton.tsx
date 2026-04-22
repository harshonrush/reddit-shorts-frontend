"use client";

import { useState } from "react";

interface GenerateButtonProps {
  topic: string;
  onGenerate?: (videoUrl: string) => void;
}

export default function GenerateButton({ topic, onGenerate }: GenerateButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) throw new Error("API failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      if (onGenerate) {
        onGenerate(url);
      }
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || !topic.trim()}
      className="w-full px-6 py-3 bg-white text-zinc-950 font-semibold rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? "Generating..." : "Generate Reel"}
    </button>
  );
}
