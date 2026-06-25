export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="max-w-md text-center p-6">
        <h1 className="text-3xl font-semibold mb-4">Page not found</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}
