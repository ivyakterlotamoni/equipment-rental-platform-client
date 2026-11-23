
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

type Overview = {
  totalUsers: number;
  totalEquipment: number;
  pendingEquipment: number;
  approvedEquipment: number;
  totalBookings: number;
  pendingBookings: number;
  totalPayments: number;
  paidPayments: number;
  totalRevenue: number;
};

const initialOverview: Overview = {
  totalUsers: 0,
  totalEquipment: 0,
  pendingEquipment: 0,
  approvedEquipment: 0,
  totalBookings: 0,
  pendingBookings: 0,
  totalPayments: 0,
  paidPayments: 0,
  totalRevenue: 0,
};

export default function AdminDashboard() {
  const { data: session, isPending } = authClient.useSession();

  const [overview, setOverview] = useState<Overview>(initialOverview);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userRole = (
    session?.user as { role?: string } | undefined
  )?.role;

  useEffect(() => {
    if (isPending) return;

    if (!session || userRole !== "admin") {
      setLoading(false);
      return;
    }

    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError("");
        const { data: tokenData, error: tokenError } =
  await authClient.token();

if (tokenError || !tokenData?.token) {
  throw new Error("Unable to get authentication token. Please login again.");
}

const response = await fetch(
  `${API_URL}/api/admin/overview`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenData.token}`,
      "Content-Type": "application/json",
    },
  }
);

        
         

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load dashboard");
        }

        setOverview(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [session, isPending, userRole]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold text-slate-600">
          Loading Admin Dashboard...
        </p>
      </div>
    );
  }

  if (!session || userRole !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-red-600">
          Access Denied
        </h1>
        <p className="text-slate-600">
          Only administrators can access this page.
        </p>
        <Link href="/" className="rounded-lg bg-blue-600 px-5 py-2 text-white">
          Go Home
        </Link>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: overview.totalUsers,
      color: "bg-blue-50 text-blue-700",
      icon: "👥",
    },
    {
      title: "Total Equipment",
      value: overview.totalEquipment,
      color: "bg-purple-50 text-purple-700",
      icon: "⚙️",
    },
    {
      title: "Pending Equipment",
      value: overview.pendingEquipment,
      color: "bg-amber-50 text-amber-700",
      icon: "⏳",
    },
    {
      title: "Approved Equipment",
      value: overview.approvedEquipment,
      color: "bg-green-50 text-green-700",
      icon: "✓",
    },
    {
      title: "Total Bookings",
      value: overview.totalBookings,
      color: "bg-indigo-50 text-indigo-700",
      icon: "📋",
    },
    {
      title: "Pending Bookings",
      value: overview.pendingBookings,
      color: "bg-orange-50 text-orange-700",
      icon: "🕒",
    },
    {
      title: "Total Payments",
      value: overview.totalPayments,
      color: "bg-pink-50 text-pink-700",
      icon: "💳",
    },
    {
      title: "Paid Payments",
      value: overview.paidPayments,
      color: "bg-teal-50 text-teal-700",
      icon: "✓",
    },
  ];

  const adminLinks = [
    {
      title: "Manage Equipment",
      description: "Review, approve or reject equipment listings.",
      href: "/dashboard/admin/equipment",
      icon: "⚙️",
    },
    {
      title: "Manage Bookings",
      description: "View and manage all customer bookings.",
      href: "/dashboard/admin/bookings",
      icon: "📋",
    },
    {
      title: "Payment History",
      description: "View payment records and transactions.",
      href: "/dashboard/admin/payments",
      icon: "💳",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-purple-600">
              Administration
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-slate-500">
              Welcome, {session.user.name}. Manage your rental platform.
            </p>
          </div>

          <Link
            href="/"
            className="w-fit rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Visit Website
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-semibold">Could not load dashboard data.</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        <section className="mb-10">
          <h2 className="mb-5 text-xl font-bold text-slate-800">
            Platform Overview
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>
                  <span className={`rounded-xl px-3 py-2 text-xl ${stat.color}`}>
                    {stat.icon}
                  </span>
                </div>

                <p className="text-3xl font-extrabold text-slate-900">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Total Revenue
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-green-600">
            ৳{overview.totalRevenue.toLocaleString()}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Revenue from successful payments
          </p>
        </section>

        <section>
          <h2 className="mb-5 text-xl font-bold text-slate-800">
            Management
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            {adminLinks.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-4 text-lg font-bold text-slate-800 group-hover:text-blue-600">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
                <p className="mt-4 font-semibold text-blue-600">
                  Manage Now →
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
