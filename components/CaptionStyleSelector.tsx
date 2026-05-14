"use client";

import { useState } from "react";

interface CaptionStyleSelectorProps {
  value: "viral" | "word-by-word";
  onChange: (value: "viral" | "word-by-word") => void;
}

export default function CaptionStyleSelector({
  value,
  onChange,
}: CaptionStyleSelectorProps) {
  const styles = [
    {
      id: "viral",
      label: "Viral Line-by-Line",
      icon: "🎬",
      description: "Classic viral caption style",
      features: ["Line animations", "High readability", "Quick impact"],
      badge: "Standard",
    },
    {
      id: "word-by-word",
      label: "Word-by-Word Animation",
      icon: "✨",
      description: "Premium smooth word reveals",
      features: ["Word animations", "Cinematic feel", "Maximum engagement"],
      badge: "Premium",
    },
  ];

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-white mb-4">
        Caption Animation Style
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => onChange(style.id as "viral" | "word-by-word")}
            className={`relative p-4 rounded-lg border-2 transition-all text-left ${
              value === style.id
                ? "border-blue-500 bg-blue-500/10"
                : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
            }`}
          >
            <div className="absolute top-2 right-2">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                value === style.id
                  ? "bg-blue-500/30 text-blue-200"
                  : "bg-zinc-700 text-zinc-300"
              }`}>
                {style.badge}
              </span>
            </div>

            <div className="flex items-start gap-3 mb-2">
              <span className="text-2xl">{style.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-white">{style.label}</h4>
                <p className="text-xs text-zinc-400 mt-1">{style.description}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-zinc-700">
              <ul className="space-y-1">
                {style.features.map((feature) => (
                  <li key={feature} className="text-xs text-zinc-400 flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
