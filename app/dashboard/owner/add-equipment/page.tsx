
"use client";
import { API_URL } from "@/lib/api";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "../../../../lib/auth-client";

const categories = [
  "Construction",
  "Photography",
  "Vehicles",
  "Agriculture",
  "Electronics",
  "Event",
];

export default function AddEquipmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Construction",
    location: "",
    rentalPrice: "",
    rentalType: "daily",
    quantity: "1",
    condition: "Good",
    brand: "",
    model: "",
    image: "",
    terms: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await authClient.token();
      console.log("TOKEN DATA:", data);

if (data?.token) {
  const payload = JSON.parse(
    atob(data.token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
  );

  console.log("JWT USER ROLE:", payload.role);
}

      if (error || !data?.token) {
        throw new Error("Please sign in again to continue.");
      }

      const response = await fetch(`${API_URL}/api/equipment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          ...form,
          rentalPrice: Number(form.rentalPrice),
          quantity: Number(form.quantity),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Equipment could not be added.");
      }

      setMessage("Equipment added successfully! Waiting for admin approval.");

      setForm({
        name: "",
        description: "",
        category: "Construction",
        location: "",
        rentalPrice: "",
        rentalType: "daily",
        quantity: "1",
        condition: "Good",
        brand: "",
        model: "",
        image: "",
        terms: "",
      });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-block font-medium text-blue-600 hover:underline"
        >
          ← Back to Home
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <div className="mb-8">
            <p className="font-semibold text-blue-600">OWNER DASHBOARD</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Add New Equipment
            </h1>
            <p className="mt-2 text-slate-500">
              Provide equipment details to list your equipment for rental.
            </p>
          </div>

          {message && (
            <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm font-medium text-blue-800">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Equipment Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Caterpillar Excavator"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe your equipment..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Category *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Location *
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Dhaka, Bangladesh"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Rental Price *
                </label>
                <input
                  name="rentalPrice"
                  type="number"
                  min="1"
                  value={form.rentalPrice}
                  onChange={handleChange}
                  required
                  placeholder="Price"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Rental Type *
                </label>
                <select
                  name="rentalType"
                  value={form.rentalType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Quantity *
                </label>
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Condition *
                </label>
                <select
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900"
                >
                  <option value="New">New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Brand
                </label>
                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Equipment brand"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Model
                </label>
                <input
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  placeholder="Equipment model"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Equipment Image URL *
              </label>
              <input
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                required
                placeholder="https://example.com/equipment.jpg"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
              />
              <p className="mt-1 text-xs text-slate-500">
                Paste a direct image link.
              </p>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Rental Terms
              </label>
              <textarea
                name="terms"
                value={form.terms}
                onChange={handleChange}
                rows={3}
                placeholder="Write rental conditions..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Adding Equipment..." : "Submit Equipment"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
