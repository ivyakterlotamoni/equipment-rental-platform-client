
"use client";
import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "../../../../lib/auth-client";

type Equipment = {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  rentalPrice: number;
  rentalType: string;
  quantity: number;
  condition: string;
  image: string;
  status: string;
  availability: boolean;
};

export default function MyEquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadEquipment = async () => {
    try {
      setLoading(true);

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
       `${API_URL}/api/equipment/my-equipment`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load equipment.");
      }

      setEquipment(result.data || []);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this equipment?"
    );

    if (!confirmed) return;

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/api/equipment/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Delete failed.");
      }

      setEquipment((previous) =>
        previous.filter((item) => item._id !== id)
      );

      setMessage("Equipment deleted successfully!");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Delete failed."
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-blue-600">OWNER DASHBOARD</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              My Equipment
            </h1>
            <p className="mt-2 text-slate-500">
              Manage all your listed rental equipment.
            </p>
          </div>

          <Link
            href="/dashboard/owner/add-equipment"
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Add Equipment
          </Link>
        </div>

        {message && (
          <div className="mb-5 rounded-lg bg-blue-50 p-4 text-blue-800">
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center text-slate-600">
            Loading your equipment...
          </div>
        ) : equipment.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center">
            <h2 className="text-xl font-bold text-slate-800">
              No Equipment Found
            </h2>
            <p className="mt-2 text-slate-500">
              You have not added any equipment yet.
            </p>
            <Link
              href="/dashboard/owner/add-equipment"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
            >
              Add Your First Equipment
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-5 rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Listed Equipment</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {equipment.length}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {equipment.map((item) => (
                <div
                  key={item._id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-52 w-full object-cover"
                  />

                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {item.category}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : item.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900">
                      {item.name}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                      {item.description}
                    </p>

                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p>Location: {item.location}</p>
                      <p>Condition: {item.condition}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>
                        Price: ৳{item.rentalPrice} / {item.rentalType}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="mt-5 w-full rounded-lg border border-red-200 px-4 py-2.5 font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete Equipment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
