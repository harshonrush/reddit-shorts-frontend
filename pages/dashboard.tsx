"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const BACKEND_URL = "https://reddit-shorts-backend-production.up.railway.app";

const NICHES = [
  { value: "stories", label: "Stories" },
  { value: "motivation", label: "Motivation" },
  { value: "heartbreak", label: "Heartbreak" },
  { value: "business", label: "Business" },
  { value: "fitness", label: "Fitness" },
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
  
  // Status states
  const [youtubeConnected, setYoutubeConnected] = useState(false);
  const [autoPostEnabled, setAutoPostEnabled] = useState(false);
  const [hour, setHour] = useState(18);
  const [minute, setMinute] = useState(0);
  const [niche, setNiche] = useState("stories");
  
  // Action states
  const [saving, setSaving] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [message, setMessage] = useState("");

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
      
      // Check auto-post settings
      const settingsRes = await fetch(`${BACKEND_URL}/settings/auto-post?user_id=${uid}`);
      const settingsData = await settingsRes.json();
      setAutoPostEnabled(settingsData.enabled || false);
      setHour(settingsData.hour || 18);
      setMinute(settingsData.minute || 0);
      setNiche(settingsData.niche || "stories");
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

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/settings/auto-post?enabled=${autoPostEnabled}&hour=${hour}&minute=${minute}&user_id=${userId}&niche=${niche}`,
        { method: "POST" }
      );
      const data = await res.json();
      setMessage("Settings saved!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to save settings");
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

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [h, m] = e.target.value.split(":").map(Number);
    setHour(h);
    setMinute(m);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <main className="pt-24 pb-12 px-6">
          <div className="max-w-2xl mx-auto text-center text-zinc-400">
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-zinc-400">Manage your YouTube auto-posting</p>
          </div>

          {/* Message */}
          {message && (
            <div className="mb-4 p-3 bg-green-600/20 border border-green-600 rounded-lg text-green-400 text-sm">
              {message}
            </div>
          )}

          {/* 1. YouTube Connect */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">YouTube Connection</h2>
                <p className="text-zinc-400 text-sm">
                  {youtubeConnected ? "✅ Connected" : "❌ Not connected"}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${youtubeConnected ? "bg-green-500" : "bg-red-500"}`} />
            </div>
            <button
              onClick={handleConnectYouTube}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              {youtubeConnected ? "Reconnect YouTube" : "Connect YouTube"}
            </button>
          </div>

          {/* 2. Auto-Post Settings */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Auto-Post Settings</h2>
            
            {/* Enable Toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-300">Enable Daily Posts</span>
              <button
                onClick={() => {
                  setAutoPostEnabled(!autoPostEnabled);
                  setTimeout(() => handleSaveSettings(), 100);
                }}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  autoPostEnabled ? "bg-green-500" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoPostEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Time & Niche (only when enabled) */}
            {autoPostEnabled && (
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <div>
                  <label className="text-zinc-400 text-sm block mb-2">Post Time</label>
                  <input
                    type="time"
                    value={`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`}
                    onChange={handleTimeChange}
                    onBlur={handleSaveSettings}
                    className="w-full bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-700 focus:border-green-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 text-sm block mb-2">Content Niche</label>
                  <select
                    value={niche}
                    onChange={(e) => {
                      setNiche(e.target.value);
                      setTimeout(() => handleSaveSettings(), 100);
                    }}
                    className="w-full bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-700 focus:border-green-500 outline-none"
                  >
                    {NICHES.map((n) => (
                      <option key={n.value} value={n.value}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {saving && <p className="text-zinc-500 text-sm mt-4">Saving...</p>}
          </div>

          {/* 3. Status Display */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Status</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">User ID:</span>
                <span className="text-zinc-300 font-mono">{userId.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">YouTube:</span>
                <span className={youtubeConnected ? "text-green-400" : "text-red-400"}>
                  {youtubeConnected ? "Connected" : "Not Connected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Auto-Post:</span>
                <span className={autoPostEnabled ? "text-green-400" : "text-zinc-500"}>
                  {autoPostEnabled ? `Enabled (${hour}:${minute.toString().padStart(2, "0")})` : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Niche:</span>
                <span className="text-zinc-300 capitalize">{niche}</span>
              </div>
            </div>
          </div>

          {/* 4. Manual Trigger */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-2">Debug Tools</h2>
            <p className="text-zinc-400 text-sm mb-4">Manually trigger cron job (runs for all users)</p>
            <button
              onClick={handleTriggerCron}
              disabled={triggering}
              className="w-full py-2 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 text-white rounded-lg font-medium transition-colors"
            >
              {triggering ? "Triggering..." : "Trigger Cron Now"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
