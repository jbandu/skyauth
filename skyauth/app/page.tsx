import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <section className="border-b bg-background/80 px-6 py-12 shadow-sm backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">SkyAuth</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-5xl">
          The single sign-on, employee directory, and HR platform built for airline operators.
        </h1>
        <p className="mt-5 max-w-3xl text-base text-muted-foreground md:text-lg">
          SkyAuth gives Copa Airlines, Avelo Airlines, and future Number Labs partners a production-ready workforce cloud
          with secure authentication, animated org charts, and role-based dashboards.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:translate-y-0.5"
          >
            Launch Authentication Demo
          </Link>
          <Link
            href="/dashboard/executive"
            className="inline-flex items-center justify-center rounded-full border border-primary/40 px-6 py-3 text-sm font-semibold text-primary"
          >
            View Executive Dashboard
          </Link>
        </div>
      </section>

      <main className="flex flex-1 flex-col gap-8 px-6 py-12">
        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Employees", value: "18,245", sub: "Across Copa & Avelo tenants" },
            { label: "Dashboards", value: "4", sub: "Executive • Operations • Crew • Admin" },
            { label: "Org Nodes", value: "52", sub: "Animated React Flow tree" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border bg-card p-6 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.sub}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 shadow-md">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Week 1 focus</p>
            <h2 className="mt-2 text-2xl font-semibold">Authentication + Dashboards</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>• NextAuth v5 credentials with airline-aware lockouts</li>
              <li>• Executive, Operations, Crew, and Admin dashboard scaffolding</li>
              <li>• Multi-tenant branding with Copa & Avelo themes</li>
              <li>• Audit-ready login + session logging</li>
            </ul>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-md">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Org intelligence</p>
            <h2 className="mt-2 text-2xl font-semibold">Copa Airlines hierarchy</h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Pedro Heilbron opens SkyAuth to a personalized welcome, org health metrics, and a living org chart that
              animates every reporting chain using React Flow + Framer Motion.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-muted-foreground">
              <div className="rounded-xl border px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Upcoming</p>
                <p>Time-off workflows, document vault, and external API.</p>
              </div>
              <div className="rounded-xl border px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Security</p>
                <p>Row-level security, per-airline API keys, and audit trails.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
