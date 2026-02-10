import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-8 shadow-sm text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Unauthorized</h1>
        <p className="text-gray-600 mt-3">
          You do not have permission to access this page.
        </p>
        <Link
          href="/signin"
          className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Go to Sign In
        </Link>
      </div>
    </div>
  );
}
