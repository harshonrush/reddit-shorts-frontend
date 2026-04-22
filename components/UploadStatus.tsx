"use client";

interface StatusCounts {
  pending: number;
  uploaded: number;
  failed: number;
}

const mockStatus: StatusCounts = {
  pending: 2,
  uploaded: 15,
  failed: 1,
};

export default function UploadStatus() {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Upload Status</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Pending</span>
          <span className="text-yellow-500 font-semibold">{mockStatus.pending}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Uploaded</span>
          <span className="text-green-500 font-semibold">{mockStatus.uploaded}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Failed</span>
          <span className="text-red-500 font-semibold">{mockStatus.failed}</span>
        </div>
      </div>
    </div>
  );
}
