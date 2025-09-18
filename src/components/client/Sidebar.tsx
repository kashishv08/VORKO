import Link from "next/link";

export const Sidebar = () => {
  const links = [
    { name: "Dashboard", href: "/client/dashboard" },
    { name: "All Projects", href: "/client/project" },
    { name: "Contracts", href: "/client/contract" },
    { name: "Proposals", href: "/client/proposal" },
    { name: "Messages", href: "/messages" },
    { name: "Meetings", href: "/meetings" },
    { name: "Reviews", href: "/reviews" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm p-6 flex flex-col">
      <nav className="flex flex-col gap-4">
        {links.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              link.name === "Dashboard"
                ? "bg-blue-50 text-blue-600 font-medium"
                : ""
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
