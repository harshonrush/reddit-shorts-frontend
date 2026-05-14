"use client";

interface GenerationStep {
  name: string;
  status: "pending" | "processing" | "completed" | "failed";
  emoji: string;
  details?: string;
}

interface EnhancedUploadStatusProps {
  isProcessing: boolean;
  steps: GenerationStep[];
  error?: string | null;
}

export default function EnhancedUploadStatus({
  isProcessing,
  steps,
  error,
}: EnhancedUploadStatusProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✅";
      case "processing":
        return "⏳";
      case "failed":
        return "❌";
      default:
        return "⭕";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 border-green-500/30";
      case "processing":
        return "bg-blue-500/10 border-blue-500/30";
      case "failed":
        return "bg-red-500/10 border-red-500/30";
      default:
        return "bg-zinc-800/30 border-zinc-700";
    }
  };

  const getTextColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-300";
      case "processing":
        return "text-blue-300";
      case "failed":
        return "text-red-300";
      default:
        return "text-zinc-400";
    }
  };

  if (!isProcessing && steps.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-zinc-900 rounded-lg border border-zinc-800 p-4 space-y-3">
      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
        {isProcessing && (
          <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        )}
        Generation Status
      </h4>

      <div className="space-y-2">
        {steps.map((step, idx) => (
          <div key={idx} className={`rounded-lg border p-3 ${getStatusColor(step.status)}`}>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">
                {getStatusIcon(step.status)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`text-sm font-medium ${getTextColor(step.status)}`}>
                    {step.emoji} {step.name}
                  </p>
                  {step.status === "processing" && (
                    <span className="text-xs bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full">
                      In Progress
                    </span>
                  )}
                  {step.status === "completed" && (
                    <span className="text-xs bg-green-500/30 text-green-200 px-2 py-0.5 rounded-full">
                      Done
                    </span>
                  )}
                </div>
                {step.details && (
                  <p className="text-xs text-zinc-400 mt-1 truncate">
                    {step.details}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-xs font-semibold text-red-300 mb-1">Error</p>
          <p className="text-xs text-red-200">{error}</p>
        </div>
      )}

      {/* Completed Message */}
      {!isProcessing && steps.every((s) => s.status === "completed") && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <p className="text-xs font-semibold text-green-300">
            🎉 Video generation complete!
          </p>
        </div>
      )}
    </div>
  );
}
