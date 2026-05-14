"use client";

import { useState } from "react";

interface ImageGeneratorSettingsProps {
  enableImages: boolean;
  onToggle: (enabled: boolean) => void;
  niche: string;
}

export default function ImageGeneratorSettings({
  enableImages,
  onToggle,
  niche,
}: ImageGeneratorSettingsProps) {
  const [showDetails, setShowDetails] = useState(false);

  const nicheExamples: Record<string, string> = {
    facts: "Historical facts with cinematic backgrounds",
    motivation: "Inspirational scenes with dynamic imagery",
    reddit_stories: "Story-driven images from scenes",
    ai_stories: "Fictional story visuals",
    history: "Historical period imagery",
    heartbreak: "Emotional scene compositions",
    business: "Corporate and entrepreneurship visuals",
    fitness: "Workout and health imagery",
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-semibold text-white">
          AI-Generated Images (Beta)
        </label>
        <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full">
          NEW
        </span>
      </div>

      {/* Toggle Switch */}
      <div
        onClick={() => onToggle(!enableImages)}
        className={`w-full p-4 rounded-lg border-2 cursor-pointer transition-all mb-3 ${
          enableImages
            ? "border-green-500/50 bg-green-500/10"
            : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-600"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🖼️</span>
            <div>
              <h4 className="font-semibold text-white">
                Scene-Specific AI Images
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Auto-generate & fetch images for each video scene
              </p>
            </div>
          </div>
          <div
            className={`w-12 h-7 rounded-full transition-all ${
              enableImages ? "bg-green-500" : "bg-zinc-600"
            } flex items-center ${enableImages ? "justify-end" : "justify-start"} p-1`}
          >
            <div className="w-5 h-5 bg-white rounded-full" />
          </div>
        </div>
      </div>

      {/* Details Section */}
      {enableImages && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-2"
          >
            {showDetails ? "Hide" : "Show"} Technical Details
            <span className={`transform transition-transform ${showDetails ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>

          {showDetails && (
            <div className="text-xs text-zinc-400 space-y-2 border-t border-zinc-800 pt-3">
              <div>
                <p className="text-zinc-300 font-semibold mb-1">🤖 Gemini AI Processing:</p>
                <p>• Analyzes your script</p>
                <p>• Splits into 3-5 scenes</p>
                <p>• Generates cinematic prompts</p>
              </div>
              <div>
                <p className="text-zinc-300 font-semibold mb-1">🎨 Image Fetching:</p>
                <p>• Searches Pexels API</p>
                <p>• Downloads high-quality images</p>
                <p>• Auto-formatted for shorts (360x640)</p>
              </div>
              <div>
                <p className="text-zinc-300 font-semibold mb-1">✨ Color Effects:</p>
                <p>• +30% saturation (viral appeal)</p>
                <p>• Enhanced contrast & brightness</p>
                <p>• Sharpening for clarity</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded p-2 mt-2">
                <p className="text-amber-300 font-semibold">⏱️ Processing Time:</p>
                <p className="text-amber-200">+15-20 seconds per video</p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
            <p className="text-xs font-semibold text-blue-300 mb-2">
              📊 Example for "{niche}" niche:
            </p>
            <p className="text-xs text-blue-200">
              {nicheExamples[niche] || nicheExamples.facts}
            </p>
          </div>

          {/* Rate Limit Info */}
          <div className="bg-zinc-800/50 rounded p-2 text-xs text-zinc-400">
            <span className="font-semibold">💾 API Limits:</span> Pexels (50 req/hr) = ~20 videos/day
          </div>
        </div>
      )}

      {/* Not Enabled Info */}
      {!enableImages && (
        <div className="bg-zinc-800/30 rounded p-3 text-xs text-zinc-400">
          <p>💡 Enable to add professional scene-matched images to your videos</p>
        </div>
      )}
    </div>
  );
}
