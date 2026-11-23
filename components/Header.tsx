
"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function Header() {
  const { data: session, isPending } = authClient.useSession();

  const userRole = (
    session?.user as { role?: string } | undefined
  )?.role;

  const handleLogout = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        console.error("Logout failed:", error.message);
        return;
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">
            ⚙
          </div>

          <span className="text-xl font-extrabold">
            Equip<span className="text-blue-600">Rent</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/equipment" className="hover:text-blue-600">Equipment</Link>
          <Link href="/#categories" className="hover:text-blue-600">Categories</Link>
          <Link href="/#how-it-works" className="hover:text-blue-600">How It Works</Link>
        </div>

        <div className="flex items-center gap-3">
          {isPending ? (
            <span className="text-sm text-slate-500">Loading...</span>
          ) : session ? (
            <>
              <span className="hidden text-sm font-semibold text-slate-700 sm:inline">
                {session.user.name}
              </span>

              {userRole === "admin" && (
                <Link
                  href="/dashboard/admin"
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                >
                  Admin Dashboard
                </Link>
              )}

              {userRole === "owner" && (
                <Link
                  href="/dashboard/owner"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Dashboard
                </Link>
              )}

              {userRole === "customer" && (
                <Link
                  href="/dashboard/customer/my-rentals"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  My Rentals
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="font-semibold text-slate-800 hover:text-blue-600"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
