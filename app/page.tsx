
import Link from "next/link";
import Image from "next/image";

const categories = [
  { icon: "🚜", name: "Construction", count: "120+ Equipment" },
  { icon: "🚛", name: "Vehicles", count: "85+ Equipment" },
  { icon: "⚡", name: "Power Tools", count: "90+ Equipment" },
  { icon: "🏗️", name: "Heavy Machinery", count: "65+ Equipment" },
  { icon: "🌾", name: "Agriculture", count: "50+ Equipment" },
  { icon: "🔧", name: "Other Equipment", count: "40+ Equipment" },
];

const equipment = [
  {
    name: "Excavator",
    image: "/images/excavator.jpg",
    category: "Heavy Machinery",
    price: "৳5,000",
    unit: "/ day",
    location: "Dhaka, Bangladesh",
    rating: "4.9",
  },
  {
    name: "Dump Truck",
    image: "/images/dump-truck.jpg",
    category: "Construction",
    price: "৳3,500",
    unit: "/ day",
    location: "Chattogram, Bangladesh",
    rating: "4.8",
  },
  {
    name: "Power Generator",
    image: "/images/generator.jpg",
    category: "Power Tools",
    price: "৳1,200",
    unit: "/ day",
    location: "Dinajpur, Bangladesh",
    rating: "4.7",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      
      

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-300">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Your Trusted Equipment Rental Partner
            </span>

            <h1 className="mt-7 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Rent The Right
              <span className="block text-blue-400">Equipment.</span>
              Get The Job Done.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Find and rent quality equipment for your projects. Connect with
              trusted equipment owners and get everything you need in one place.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="#equipment"
                className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Explore Equipment →
              </Link>
              <Link
                href="#how-it-works"
                className="rounded-xl border border-slate-600 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                How It Works
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-10">
              <div>
                <h3 className="text-3xl font-bold text-white">500+</h3>
                <p className="mt-1 text-sm text-slate-400">Equipment Listed</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">200+</h3>
                <p className="mt-1 text-sm text-slate-400">Happy Customers</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">50+</h3>
                <p className="mt-1 text-sm text-slate-400">Trusted Owners</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative min-h-[350px] overflow-hidden rounded-3xl border border-white/10 bg-slate-800 sm:min-h-[450px]">
            <Image
              src="/images/excavator.jpg"
              alt="Excavator equipment"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />

            <div className="absolute left-5 top-5 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-xs text-slate-300">Available Equipment</p>
              <p className="mt-1 text-xl font-bold text-white">500+ Items</p>
            </div>

            <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-xs text-slate-300">Simple & Secure</p>
              <p className="mt-1 font-semibold text-white">
                Equipment Made Easy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="relative z-10 mx-auto -mt-8 max-w-6xl px-5">
        <div className="grid gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-xl sm:grid-cols-3 sm:p-7">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              What do you need?
            </label>
            <input
              type="text"
              placeholder="Search equipment..."
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Category
            </label>
            <select className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500">
              <option>All Categories</option>
              {categories.map((category) => (
                <option key={category.name}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Link
              href="#equipment"
              className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
            >
              Search Equipment
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Browse By Category
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Explore Equipment
            </h2>
            <p className="mt-3 text-slate-500">
              Find the right equipment for your next project.
            </p>
          </div>
          <Link href="#equipment" className="font-semibold text-blue-600 hover:text-blue-700">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              href="#equipment"
              key={category.name}
              className="group rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-3xl transition group-hover:bg-blue-100">
                {category.icon}
              </div>
              <h3 className="mt-5 font-bold">{category.name}</h3>
              <p className="mt-2 text-xs text-slate-500">{category.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Equipment */}
      <section id="equipment" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Popular Listings
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Featured Equipment
              </h2>
              <p className="mt-3 text-slate-500">
                Discover equipment available for rent.
              </p>
            </div>
            <Link
              href="/equipment"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Browse All →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {equipment.map((item) => (
              <article
                key={item.name}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Equipment Image */}
                <div className="relative h-52 w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {item.category}
                    </span>
                    <span className="text-sm font-semibold text-amber-500">
                      ★ {item.rating}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold">{item.name}</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    📍 {item.location}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                    <p>
                      <span className="text-xl font-extrabold text-blue-600">
                        {item.price}
                      </span>
                      <span className="text-sm text-slate-500">
                        {item.unit}
                      </span>
                    </p>
                    <Link
                      href="/sign-in"
                      className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Simple Process
          </p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 leading-7 text-slate-500">
            Renting equipment has never been easier. Follow three simple steps.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              number: "01",
              icon: "🔍",
              title: "Find Equipment",
              description: "Browse available equipment and choose what you need.",
            },
            {
              number: "02",
              icon: "📅",
              title: "Book Equipment",
              description: "Select your rental dates and submit your booking.",
            },
            {
              number: "03",
              icon: "🤝",
              title: "Get It Done",
              description: "Complete payment and get your equipment ready.",
            },
          ].map((step) => (
            <div key={step.number} className="text-center">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-4xl">
                {step.icon}
                <span className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {step.number}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-bold">{step.title}</h3>
              <p className="mx-auto mt-3 max-w-xs leading-7 text-slate-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-blue-600 px-6 py-14 text-center sm:px-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Have Equipment to Rent?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-blue-100">
            Join our platform as an equipment owner and connect with customers
            looking for reliable equipment.
          </p>
          <Link
            href="/sign-up"
            className="mt-8 inline-block rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 transition hover:bg-blue-50"
          >
            Become an Owner →
          </Link>
        </div>
      </section>

     
    </main>
  );
}
