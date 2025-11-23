import Link from "next/link";

const DASHBOARDS = [
  {
    title: "Executive",
    description: "Org health, headcount, and strategic KPIs.",
    href: "/dashboard/executive",
  },
  {
    title: "Operations",
    description: "Crew coverage, schedule readiness, fleet status.",
    href: "/dashboard/operations",
  },
  {
    title: "Crew",
    description: "Next flight, PTO balance, company news.",
    href: "/dashboard/crew",
  },
  {
    title: "Admin",
    description: "Audit logs, API usage, airline management.",
    href: "/dashboard/admin",
  },
];

export default function DashboardLandingPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">SkyAuth</p>
        <h1 className="mt-2 text-3xl font-semibold">Role-based dashboards</h1>
        <p className="text-sm text-muted-foreground">Pick the experience that matches your responsibilities.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {DASHBOARDS.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-2xl border bg-card p-6 shadow-sm transition hover:border-primary">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">{item.title}</p>
            <p className="mt-2 text-base text-muted-foreground">{item.description}</p>
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
              Open {item.title} →{" "}
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
