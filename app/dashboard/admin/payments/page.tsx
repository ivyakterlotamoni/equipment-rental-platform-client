
"use client";

import { useEffect, useState } from "react";
import { authClient } from "../../../../lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://equipment-rental-platform-server.onrender.com";

interface Payment {
  _id?: string;
  bookingId?: string;
  customerId?: string;
  stripeSessionId?: string;
  paymentIntentId?: string | null;
  amount?: number;
  currency?: string;
  status?: string;
  paidAt?: string;
  createdAt?: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Authentication failed. Please login again.");
        }

        const response = await fetch(`${API_URL}/api/admin/payments`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load payments.");
        }

        setPayments(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const paidPayments = payments.filter((p) => p.status === "paid");
  const totalRevenue = paidPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const formatDate = (value?: string) => {
    if (!value) return "N/A";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleString();
  };

  const formatAmount = (amount?: number, currency?: string) => {
    const value = Number(amount || 0);

    return `${currency?.toUpperCase() || "BDT"} ${value.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-semibold text-green-700">
          Loading payments...
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
            Payment Management
          </h1>

          <p className="mt-2 text-gray-600">
            View all payment transactions and revenue information.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Transactions
            </p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {payments.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Successful Payments
            </p>
            <p className="mt-3 text-3xl font-bold text-green-700">
              {paidPayments.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Revenue
            </p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              ৳{totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            All Transactions ({payments.length})
          </h2>
        </div>

        {payments.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">
              No payments found
            </h3>
            <p className="mt-2 text-gray-500">
              Payment transactions will appear here after successful checkout.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment, index) => (
              <div
                key={payment._id || payment.stripeSessionId || index}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Transaction #{index + 1}
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-gray-900">
                      {formatAmount(payment.amount, payment.currency)}
                    </h3>
                  </div>

                  <span
                    className={`w-fit rounded-full px-4 py-1.5 text-xs font-bold capitalize ${
                      payment.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {payment.status || "Unknown"}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-gray-500">Booking ID</p>
                    <p className="mt-1 break-all font-medium text-gray-800">
                      {payment.bookingId || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Customer ID</p>
                    <p className="mt-1 break-all font-medium text-gray-800">
                      {payment.customerId || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Paid Date</p>
                    <p className="mt-1 font-medium text-gray-800">
                      {formatDate(payment.paidAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Stripe Session ID</p>
                    <p className="mt-1 break-all font-medium text-gray-800">
                      {payment.stripeSessionId || "N/A"}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-gray-500">Payment Intent ID</p>
                    <p className="mt-1 break-all font-medium text-gray-800">
                      {payment.paymentIntentId || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
