
"use client";

import { useEffect, useState } from "react";
import { authClient } from "../../../../lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://equipment-rental-platform-server.onrender.com";

interface Booking {
  _id: string;
  equipmentName?: string;
  equipmentImage?: string;
  customerId?: string;
  ownerId?: string;
  startDate?: string;
  endDate?: string;
  durationInDays?: number;
  quantity?: number;
  rentalType?: string;
  rentalPrice?: number;
  totalAmount?: number;
  contact?: string;
  deliveryAddress?: string;
  notes?: string;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Authentication failed. Please login again.");
        }

        const response = await fetch(`${API_URL}/api/admin/bookings`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load bookings.");
        }

        setBookings(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const rejected = bookings.filter((b) => b.status === "rejected").length;

  const formatDate = (value?: string) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-semibold text-green-700">
          Loading bookings...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
            Admin Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Booking Management
          </h1>
          <p className="mt-2 text-gray-600">
            View and monitor all equipment rental bookings.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Total Bookings", value: bookings.length },
            { title: "Pending", value: pending },
            { title: "Confirmed", value: confirmed },
            { title: "Rejected", value: rejected },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-500">
                {item.title}
              </p>
              <p className="mt-3 text-3xl font-bold text-gray-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            All Bookings ({bookings.length})
          </h2>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">
              No bookings found
            </h3>
            <p className="mt-2 text-gray-500">
              Bookings will appear here when customers make reservations.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {booking.equipmentName || "Equipment"}
                    </h3>
                    <p className="mt-1 break-all text-xs text-gray-400">
                      Booking ID: {booking._id}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                      {booking.status || "Unknown"}
                    </span>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-700">
                      Payment: {booking.paymentStatus || "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-gray-500">Start Date</p>
                    <p className="mt-1 font-semibold text-gray-800">
                      {formatDate(booking.startDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">End Date</p>
                    <p className="mt-1 font-semibold text-gray-800">
                      {formatDate(booking.endDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="mt-1 font-semibold text-gray-800">
                      {booking.durationInDays ?? "N/A"} days
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Quantity</p>
                    <p className="mt-1 font-semibold text-gray-800">
                      {booking.quantity ?? "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Rental Price</p>
                    <p className="mt-1 font-semibold text-gray-800">
                      ৳{booking.rentalPrice ?? "N/A"} / {booking.rentalType || "unit"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Total Amount</p>
                    <p className="mt-1 text-lg font-bold text-green-700">
                      ৳{booking.totalAmount ?? "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Customer ID</p>
                    <p className="mt-1 break-all font-medium text-gray-800">
                      {booking.customerId || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Owner ID</p>
                    <p className="mt-1 break-all font-medium text-gray-800">
                      {booking.ownerId || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Contact</p>
                    <p className="mt-1 font-medium text-gray-800">
                      {booking.contact || "N/A"}
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <p className="text-gray-500">Delivery Address</p>
                    <p className="mt-1 font-medium text-gray-800">
                      {booking.deliveryAddress || "N/A"}
                    </p>
                  </div>

                  {booking.notes && (
                    <div className="sm:col-span-2 lg:col-span-3">
                      <p className="text-gray-500">Notes</p>
                      <p className="mt-1 text-gray-800">{booking.notes}</p>
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
