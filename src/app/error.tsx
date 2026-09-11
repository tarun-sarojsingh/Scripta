'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f9f9fb] dark:bg-[#141517] text-zinc-900 dark:text-zinc-100 font-sans">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Something went wrong</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          An unexpected error occurred while rendering the studio. Your typed text is preserved in memory.
        </p>
        <div>
          <button
            onClick={() => reset()}
            className="inline-flex items-center px-4 py-2 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium hover:opacity-90 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
