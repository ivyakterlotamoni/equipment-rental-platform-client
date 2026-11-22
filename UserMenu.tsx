
"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "./lib/auth-client";

export default function UserMenu() {
  const { data: session, isPending } = authClient.useSession();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        console.error("Logout failed:", error.message);
        setLoggingOut(false);
        return;
      }

      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  if (isPending) {
    return <span className="text-slate-700">Loading...</span>;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-3">
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
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-4">
      <div className="text-right">
        <p className="font-semibold text-slate-900">
          {session.user.name || "My Account"}
        </p>

        <p className="text-xs text-slate-600">
          {session.user.email}
        </p>
      </div>

      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
