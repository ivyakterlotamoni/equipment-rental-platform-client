
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


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
};

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch("https://equipment-rental-platform-server.onrender.com/api/equipment");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load equipment");
        }

        setEquipment(result.data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Explore Equipment
          </h1>
          <p className="mt-3 text-slate-600">
            Find the right equipment for your next project.
          </p>
        </div>

        {loading ? (
          <p className="py-12 text-center">Loading equipment...</p>
        ) : error ? (
          <p className="rounded-lg bg-red-50 p-5 text-center text-red-600">
            {error}
          </p>
        ) : equipment.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center">
            <h2 className="text-xl font-bold">No Equipment Available</h2>
            <p className="mt-2 text-slate-500">
              Approved equipment will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipment.map((item) => (
              <Link
                key={item._id}
                href={`/equipment/${item._id}`}
                className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-52 w-full object-cover"
                />

                <div className="p-5">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {item.category}
                  </span>

                  <h2 className="mt-3 text-xl font-bold text-slate-900">
                    {item.name}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {item.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>Location: {item.location}</p>
                    <p>Condition: {item.condition}</p>
                    <p>Available Quantity: {item.quantity}</p>
                  </div>

                  <p className="mt-4 text-lg font-bold text-green-700">
                    ৳{item.rentalPrice} / {item.rentalType}
                  </p>

                  <span className="mt-4 inline-block font-semibold text-blue-600">
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
