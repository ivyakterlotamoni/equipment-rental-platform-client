
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const API_URL = "http://localhost:5000";

type UserProfile = {
  name: string;
  email: string;
  image?: string;
};

export default function OwnerProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await authClient.token();

        if (!data?.token) throw new Error("Please sign in again.");

        const response = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${data.token}` },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load profile");
        }

        setProfile({
          name: result.data.name || "",
          email: result.data.email || "",
          image: result.data.image || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const { data } = await authClient.token();

      if (!data?.token) throw new Error("Please sign in again.");

      const response = await fetch(`${API_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          image: profile.image,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Profile update failed");
      }

      setMessage("Your profile has been updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f8f4]">
        <p className="font-semibold text-green-800">Loading your profile...</p>
      </div>
    );
  }

  const initial = profile.name.charAt(0).toUpperCase() || "O";

  return (
    <main className="min-h-screen bg-[#f3f8f4] px-4 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Page Heading */}
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[3px] text-green-700">
            OWNER DASHBOARD
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-2 text-gray-500">
            Manage your account and personal information.
          </p>
        </div>

        {/* Welcome Banner */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-green-900 via-green-700 to-emerald-600 p-7 text-white shadow-xl sm:p-10">
          <div className="relative z-10 max-w-xl">
            <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-bold tracking-wider">
              EQUIPMENT RENTAL PLATFORM
            </span>
            <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">
              Welcome back, {profile.name || "Owner"}!
            </h2>
            <p className="mt-3 text-sm leading-7 text-green-50 sm:text-base">
              Keep your account information up to date and manage your owner profile easily.
            </p>
          </div>

          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 right-32 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        </div>

        {/* Profile Content */}
        <div className="grid gap-7 lg:grid-cols-[0.85fr_1.5fr]">

          {/* Profile Card */}
          <section className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-lg">
            <div className="h-28 bg-gradient-to-r from-green-800 to-emerald-500" />

            <div className="-mt-14 px-6 pb-8 text-center">
              <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-green-100 shadow-lg">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-extrabold text-green-800">
                    {initial}
                  </span>
                )}
              </div>

              <h2 className="mt-5 text-2xl font-extrabold text-gray-900">
                {profile.name || "Owner"}
              </h2>

              <p className="mt-2 break-all text-sm text-gray-500">
                {profile.email}
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-50 px-5 py-2 text-sm font-bold text-green-800">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Equipment Owner
              </div>

              <div className="mt-8 border-t border-gray-100 pt-6 text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Account Information
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl">
                    <span>👤</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Account Name</p>
                    <p className="font-semibold text-gray-800">
                      {profile.name}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl">
                    <span>✉️</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Email Address</p>
                    <p className="break-all font-semibold text-gray-800">
                      {profile.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Edit Profile Form */}
          <section className="rounded-3xl border border-green-100 bg-white p-6 shadow-lg sm:p-9">
            <div className="mb-8 border-b border-gray-100 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                  ✏️
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">
                    Edit Profile
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Update your personal details below.
                  </p>
                </div>
              </div>
            </div>

            {message && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800">
                ✓ {message}
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Full Name
                </label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-5 py-4 text-gray-500"
                />
                <p className="mt-2 text-xs text-gray-400">
                  Email address cannot be changed here.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Profile Image URL
                </label>
                <input
                  name="image"
                  type="url"
                  value={profile.image || ""}
                  onChange={handleChange}
                  placeholder="https://example.com/your-photo.jpg"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                />
                <p className="mt-2 text-xs text-gray-400">
                  Paste a direct image link to update your profile photo.
                </p>
              </div>

              {profile.image && (
                <div className="rounded-xl bg-green-50 p-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-green-800">
                    Image Preview
                  </p>
                  <img
                    src={profile.image}
                    alt="Preview"
                    className="h-24 w-24 rounded-2xl border-2 border-white object-cover shadow-md"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-gradient-to-r from-green-800 to-emerald-600 px-6 py-4 font-bold text-white shadow-lg shadow-green-900/20 transition hover:-translate-y-0.5 hover:from-green-900 hover:to-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving Changes..." : "Save Profile Changes →"}
              </button>
            </form>
          </section>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          Equipment Rental Platform · Owner Account Management
        </p>
      </div>
    </main>
  );
}
