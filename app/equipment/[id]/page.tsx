
"use client";
import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface Equipment {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  location?: string;
  rentalPrice?: number;
  rentalType?: string;
  quantity?: number;
  condition?: string;
  brand?: string;
  model?: string;
  image?: string;
  terms?: string;
  availability?: boolean;
  status?: string;
  ownerId?: string;
}

export default function EquipmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/equipment/${id}`,
          { cache: "no-store" }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Equipment not found");
        }

        setEquipment(result.data);
      } catch (error) {
        console.error(error);
        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to load equipment"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEquipment();
  }, [id]);

  const handleAddFavorite = async () => {
    try {
      setFavoriteLoading(true);
      setMessage("");

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        router.push("/sign-in");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/users/favorites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            equipmentId: equipment?._id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not add to favorites");
      }

      setMessage("Equipment added to your favorites successfully!");
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong!"
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-semibold text-green-700">
          Loading equipment details...
        </p>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Equipment Not Found
        </h2>
        <p className="mt-2 text-gray-500">
          {message || "This equipment may have been removed."}
        </p>
        <Link
          href="/"
          className="mt-5 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-6 inline-block font-medium text-green-700 hover:underline"
        >
          ← Back to Home
        </Link>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative min-h-[300px] bg-gray-100 lg:min-h-[500px]">
              {equipment.image ? (
                <Image
                  src={equipment.image}
                  alt={equipment.name}
                  fill
                  unoptimized
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

            <div className="p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                  {equipment.category || "Equipment"}
                </span>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  {equipment.rentalType || "Flexible Rental"}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold text-gray-900 sm:text-4xl">
                {equipment.name}
              </h1>

              <p className="mt-4 leading-7 text-gray-600">
                {equipment.description || "No description available."}
              </p>

              <div className="mt-7 rounded-2xl bg-green-50 p-5">
                <p className="text-sm font-medium text-gray-600">
                  Rental Price
                </p>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-800">
                    ৳{equipment.rentalPrice ?? "N/A"}
                  </span>
                  <span className="text-gray-600">
                    / {equipment.rentalType || "rental period"}
                  </span>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-5">
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {equipment.location || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {equipment.quantity ?? "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Condition</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {equipment.condition || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Brand</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {equipment.brand || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {equipment.model || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Availability</p>
                  <p className="mt-1 font-semibold text-green-700">
                    {equipment.availability ? "Available" : "Unavailable"}
                  </p>
                </div>
              </div>

              {equipment.terms && (
                <div className="mt-7">
                  <h3 className="font-bold text-gray-900">
                    Rental Terms & Conditions
                  </h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                    {equipment.terms}
                  </p>
                </div>
              )}

              {message && (
                <div className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-800">
                  {message}
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleAddFavorite}
                  disabled={favoriteLoading}
                  className="flex-1 rounded-xl border-2 border-green-700 px-5 py-3 font-semibold text-green-700 transition hover:bg-green-50 disabled:opacity-50"
                >
                  {favoriteLoading ? "Saving..." : "♡ Add to Favorites"}
                </button>

                <button
                  onClick={() => router.push("/sign-in")}
                  className="flex-1 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
                >
                  Book Now
                </button>
              </div>

              <p className="mt-4 text-center text-xs text-gray-400">
                Secure and convenient equipment rental.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
