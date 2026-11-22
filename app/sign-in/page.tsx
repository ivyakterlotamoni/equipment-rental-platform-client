
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg sm:p-10">
        <Link href="/" className="text-3xl font-extrabold text-slate-900">
          Equip<span className="text-blue-600">Rent</span>
        </Link>

        <div className="mt-8">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Welcome Back
          </h1>
          <p className="mt-3 mb-4 text-xs leading-5 text-slate-500">
            Sign in to your Equipment Rental account.
          </p>
        </div>

        <form className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white transition hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>

        <div className="mt-10 border-t border-slate-100 pt-8 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="font-bold text-blue-600 hover:text-blue-700"
            >
              Create Account
            </Link>
          </p>

          <Link
            href="/"
            className="mt-5 inline-block text-sm text-slate-500 hover:text-blue-600"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
