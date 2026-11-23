
"use client";

import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

interface Equipment {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  location?: string;
  rentalPrice?: number;
  rentalType?: string;
  image?: string;
  availability?: boolean;
}

export default function CustomerFavoritesPage() {
  const [favorites, setFavorites] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const fetchFavorites = async () => {
    try {
      setLoading(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        setMessage("Please login to view your favorites.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/users/favorites`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load favorites");
      }

      setFavorites(result.data || []);
    } catch (error) {
      console.error("Favorites error:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (equipmentId: string) => {
    try {
      setRemovingId(equipmentId);
      setMessage("");

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        setMessage("Please login first.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/users/favorites/${equipmentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to remove favorite");
      }

      setFavorites((previous) =>
        previous.filter((item) => item._id !== equipmentId)
      );

      setMessage("Equipment removed from favorites.");
    } catch (error) {
      console.error("Remove favorite error:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not remove favorite."
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
          <p className="mt-4 text-gray-600">Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
            Customer Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            My Favorites
          </h1>

          <p className="mt-2 text-gray-600">
            All your favorite rental equipment in one place.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Saved Equipment
            </p>
            <h2 className="mt-2 text-3xl font-bold text-green-700">
              {favorites.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Dashboard
            </p>
            <Link
              href="/dashboard/customer/my-rentals"
              className="mt-3 inline-block font-semibold text-green-700 hover:underline"
            >
              View My Rentals →
            </Link>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {message}
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="text-5xl">♡</div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No Favorites Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              You haven't saved any equipment yet. Explore our equipment
              collection and add your favorites.
            </p>

            <Link
              href="/equipment"
              className="mt-6 inline-block rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              Explore Equipment
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((equipment) => (
              <div
                key={equipment._id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-52 bg-gray-100">
                  {equipment.image ? (
                    <Image
                      src={equipment.image}
                      alt={equipment.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}

                  <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-semibold text-green-700 shadow">
                    ♡ Saved
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                    {equipment.category || "Equipment"}
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-gray-900">
                    {equipment.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {equipment.description || "No description available."}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p>📍 {equipment.location || "Location not specified"}</p>

                    <p>
                      Rental Price:{" "}
                      <span className="font-bold text-green-700">
                        ৳{equipment.rentalPrice ?? "N/A"}
                      </span>
                      {equipment.rentalType
                        ? ` / ${equipment.rentalType}`
                        : ""}
                    </p>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Link
                      href={`/equipment/${equipment._id}`}
                      className="flex-1 rounded-lg bg-green-700 px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-green-800"
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() => handleRemove(equipment._id)}
                      disabled={removingId === equipment._id}
                      className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {removingId === equipment._id
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
