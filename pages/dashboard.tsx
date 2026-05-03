"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const BACKEND_URL = "https://reddit-shorts-backend-production.up.railway.app";

// Expanded niches
const NICHES = [
  { value: "facts", label: "📚 Facts", icon: "📚" },
  { value: "motivation", label: "🔥 Motivation", icon: "🔥" },
  { value: "reddit_stories", label: "📖 Reddit Stories", icon: "📖" },
  { value: "ai_stories", label: "🤖 AI Stories", icon: "🤖" },
  { value: "history", label: "🏛️ History", icon: "🏛️" },
  { value: "heartbreak", label: "💔 Heartbreak", icon: "💔" },
  { value: "business", label: "💼 Business", icon: "💼" },
  { value: "fitness", label: "💪 Fitness", icon: "💪" },
];

// Video styles with emojis
const VIDEO_STYLES = [
  { value: "gameplay", label: "Gameplay", emoji: "🎮", desc: "Gaming clips" },
  { value: "satisfying", label: "Satisfying", emoji: "🧼", desc: "ASMR style" },
  { value: "subway", label: "Subway Surfers", emoji: "🚇", desc: "Mobile gameplay" },
  { value: "minecraft", label: "Minecraft", emoji: "⛏️", desc: "Parkour/builds" },
  { value: "cinematic", label: "Cinematic", emoji: "🎬", desc: "Stock footage" },
];

// Voice options (user-friendly)
const VOICES = [
  { value: "male_deep", label: "Male Deep", desc: "Powerful & bold" },
  { value: "male_calm", label: "Male Calm", desc: "Smooth & relaxing" },
  { value: "female_energetic", label: "Female Energetic", desc: "Upbeat & lively" },
  { value: "female_soft", label: "Female Soft", desc: "Gentle & soothing" },
];

// Languages
const LANGUAGES = [
  { value: "english", label: "English", flag: "🇺🇸" },
  { value: "hindi", label: "Hindi", flag: "🇮🇳" },
  { value: "hinglish", label: "Hinglish", flag: "🇮🇳" },
];

// Durations
const DURATIONS = [
  { value: "15-30", label: "15-30 sec", desc: "Quick shorts" },
  { value: "30-60", label: "30-60 sec", desc: "Standard", default: true },
  { value: "60-90", label: "60-90 sec", desc: "Longer content" },
];

// Frequencies
const FREQUENCIES = [
  { value: "daily", label: "Daily", desc: "Every day" },
  { value: "alternate", label: "Alternate Days", desc: "Every 2 days" },
];

function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "default";
  let userId = localStorage.getItem("user_id");
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("user_id", userId);
  }
  return userId;
}

export default function Dashboard() {
  const [userId, setUserId] = useState("default");
  const [loading, setLoading] = useState(true);
  
  // Step 1: YouTube Connection
  const [youtubeConnected, setYoutubeConnected] = useState(false);
  const [channelName, setChannelName] = useState("");
  
  // Step 2: Content Input
  const [contentMode, setContentMode] = useState<"auto" | "custom">("auto");
  const [niche, setNiche] = useState("facts");
  const [customTopic, setCustomTopic] = useState("");
  
  // Step 3: Video Style
  const [videoStyle, setVideoStyle] = useState("gameplay");
  
  // Step 4: Voice Selection
  const [voice, setVoice] = useState("male_deep");
  
  // Step 5: Language
  const [language, setLanguage] = useState("english");
  
  // Step 6: Duration
  const [duration, setDuration] = useState("30-60");
  
  // Step 7: Posting Schedule
  const [postTime, setPostTime] = useState("18:30");
  const [frequency, setFrequency] = useState("daily");
  const [autoPostEnabled, setAutoPostEnabled] = useState(false);
  
  // Step 8: Preview
  const [preview, setPreview] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  
  // Action states
  const [saving, setSaving] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState(1); // For step-by-step UI

  useEffect(() => {
    const uid = getOrCreateUserId();
    setUserId(uid);
    loadStatus(uid);
  }, []);

  const loadStatus = async (uid: string) => {
    try {
      // Check YouTube auth status
      const authRes = await fetch(`${BACKEND_URL}/auth/status?user_id=${uid}`);
      const authData = await authRes.json();
      setYoutubeConnected(authData.connected);
      if (authData.channel_name) setChannelName(authData.channel_name);
      
      // Load series settings (new endpoint)
      const seriesRes = await fetch(`${BACKEND_URL}/series/${uid}`);
      if (seriesRes.ok) {
        const seriesData = await seriesRes.json();
        const s = seriesData.settings || {};
        setNiche(s.niche || "facts");
        setContentMode(s.content_mode || "auto");
        setCustomTopic(s.topic || "");
        setVideoStyle(s.video_style || "gameplay");
        setVoice(s.voice || "male_deep");
        setLanguage(s.language || "english");
        setDuration(s.duration || "30-60");
        setFrequency(s.frequency || "daily");
        setAutoPostEnabled(s.enabled || false);
        if (s.hour !== undefined && s.minute !== undefined) {
          setPostTime(`${s.hour.toString().padStart(2, "0")}:${s.minute.toString().padStart(2, "0")}`);
        }
      }
    } catch (err) {
      console.error("Failed to load status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectYouTube = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/connect?user_id=${userId}`);
      const data = await res.json();
      if (data.auth_url) {
        window.location.href = data.auth_url;
      }
    } catch (err) {
      setMessage("Failed to start YouTube auth");
    }
  };

  const handleGeneratePreview = async () => {
    setPreviewLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche,
          topic: contentMode === "custom" ? customTopic : null,
          voice,
          language
        })
      });
      const data = await res.json();
      setPreview(data);
    } catch (err) {
      console.error("Preview failed:", err);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleCreateSeries = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/series`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          enabled: autoPostEnabled,
          niche,
          content_mode: contentMode,
          topic: contentMode === "custom" ? customTopic : null,
          video_style: videoStyle,
          voice,
          language,
          duration,
          post_time: postTime,
          frequency
        })
      });
      const data = await res.json();
      setMessage("🎉 Series created successfully! Videos will auto-post.");
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setMessage("Failed to create series");
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerCron = async () => {
    setTriggering(true);
    try {
      const res = await fetch(`${BACKEND_URL}/cron/run`);
      const data = await res.json();
      setMessage(`Cron triggered! ${data.triggered?.length || 0} jobs started`);
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setMessage("Cron trigger failed");
    } finally {
      setTriggering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <main className="pt-24 pb-12 px-6">
          <div className="max-w-4xl mx-auto text-center text-zinc-400">
            Loading dashboard...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Series</h1>
            <p className="text-zinc-400">Automated YouTube Shorts with AI</p>
          </div>

          {/* Message */}
          {message && (
            <div className="mb-6 p-4 bg-green-600/20 border border-green-600 rounded-xl text-green-400">
              {message}
            </div>
          )}

          {/* Step Indicators */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
              <button
                key={step}
                onClick={() => setActiveTab(step)}
                className={`flex-shrink-0 w-10 h-10 rounded-full font-semibold transition-colors ${
                  activeTab === step
                    ? "bg-green-500 text-white"
                    : activeTab > step
                    ? "bg-green-500/20 text-green-400"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {activeTab > step ? "✓" : step}
              </button>
            ))}
          </div>

          {/* STEP 1: YouTube Connect */}
          {activeTab === 1 && (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
              <h2 className="text-xl font-semibold text-white mb-4">Step 1: Connect YouTube</h2>
              
              {youtubeConnected ? (
                <div className="bg-green-500/10 border border-green-500 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">
                      ✅
                    </div>
                    <div>
                      <p className="text-white font-medium">YouTube Connected</p>
                      <p className="text-zinc-400 text-sm">{channelName || "Your Channel"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-800 rounded-lg p-6 mb-6">
                  <p className="text-zinc-400 mb-4">Connect your YouTube channel to start auto-posting</p>
                </div>
              )}
              
              <button
                onClick={handleConnectYouTube}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                {youtubeConnected ? "Reconnect YouTube" : "Connect YouTube"}
              </button>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setActiveTab(2)}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Content Input */}
          {activeTab === 2 && (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
              <h2 className="text-xl font-semibold text-white mb-6">Step 2: Content Input</h2>
              
              {/* Toggle: Auto vs Custom */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setContentMode("auto")}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    contentMode === "auto"
                      ? "bg-green-500 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  🎲 Auto Topic
                </button>
                <button
                  onClick={() => setContentMode("custom")}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    contentMode === "custom"
                      ? "bg-green-500 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  ✏️ Custom Topic
                </button>
              </div>

              {/* Niche Selection (Auto Mode) */}
              {contentMode === "auto" && (
                <div className="mb-6">
                  <label className="text-zinc-400 text-sm block mb-3">Select Niche</label>
                  <div className="grid grid-cols-2 gap-3">
                    {NICHES.map((n) => (
                      <button
                        key={n.value}
                        onClick={() => setNiche(n.value)}
                        className={`p-4 rounded-lg border transition-all text-left ${
                          niche === n.value
                            ? "border-green-500 bg-green-500/10"
                            : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                        }`}
                      >
                        <div className="text-2xl mb-1">{n.icon}</div>
                        <div className="text-white font-medium">{n.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Topic Input */}
              {contentMode === "custom" && (
                <div className="mb-6">
                  <label className="text-zinc-400 text-sm block mb-2">Enter Your Topic</label>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="e.g., Space exploration mysteries"
                    className="w-full bg-zinc-800 text-white px-4 py-3 rounded-lg border border-zinc-700 focus:border-green-500 outline-none"
                  />
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setActiveTab(1)}
                  className="px-6 py-2 text-zinc-400 hover:text-white"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setActiveTab(3)}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Video Style */}
          {activeTab === 3 && (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
              <h2 className="text-xl font-semibold text-white mb-4">Step 3: Video Style</h2>
              <p className="text-zinc-400 mb-6">Choose your background video style</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {VIDEO_STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setVideoStyle(style.value)}
                    className={`p-5 rounded-xl border-2 transition-all text-left ${
                      videoStyle === style.value
                        ? "border-green-500 bg-green-500/10"
                        : "border-zinc-700 bg-zinc-800 hover:border-zinc-500"
                    }`}
                  >
                    <div className="text-3xl mb-2">{style.emoji}</div>
                    <div className="text-white font-semibold">{style.label}</div>
                    <div className="text-zinc-400 text-sm">{style.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setActiveTab(2)}
                  className="px-6 py-2 text-zinc-400 hover:text-white"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setActiveTab(4)}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Voice Selection */}
          {activeTab === 4 && (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
              <h2 className="text-xl font-semibold text-white mb-4">Step 4: Voice Selection</h2>
              <p className="text-zinc-400 mb-6">Choose your narrator voice</p>
              
              <div className="grid grid-cols-2 gap-4">
                {VOICES.map((v) => (
                  <button
                    key={v.value}
                    onClick={() => setVoice(v.value)}
                    className={`p-5 rounded-xl border-2 transition-all ${
                      voice === v.value
                        ? "border-green-500 bg-green-500/10"
                        : "border-zinc-700 bg-zinc-800 hover:border-zinc-500"
                    }`}
                  >
                    <div className="text-white font-semibold mb-1">{v.label}</div>
                    <div className="text-zinc-400 text-sm">{v.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setActiveTab(3)}
                  className="px-6 py-2 text-zinc-400 hover:text-white"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setActiveTab(5)}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Language */}
          {activeTab === 5 && (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
              <h2 className="text-xl font-semibold text-white mb-4">Step 5: Language</h2>
              <p className="text-zinc-400 mb-6">Select content language</p>
              
              <div className="flex gap-4">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => setLanguage(lang.value)}
                    className={`flex-1 p-5 rounded-xl border-2 transition-all ${
                      language === lang.value
                        ? "border-green-500 bg-green-500/10"
                        : "border-zinc-700 bg-zinc-800 hover:border-zinc-500"
                    }`}
                  >
                    <div className="text-3xl mb-2">{lang.flag}</div>
                    <div className="text-white font-semibold">{lang.label}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setActiveTab(4)}
                  className="px-6 py-2 text-zinc-400 hover:text-white"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setActiveTab(6)}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Duration */}
          {activeTab === 6 && (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
              <h2 className="text-xl font-semibold text-white mb-4">Step 6: Duration</h2>
              <p className="text-zinc-400 mb-6">Video length preference</p>
              
              <div className="flex gap-4">
                {DURATIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDuration(d.value)}
                    className={`flex-1 p-5 rounded-xl border-2 transition-all ${
                      duration === d.value
                        ? "border-green-500 bg-green-500/10"
                        : "border-zinc-700 bg-zinc-800 hover:border-zinc-500"
                    }`}
                  >
                    <div className="text-white font-semibold mb-1">{d.label}</div>
                    <div className="text-zinc-400 text-sm">{d.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setActiveTab(5)}
                  className="px-6 py-2 text-zinc-400 hover:text-white"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setActiveTab(7)}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: Posting Schedule */}
          {activeTab === 7 && (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
              <h2 className="text-xl font-semibold text-white mb-4">Step 7: Posting Schedule</h2>
              
              {/* Enable Toggle */}
              <div className="flex items-center justify-between mb-6 p-4 bg-zinc-800 rounded-lg">
                <span className="text-white font-medium">Enable Auto-Posting</span>
                <button
                  onClick={() => setAutoPostEnabled(!autoPostEnabled)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    autoPostEnabled ? "bg-green-500" : "bg-zinc-600"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      autoPostEnabled ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {autoPostEnabled && (
                <div className="space-y-6">
                  {/* Post Time */}
                  <div>
                    <label className="text-zinc-400 text-sm block mb-2">Post Time (IST)</label>
                    <input
                      type="time"
                      value={postTime}
                      onChange={(e) => setPostTime(e.target.value)}
                      className="w-full bg-zinc-800 text-white px-4 py-3 rounded-lg border border-zinc-700 focus:border-green-500 outline-none"
                    />
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="text-zinc-400 text-sm block mb-2">Posting Frequency</label>
                    <div className="flex gap-4">
                      {FREQUENCIES.map((f) => (
                        <button
                          key={f.value}
                          onClick={() => setFrequency(f.value)}
                          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                            frequency === f.value
                              ? "border-green-500 bg-green-500/10"
                              : "border-zinc-700 bg-zinc-800"
                          }`}
                        >
                          <div className="text-white font-medium">{f.label}</div>
                          <div className="text-zinc-400 text-sm">{f.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setActiveTab(6)}
                  className="px-6 py-2 text-zinc-400 hover:text-white"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setActiveTab(8)}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: Preview & Create */}
          {activeTab === 8 && (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
              <h2 className="text-xl font-semibold text-white mb-4">Step 8: Preview & Create</h2>
              
              {/* Summary */}
              <div className="bg-zinc-800 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">Your Configuration</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-zinc-400">Niche:</div>
                  <div className="text-white capitalize">{contentMode === "custom" ? "Custom" : niche.replace("_", " ")}</div>
                  <div className="text-zinc-400">Video Style:</div>
                  <div className="text-white capitalize">{videoStyle}</div>
                  <div className="text-zinc-400">Voice:</div>
                  <div className="text-white capitalize">{voice.replace("_", " ")}</div>
                  <div className="text-zinc-400">Language:</div>
                  <div className="text-white capitalize">{language}</div>
                  <div className="text-zinc-400">Duration:</div>
                  <div className="text-white">{duration}</div>
                  <div className="text-zinc-400">Schedule:</div>
                  <div className="text-white">{autoPostEnabled ? `${postTime} (${frequency})` : "Manual"}</div>
                </div>
              </div>

              {/* Preview Button */}
              <button
                onClick={handleGeneratePreview}
                disabled={previewLoading}
                className="w-full py-3 mb-4 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 text-white rounded-lg font-medium transition-colors"
              >
                {previewLoading ? "Generating Preview..." : "👁️ Generate Preview"}
              </button>

              {/* Preview Content */}
              {preview && (
                <div className="bg-zinc-800 rounded-lg p-4 mb-6">
                  <h4 className="text-green-400 font-medium mb-2">Sample Script</h4>
                  <p className="text-white text-sm mb-4">{preview.script}</p>
                  <h4 className="text-green-400 font-medium mb-2">Sample Captions</h4>
                  <div className="space-y-1">
                    {preview.sample_captions?.map((cap: any, i: number) => (
                      <div key={i} className="text-zinc-300 text-sm">
                        {cap.start}s - {cap.end}s: "{cap.text}"
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Create Series Button */}
              <button
                onClick={handleCreateSeries}
                disabled={saving}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02]"
              >
                {saving ? "Creating Series..." : "🚀 CREATE SERIES"}
              </button>

              <div className="flex justify-start mt-6">
                <button
                  onClick={() => setActiveTab(7)}
                  className="px-6 py-2 text-zinc-400 hover:text-white"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* Debug: Manual Trigger */}
          <div className="mt-8 bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-4">
            <h3 className="text-zinc-500 text-sm font-medium mb-2">Debug Tools</h3>
            <button
              onClick={handleTriggerCron}
              disabled={triggering}
              className="text-sm px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded transition-colors"
            >
              {triggering ? "Triggering..." : "Trigger Cron Now"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
