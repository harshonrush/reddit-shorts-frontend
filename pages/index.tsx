"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://reddit-shorts-backend-production.up.railway.app";

type Step = 1 | 2 | 3 | 4;

export default function Home() {
  // Step 1: Input
  const [idea, setIdea] = useState("");

  // Step 2: Script
  const [script, setScript] = useState("");
  const [scriptId, setScriptId] = useState("");

  // Step 3: Job
  const [jobId, setJobId] = useState("");
  const [jobStatus, setJobStatus] = useState<"queued" | "processing" | "completed" | "failed">("queued");
  const [progress, setProgress] = useState(0);

  // Step 4: Result
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Global state
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate Script (Step 1 → 2)
  const handleGenerateScript = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError(null);

    try {
      console.log("[FRONTEND] Calling /generate-script...");
      const res = await fetch(`${API_URL}/generate-script`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      console.log("[FRONTEND] Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("[FRONTEND] Error response:", errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log("[FRONTEND] Got script_id:", data.script_id);
      setScript(data.script);
      setScriptId(data.script_id);
      setStep(2);
    } catch (err: any) {
      console.error("[FRONTEND] Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Regenerate Script (stay on Step 2)
  const handleRegenerateScript = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/generate-script`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      if (!res.ok) throw new Error("Failed to regenerate script");

      const data = await res.json();
      setScript(data.script);
      setScriptId(data.script_id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate Video (Step 2 → 3)
  const handleGenerateVideo = async () => {
    if (!script.trim()) return;
    setLoading(true);
    setError(null);

    try {
      console.log("[FRONTEND] Calling /generate-video...");
      const res = await fetch(`${API_URL}/generate-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script }),
      });

      console.log("[FRONTEND] Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("[FRONTEND] Error response:", errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log("[FRONTEND] Got job_id:", data.job_id);
      setJobId(data.job_id);
      setJobStatus("queued");
      setProgress(10);
      setStep(3);
    } catch (err: any) {
      console.error("[FRONTEND] Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Poll Job Status (Step 3)
  const pollJobStatus = useCallback(async () => {
    if (!jobId || step !== 3) return;

    try {
      console.log(`[FRONTEND] Polling /job-status/${jobId}...`);
      const res = await fetch(`${API_URL}/job-status/${jobId}`);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("[FRONTEND] Status check failed:", errorText);
        return;
      }

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        const text = await res.text();
        console.error("[FRONTEND] Invalid JSON response:", text);
        setError("Server returned invalid data");
        return;
      }

      console.log("[FRONTEND] Job status:", data.status);
      setJobStatus(data.status);

      // Update progress based on status
      if (data.status === "queued") setProgress(20);
      else if (data.status === "processing") setProgress(50);
      else if (data.status === "completed") {
        setProgress(100);
        setVideoUrl(data.video_url);
        setStep(4);
      } else if (data.status === "failed") {
        setError(data.error || "Video generation failed");
        setStep(2); // Go back to script editing
      }
    } catch (err: any) {
      console.error("[FRONTEND] Polling error:", err);
    }
  }, [jobId, step]);

  useEffect(() => {
    if (step === 3 && jobId) {
      const interval = setInterval(pollJobStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [step, jobId, pollJobStatus]);

  // Reset to start
  const handleReset = () => {
    setStep(1);
    setIdea("");
    setScript("");
    setScriptId("");
    setJobId("");
    setJobStatus("queued");
    setProgress(0);
    setVideoUrl(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-3">Create Viral Reddit Reel</h1>
            <p className="text-zinc-400">Turn any idea into an engaging short video</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* STEP 1: Input */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  What's your video about?
                </label>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="e.g., My toxic friend betrayed me at my wedding..."
                  className="w-full h-32 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <button
                onClick={handleGenerateScript}
                disabled={!idea.trim() || loading}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {loading ? "Generating..." : "Generate Script"}
              </button>
            </div>
          )}

          {/* STEP 2: Script Editor */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Review & Edit Script
                </label>
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  className="w-full h-64 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none font-mono text-sm leading-relaxed"
                />
                <p className="mt-2 text-xs text-zinc-500">
                  Edit the script above or regenerate for a new version
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRegenerateScript}
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  {loading ? "Regenerating..." : "Regenerate"}
                </button>
                <button
                  onClick={handleGenerateVideo}
                  disabled={!script.trim() || loading}
                  className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  {loading ? "Starting..." : "Generate Video"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Processing */}
          {step === 3 && (
            <div className="text-center py-12">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-500/10 rounded-full">
                  <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Generating your video...</h2>
                <p className="text-zinc-400">This may take 1-2 minutes</p>
              </div>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto mb-6">
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-zinc-500">
                  <span className={progress >= 20 ? "text-blue-400" : ""}>Queued</span>
                  <span className={progress >= 50 ? "text-blue-400" : ""}>Processing</span>
                  <span className={progress >= 100 ? "text-blue-400" : ""}>Done</span>
                </div>
              </div>

              {/* Status Details */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-lg text-sm text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                {jobStatus === "queued" && "Waiting in queue..."}
                {jobStatus === "processing" && "Rendering on GPU..."}
                {jobStatus === "completed" && "Finalizing..."}
              </div>
            </div>
          )}

          {/* STEP 4: Result */}
          {step === 4 && videoUrl && (
            <div className="space-y-6">
              {/* Video Player */}
              <div className="bg-zinc-900 rounded-lg overflow-hidden">
                <video
                  src={`${API_URL}${videoUrl}`}
                  controls
                  className="w-full aspect-[9/16] bg-black"
                  poster="/video-placeholder.png"
                />
              </div>

              {/* Script Used */}
              <div className="p-4 bg-zinc-900 rounded-lg">
                <h3 className="text-sm font-medium text-zinc-400 mb-2">Script Used</h3>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{script}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <a
                  href={`${API_URL}${videoUrl}`}
                  download
                  className="flex-1 py-3 px-6 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors text-center"
                >
                  Download
                </a>
                <button
                  onClick={() => {/* TODO: Upload to YouTube */}}
                  className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
                >
                  Upload to YouTube
                </button>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 px-6 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
              >
                Create Another Video
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
