"use client";

import { useState, useEffect } from "react";

const BACKEND_URL = "https://reddit-shorts-backend-production.up.railway.app";

function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "default";
  let userId = localStorage.getItem("user_id");
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("user_id", userId);
  }
  return userId;
}

export default function YouTubeConnect() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("default");

  // Check auth status on mount
  useEffect(() => {
    const uid = getOrCreateUserId();
    setUserId(uid);
    checkStatus(uid);
    
    // Check for user_id in URL (after OAuth callback)
    const params = new URLSearchParams(window.location.search);
    const urlUserId = params.get("user_id");
    if (urlUserId) {
      localStorage.setItem("user_id", urlUserId);
      setUserId(urlUserId);
      checkStatus(urlUserId);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const checkStatus = async (uid: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/status?user_id=${uid}`);
      const data = await res.json();
      setConnected(data.connected);
    } catch (err) {
      console.error("Failed to check status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    // Get auth URL from backend with user_id
    const res = await fetch(`${BACKEND_URL}/auth/connect?user_id=${userId}`);
    const data = await res.json();
    if (data.auth_url) {
      window.location.href = data.auth_url;
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">YouTube</h3>
        <div className="text-zinc-400">Checking connection...</div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">YouTube</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
            connected ? "bg-green-600" : "bg-red-600"
          }`}>
            YT
          </div>
          <div>
            <p className="text-white font-medium">
              {connected ? "Connected" : "Not Connected"}
            </p>
            <p className="text-zinc-400 text-sm">
              {connected 
                ? "Ready to upload videos" 
                : "Link your YouTube account to upload"}
            </p>
          </div>
        </div>
        <button
          onClick={handleConnect}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            connected
              ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {connected ? "Disconnect" : "Connect"}
        </button>
      </div>
    </div>
  );
}
