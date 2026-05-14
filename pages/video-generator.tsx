"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CaptionStyleSelector from "../components/CaptionStyleSelector";
import ImageGeneratorSettings from "../components/ImageGeneratorSettings";
import EnhancedVideoPreview from "../components/EnhancedVideoPreview";
import EnhancedUploadStatus from "../components/EnhancedUploadStatus";
import TopicInput from "../components/TopicInput";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://reddit-shorts-backend-production.up.railway.app";

const NICHES = [
  { value: "facts", label: "📚 Facts", icon: "📚" },
  { value: "motivation", label: "🔥 Motivation", icon: "🔥" },
  { value: "reddit_stories", label: "📖 Reddit Stories", icon: "📖" },
  { value: "horror", label: "👻 Horror", icon: "👻" },
  { value: "history", label: "🏛️ History", icon: "🏛️" },
  { value: "business", label: "💼 Business", icon: "💼" },
];

const VOICES = [
  { value: "male_deep", label: "🎙️ Male Deep", desc: "Powerful & bold" },
  { value: "male_calm", label: "🎙️ Male Calm", desc: "Smooth & relaxing" },
  { value: "female_energetic", label: "🎙️ Female Energetic", desc: "Upbeat & lively" },
  { value: "female_soft", label: "🎙️ Female Soft", desc: "Gentle & soothing" },
];

const VIDEO_STYLES = [
  { value: "gameplay", label: "🎮 Gameplay", desc: "Gaming clips" },
  { value: "satisfying", label: "🧼 Satisfying", desc: "ASMR style" },
  { value: "minecraft", label: "⛏️ Minecraft", desc: "Parkour/builds" },
  { value: "cinematic", label: "🎬 Cinematic", desc: "Stock footage" },
];

export default function VideoGenerator() {
  // Core settings
  const [niche, setNiche] = useState("facts");
  const [topic, setTopic] = useState("");
  const [voice, setVoice] = useState("male_deep");
  const [videoStyle, setVideoStyle] = useState("gameplay");

  // NEW: Advanced options
  const [captionStyle, setCaptionStyle] = useState<"viral" | "word-by-word">("viral");
  const [enableImages, setEnableImages] = useState(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationSteps, setGenerationSteps] = useState<any[]>([]);

  // Response data
  const [imagesApplied, setImagesApplied] = useState(false);

  const updateStep = (stepName: string, status: "pending" | "processing" | "completed" | "failed", details?: string) => {
    setGenerationSteps((prev) => {
      const existing = prev.findIndex((s) => s.name === stepName);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], status, details };
        return updated;
      }
      return [...prev, { name: stepName, status, emoji: "⏳", details }];
    });
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);
    setGenerationSteps([]);

    try {
      updateStep("Audio Generation", "processing", "Creating TTS audio...");

      // Simulate step progress
      setTimeout(() => updateStep("Audio Generation", "completed"), 2000);
      setTimeout(() => updateStep("Video Fetching", "processing", "Getting background video..."), 2500);

      if (enableImages) {
        setTimeout(() => updateStep("Video Fetching", "completed"), 4000);
        setTimeout(() => updateStep("Image Prompts", "processing", "Generating with Gemini AI..."), 4500);
        setTimeout(() => updateStep("Image Prompts", "completed"), 6000);
        setTimeout(() => updateStep("Image Fetching", "processing", "Searching Pexels API..."), 6500);
        setTimeout(() => updateStep("Image Fetching", "completed"), 8000);
        setTimeout(() => updateStep("Apply Effects", "processing", "Color grading..."), 8500);
        setTimeout(() => updateStep("Apply Effects", "completed"), 9500);
      } else {
        setTimeout(() => updateStep("Video Fetching", "completed"), 4000);
      }

      setTimeout(() => updateStep("Word Timestamps", "processing", "Using Deepgram..."), 10000);
      setTimeout(() => updateStep("Word Timestamps", "completed"), 11000);
      setTimeout(() => updateStep("Captions", "processing", `Generating ${captionStyle} captions...`), 11500);

      const response = await fetch(`${API_URL}/generate-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          niche,
          voice,
          video_style: videoStyle,
          caption_style: captionStyle,
          enable_images: enableImages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Video generation failed");
      }

      const data = await response.json();

      updateStep("Captions", "completed");
      updateStep("Video Upload", "processing", "Saving to Supabase...");

      setVideoUrl(data.video_url);
      setImagesApplied(data.images_applied || false);

      setTimeout(() => updateStep("Video Upload", "completed"), 1000);
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message);
      updateStep("Video Generation", "failed", err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Create AI-Powered YouTube Shorts
          </h1>
          <p className="text-xl text-zinc-400">
            Generate viral videos with advanced captions and AI-generated images
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Topic Input */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-4">📝 Your Topic</h3>
              <TopicInput value={topic} onChange={setTopic} />
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </div>

            {/* Niche Selection */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-4">🎯 Niche</h3>
              <div className="grid grid-cols-2 gap-2">
                {NICHES.map((n) => (
                  <button
                    key={n.value}
                    onClick={() => setNiche(n.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      niche === n.value
                        ? "border-blue-500 bg-blue-500/10 text-blue-200"
                        : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600"
                    }`}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Selection */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-4">🎙️ Voice</h3>
              <div className="space-y-2">
                {VOICES.map((v) => (
                  <button
                    key={v.value}
                    onClick={() => setVoice(v.value)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left text-sm ${
                      voice === v.value
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <p className="font-medium">{v.label}</p>
                    <p className="text-xs text-zinc-400">{v.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Video Style */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-4">🎬 Video Style</h3>
              <div className="grid grid-cols-2 gap-2">
                {VIDEO_STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setVideoStyle(style.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      videoStyle === style.value
                        ? "border-blue-500 bg-blue-500/10 text-blue-200"
                        : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600"
                    }`}
                  >
                    <div className="font-medium">{style.label}</div>
                    <div className="text-xs text-zinc-400 mt-1">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                isGenerating || !topic.trim()
                  ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/50"
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </span>
              ) : (
                "🚀 Generate Video"
              )}
            </button>
          </div>

          {/* Right Column: Advanced Settings & Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Advanced Settings */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-5">
              <h3 className="text-lg font-semibold">⚙️ Advanced Options</h3>

              {/* Caption Style */}
              <CaptionStyleSelector value={captionStyle} onChange={setCaptionStyle} />

              {/* Image Generator */}
              <div className="border-t border-zinc-800 pt-5">
                <ImageGeneratorSettings
                  enableImages={enableImages}
                  onToggle={setEnableImages}
                  niche={niche}
                />
              </div>
            </div>

            {/* Generation Status */}
            {(isGenerating || generationSteps.length > 0) && (
              <EnhancedUploadStatus
                isProcessing={isGenerating}
                steps={generationSteps}
                error={error}
              />
            )}

            {/* Video Preview */}
            <EnhancedVideoPreview
              videoUrl={videoUrl}
              isLoading={isGenerating}
              captionStyle={captionStyle}
              imagesApplied={imagesApplied}
              error={!isGenerating && error ? error : null}
            />
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <h4 className="font-semibold mb-2 text-blue-300">✨ Word-by-Word Captions</h4>
            <p className="text-sm text-zinc-400">
              Smooth, animated word reveals synchronized perfectly with audio for maximum engagement.
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <h4 className="font-semibold mb-2 text-green-300">🖼️ AI-Generated Images</h4>
            <p className="text-sm text-zinc-400">
              Gemini creates scene descriptions, Pexels fetches matching images with professional effects.
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <h4 className="font-semibold mb-2 text-purple-300">🚀 Production Ready</h4>
            <p className="text-sm text-zinc-400">
              Generate, customize, and upload to YouTube—all in minutes with no manual editing.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
