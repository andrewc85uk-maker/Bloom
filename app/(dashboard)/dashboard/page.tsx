import Link from "next/link";

const sections = [
  {
    href: "/brand-kit",
    title: "Brand Kit",
    description: "Set up your fonts, colours, logo and overlay defaults.",
  },
  {
    href: "/content-bank",
    title: "Content Bank",
    description: "Upload and tag your photos.",
  },
  {
    href: "/posts/new",
    title: "New Post",
    description: "Create a new Instagram carousel.",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl mb-2">Welcome back</h1>
      <p className="text-bloom-black/60 mb-10 text-sm">What would you like to do today?</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block p-6 bg-white rounded-2xl shadow-sm border border-bloom-black/5 hover:shadow-md transition-shadow"
          >
            <h2 className="font-serif text-xl mb-1">{s.title}</h2>
            <p className="text-sm text-bloom-black/60">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
