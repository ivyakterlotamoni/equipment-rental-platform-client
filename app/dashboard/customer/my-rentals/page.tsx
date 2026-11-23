
"use client";
import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type Booking = {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage?: string;
  startDate: string;
  endDate: string;
  durationInDays: number;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
};

export default function CustomerMyRentalsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const { data } = await authClient.token();

        if (!data?.token) {
          throw new Error("Please sign in to view your rentals.");
        }

        const response = await fetch(
          `${API_URL}/api/bookings/my-bookings`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load bookings");
        }

        setBookings(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const formatDate = (date: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const totalSpent = bookings
    .filter((booking) => booking.paymentStatus === "paid")
    .reduce((total, booking) => total + Number(booking.totalAmount || 0), 0);

  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "paid"
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f8f4]">
        <p className="font-semibold text-green-800">
          Loading your rentals...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f8f4] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[3px] text-green-700">
            CUSTOMER DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My Rentals
          </h1>

          <p className="mt-2 text-gray-500">
            Track your equipment bookings and rental history.
          </p>
        </div>

        {/* Banner */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-green-900 via-green-700 to-emerald-600 p-7 text-white shadow-lg sm:p-9">
          <div className="relative z-10 max-w-xl">
            <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-bold tracking-wider">
              YOUR RENTAL ACTIVITY
            </span>

            <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">
              Manage Your Bookings
            </h2>

            <p className="mt-3 text-sm leading-7 text-green-50 sm:text-base">
              View your rental details, check payment status and keep track of
              your equipment bookings in one place.
            </p>
          </div>

          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Bookings
            </p>
            <h3 className="mt-3 text-3xl font-extrabold text-gray-900">
              {bookings.length}
            </h3>
            <p className="mt-2 text-sm text-green-700">
              All your rental requests
            </p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Paid Bookings
            </p>
            <h3 className="mt-3 text-3xl font-extrabold text-green-700">
              {paidBookings}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Successfully paid rentals
            </p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <p className="text-sm font-medium text-gray-500">
              Total Amount Paid
            </p>
            <h3 className="mt-3 text-3xl font-extrabold text-gray-900">
              ৳{totalSpent.toLocaleString("en-BD")}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Based on successful payments
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Booking List */}
        <section className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">
                Booking History
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your equipment rental records
              </p>
            </div>

            <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-800">
              {bookings.length} Rentals
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-2xl bg-green-50 px-5 py-16 text-center">
              <div className="text-5xl">🚜</div>

              <h3 className="mt-5 text-xl font-extrabold text-gray-900">
                No Rentals Yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                You have not booked any equipment yet. Explore available
                equipment and make your first rental booking.
              </p>

              <a
                href="/equipment"
                className="mt-6 inline-block rounded-xl bg-green-700 px-7 py-3 font-bold text-white transition hover:bg-green-800"
              >
                Explore Equipment →
              </a>
            </div>
          ) : (
            <div className="space-y-5">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="grid gap-5 rounded-2xl border border-gray-100 p-5 transition hover:border-green-200 hover:shadow-md md:grid-cols-[150px_1fr] lg:p-6"
                >
                  {/* Equipment Image */}
                  <div className="h-36 overflow-hidden rounded-xl bg-green-50">
                    {booking.equipmentImage ? (
                      <img
                        src={booking.equipmentImage}
                        alt={booking.equipmentName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl">
                        🚜
                      </div>
                    )}
                  </div>

                  {/* Equipment Details */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-extrabold text-gray-900">
                          {booking.equipmentName}
                        </h3>

                        <p className="mt-1 text-xs text-gray-400">
                          Booking ID: {booking._id}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-4 py-2 text-xs font-bold capitalize ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-xs text-gray-400">Start Date</p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {formatDate(booking.startDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">End Date</p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {formatDate(booking.endDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Duration</p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {booking.durationInDays} Days
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Quantity</p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {booking.quantity} Unit(s)
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-xs text-gray-400">Total Amount</p>
                        <p className="mt-1 text-xl font-extrabold text-green-800">
                          ৳{Number(booking.totalAmount).toLocaleString("en-BD")}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          Payment Status
                        </p>
                        <span
                          className={`mt-2 inline-block rounded-full px-4 py-2 text-xs font-bold capitalize ${getStatusStyle(
                            booking.paymentStatus
                          )}`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <p className="mt-8 text-center text-xs text-gray-400">
          Equipment Rental Platform · Customer Dashboard
        </p>
      </div>
    </main>
  );
}
