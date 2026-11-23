
import Link from "next/link";

const sections = [
  {
    title: "Add Equipment",
    description: "Add new equipment for customers to rent.",
    href: "/dashboard/owner/add-equipment",
    icon: "➕",
  },
  {
    title: "My Equipment",
    description: "View and manage your listed equipment.",
    href: "/dashboard/owner/my-equipment",
    icon: "🛠️",
  },
  {
    title: "My Rentals",
    description: "Manage rental requests and bookings.",
    href: "/dashboard/owner/my-rentals",
    icon: "📋",
  },
  {
    title: "My Profile",
    description: "View and update your profile information.",
    href: "/dashboard/owner/profile",
    icon: "👤",
  },
];

export default function OwnerDashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-5 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900">
          Owner Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your equipment and rental activities.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-3xl">{section.icon}</div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                {section.title}
              </h2>
              <p className="mt-2 text-gray-600">
                {section.description}
              </p>
              <span className="mt-5 inline-block font-semibold text-green-700">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
