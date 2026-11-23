
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

type Equipment = {
  _id: string;
  name: string;
  description?: string;
  category: string;
  location: string;
  rentalPrice: number;
  rentalType: string;
  quantity: number;
  condition: string;
  image: string;
  ownerId: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
};

export default function AdminEquipmentPage() {
  const { data: session, isPending } = authClient.useSession();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const userRole = (
    session?.user as { role?: string } | undefined
  )?.role;

  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    return data.token;
  };

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      const response = await fetch(`${API_URL}/api/admin/equipment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load equipment.");
      }

      setEquipment(result.data || []);
      console.log("EQUIPMENT DATA:", result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isPending && session && userRole === "admin") {
      fetchEquipment();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [isPending, session, userRole, fetchEquipment]);

  const updateStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setUpdatingId(id);
      setError("");
      setMessage("");

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/equipment/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update equipment.");
      }

      setMessage(`Equipment ${status} successfully.`);
      await fetchEquipment();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setUpdatingId("");
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-semibold text-slate-600">
          Loading equipment...
        </p>
      </div>
    );
  }

  if (!session || userRole !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <Link href="/" className="rounded-lg bg-blue-600 px-5 py-2 text-white">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard/admin"
              className="mb-3 inline-block text-sm font-semibold text-blue-600 hover:underline"
            >
              ← Back to Admin Dashboard
            </Link>

            <h1 className="text-3xl font-extrabold text-slate-900">
              Manage Equipment
            </h1>

            <p className="mt-2 text-slate-500">
              Review and manage all equipment listings.
            </p>
          </div>

          <button
            onClick={fetchEquipment}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {message}
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Equipment</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {equipment.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Pending Approval</p>
            <p className="mt-2 text-2xl font-bold text-amber-600">
              {equipment.filter((item) => item.status === "pending").length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Approved</p>
            <p className="mt-2 text-2xl font-bold text-green-600">
              {equipment.filter((item) => item.status === "approved").length}
            </p>
          </div>
        </div>

        {equipment.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">
              No Equipment Found
            </h2>
            <p className="mt-2 text-slate-500">
              There are currently no equipment listings.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {equipment.map((item) => (
              <div
                key={item._id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                <div className="h-52 bg-slate-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      {item.name}
                    </h2>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        item.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : item.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="mb-3 text-sm text-slate-500">
                    {item.description || "No description available."}
                  </p>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p><strong>Category:</strong> {item.category}</p>
                    <p><strong>Location:</strong> {item.location}</p>
                    <p>
                      <strong>Rental Price:</strong> ৳
                      {item.rentalPrice} / {item.rentalType}
                    </p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Condition:</strong> {item.condition}</p>
                    <p className="break-all">
                      <strong>Owner ID:</strong> {item.ownerId}
                    </p>
                  </div>

                  {item.status === "pending" && (
                    <div className="mt-5 flex gap-3">
                      <button
                        disabled={updatingId === item._id}
                        onClick={() => updateStatus(item._id, "approved")}
                        className="flex-1 rounded-lg bg-green-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        {updatingId === item._id ? "Updating..." : "Approve"}
                      </button>

                      <button
                        disabled={updatingId === item._id}
                        onClick={() => updateStatus(item._id, "rejected")}
                        className="flex-1 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {updatingId === item._id ? "Updating..." : "Reject"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
