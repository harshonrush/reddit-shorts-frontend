"use client";

import { useState } from "react";

interface PostingScheduleProps {
  initialTime?: string;
  onChange?: (time: string) => void;
}

export default function PostingSchedule({ initialTime = "09:00", onChange }: PostingScheduleProps) {
  const [time, setTime] = useState(initialTime);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    onChange?.(newTime);
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Posting Schedule</h3>
      <div className="space-y-2">
        <label className="text-zinc-400 text-sm">Daily Upload Time</label>
        <input
          type="time"
          value={time}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-700"
        />
      </div>
    </div>
  );
}
