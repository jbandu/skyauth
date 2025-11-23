import { PropsWithChildren } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type DashboardLayoutProps = PropsWithChildren<{
  title?: string;
  description?: string;
  navItems?: Array<{ href: string; label: string }>;
}>;

const defaultNav = [
  { href: "/dashboard/executive", label: "Executive" },
  { href: "/dashboard/operations", label: "Operations" },
  { href: "/dashboard/crew", label: "Crew" },
  { href: "/dashboard/admin", label: "Admin" },
];

export function DashboardLayout({
  children,
  title = "SkyAuth Dashboards",
  description = "Role-based insights for every airline leader.",
  navItems = defaultNav,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">SkyAuth</p>
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Tenant:</span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">Dynamic Airline</span>
          </div>
        </div>
        <nav className="flex flex-wrap gap-2 border-t px-6 py-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition hover:bg-primary/10 hover:text-primary"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
