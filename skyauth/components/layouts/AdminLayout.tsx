import { PropsWithChildren } from "react";
import Link from "next/link";

const adminNav = [
  { href: "/admin/airlines", label: "Airlines" },
  { href: "/admin/roles", label: "Roles" },
  { href: "/admin/audit", label: "Audit Logs" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-muted/40 md:grid-cols-[240px_1fr]">
      <aside className="border-r bg-background/80 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">SkyAuth</p>
        <h2 className="mt-1 text-2xl font-semibold">Control Center</h2>
        <nav className="mt-8 space-y-2">
          {adminNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="px-6 py-10">
        <div className="mx-auto max-w-5xl space-y-6">{children}</div>
      </main>
    </div>
  );
}
