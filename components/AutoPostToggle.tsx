"use client";

import { useState, useEffect } from "react";

const BACKEND_URL = "https://reddit-shorts-backend-production.up.railway.app";

function getUserId(): string {
  if (typeof window === "undefined") return "default";
  return localStorage.getItem("user_id") || "default";
}

const NICHES = [
  { value: "heartbreak", label: "Heartbreak" },
  { value: "motivation", label: "Motivation" },
  { value: "business", label: "Business" },
  { value: "fitness", label: "Fitness" },
  { value: "stories", label: "Stories" },
];

export default function AutoPostToggle() {
  const [enabled, setEnabled] = useState(false);
  const [hour, setHour] = useState(18);
  const [minute, setMinute] = useState(0);
  const [niche, setNiche] = useState("stories");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userId = getUserId();
      const res = await fetch(`${BACKEND_URL}/settings/auto-post?user_id=${userId}`);
      const data = await res.json();
      setEnabled(data.enabled || false);
      setHour(data.hour || 18);
      setMinute(data.minute || 0);
      setNiche(data.niche || "stories");
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const userId = getUserId();
      const res = await fetch(
        `${BACKEND_URL}/settings/auto-post?enabled=${enabled}&hour=${hour}&minute=${minute}&user_id=${userId}&niche=${niche}`,
        { method: "POST" }
      );
      const data = await res.json();
      console.log("Settings saved:", data);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    // Auto-save on toggle
    setTimeout(() => handleSave(), 100);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [h, m] = e.target.value.split(":").map(Number);
    setHour(h);
    setMinute(m);
  };

  if (loading) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-white font-medium block">Auto Upload Daily</span>
          <span className="text-zinc-400 text-sm">
            {enabled ? `Posts every day at ${hour}:${minute.toString().padStart(2, "0")}` : "Disabled"}
          </span>
        </div>
        <button
          onClick={handleToggle}
          disabled={saving}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            enabled ? "bg-green-500" : "bg-zinc-700"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              enabled ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <label className="text-zinc-400 text-sm">Time:</label>
            <input
              type="time"
              value={`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`}
              onChange={handleTimeChange}
              onBlur={handleSave}
              className="bg-zinc-800 text-white px-3 py-1 rounded border border-zinc-700 focus:border-green-500 outline-none"
            />
            {saving && <span className="text-zinc-500 text-sm">Saving...</span>}
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-zinc-400 text-sm">Niche:</label>
            <select
              value={niche}
              onChange={(e) => {
                setNiche(e.target.value);
                setTimeout(() => handleSave(), 100);
              }}
              className="bg-zinc-800 text-white px-3 py-1 rounded border border-zinc-700 focus:border-green-500 outline-none"
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
    </div>
  );
}
