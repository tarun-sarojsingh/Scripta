import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f9f9fb] dark:bg-[#141517] text-zinc-900 dark:text-zinc-100 font-sans">
      <div className="max-w-md text-center space-y-4">
        <div className="text-4xl font-bold tracking-tight text-zinc-400 dark:text-zinc-600">404</div>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Page Not Found</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium hover:opacity-90 transition"
          >
            Return to Studio
          </Link>
        </div>
      </div>
    </div>
  );
}
