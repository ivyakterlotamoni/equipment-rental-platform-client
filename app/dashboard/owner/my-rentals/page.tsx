
"use client";

import { useEffect, useState } from "react";
import { authClient } from "../../../../lib/auth-client";

type Booking = {
  _id: string;
  equipmentName: string;
  equipmentImage?: string;
  customerId: string;
  startDate: string;
  endDate: string;
  durationInDays: number;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
  contact: string;
  deliveryAddress: string;
};

export default function MyRentalsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        "http://localhost:5000/api/bookings/owner-bookings",
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load bookings.");
      }

      setBookings(result.data || []);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateStatus = async (
    id: string,
    status: "confirmed" | "rejected"
  ) => {
    const action = status === "confirmed" ? "confirm" : "reject";

    if (!window.confirm(`Are you sure you want to ${action} this booking?`)) {
      return;
    }

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `http://localhost:5000/api/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Status update failed.");
      }

      setMessage(result.message);
      await loadBookings();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Update failed."
      );
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-blue-600">
              OWNER DASHBOARD
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              My Equipment Rentals
            </h1>

            <p className="mt-2 text-slate-500">
              Manage rental requests for your equipment.
            </p>
          </div>

          <button
            onClick={loadBookings}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Refresh Bookings
          </button>
        </div>

        {message && (
          <div className="mb-5 rounded-lg bg-blue-50 p-4 text-blue-800">
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center text-slate-600">
            Loading rental bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center">
            <h2 className="text-xl font-bold text-slate-800">
              No Rental Bookings Yet
            </h2>

            <p className="mt-2 text-slate-500">
              Customer rental requests will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Total Bookings</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {bookings.length}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Pending</p>
                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {bookings.filter((b) => b.status === "pending").length}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Confirmed</p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {bookings.filter((b) => b.status === "confirmed").length}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="grid gap-5 p-5 md:grid-cols-[180px_1fr]">

                    {booking.equipmentImage && (
                      <img
                        src={booking.equipmentImage}
                        alt={booking.equipmentName}
                        className="h-44 w-full rounded-lg object-cover"
                      />
                    )}

                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-xl font-bold text-slate-900">
                          {booking.equipmentName}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : booking.status === "cancelled"
                              ? "bg-slate-100 text-slate-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                        <p>
                          <strong>Customer ID:</strong> {booking.customerId}
                        </p>

                        <p>
                          <strong>Quantity:</strong> {booking.quantity}
                        </p>

                        <p>
                          <strong>Start Date:</strong>{" "}
                          {formatDate(booking.startDate)}
                        </p>

                        <p>
                          <strong>End Date:</strong>{" "}
                          {formatDate(booking.endDate)}
                        </p>

                        <p>
                          <strong>Duration:</strong>{" "}
                          {booking.durationInDays} days
                        </p>

                        <p>
                          <strong>Payment:</strong>{" "}
                          {booking.paymentStatus}
                        </p>

                        <p>
                          <strong>Contact:</strong> {booking.contact}
                        </p>

                        <p>
                          <strong>Total Amount:</strong>{" "}
                          <span className="font-bold text-green-700">
                            ৳{booking.totalAmount}
                          </span>
                        </p>
                      </div>

                      <p className="mt-3 break-words text-sm text-slate-600">
                        <strong>Delivery Address:</strong>{" "}
                        {booking.deliveryAddress}
                      </p>

                      {booking.status === "pending" && (
                        <div className="mt-5 flex flex-wrap gap-3">
                          <button
                            onClick={() =>
                              updateStatus(booking._id, "confirmed")
                            }
                            disabled={booking.paymentStatus !== "paid"}
                            className="rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                          >
                            Confirm Booking
                          </button>

                          <button
                            onClick={() =>
                              updateStatus(booking._id, "rejected")
                            }
                            className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700"
                          >
                            Reject Booking
                          </button>
                        </div>
                      )}

                      {booking.paymentStatus !== "paid" &&
                        booking.status === "pending" && (
                          <p className="mt-3 text-xs text-amber-700">
                            Booking can only be confirmed after successful payment.
                          </p>
                        )}
                    </div>
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
