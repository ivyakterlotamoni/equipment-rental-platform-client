
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import UserMenu from "../UserMenu";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Equipment Rental Platform",
  description:
    "Find, rent, and manage equipment easily with our Equipment Rental Platform.",
};

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">
            ⚙
          </div>
          <span className="text-xl font-extrabold">
            Equip<span className="text-blue-600">Rent</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/equipment" className="hover:text-blue-600">Equipment</Link>
          <Link href="/#categories" className="hover:text-blue-600">Categories</Link>
          <Link href="/#how-it-works" className="hover:text-blue-600">How It Works</Link>
        </div>

        <div className="flex items-center gap-3">
          <UserMenu />
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <h2 className="text-2xl font-extrabold text-white">
            Equip<span className="text-blue-400">Rent</span>
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">
            Your trusted platform for finding and renting quality equipment.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white">Quick Links</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
            <Link href="/">Home</Link>
            <Link href="/equipment">Equipment</Link>
            <Link href="/#categories">Categories</Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white">Account</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
            <Link href="/sign-in">Sign In</Link>
            <Link href="/sign-up">Create Account</Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white">Contact</h3>
          <p className="mt-5 text-sm leading-7 text-slate-400">
            Bangladesh<br />
            Equipment Rental Platform
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800 px-5 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} EquipRent. All rights reserved.
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
