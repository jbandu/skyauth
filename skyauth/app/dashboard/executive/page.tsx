import { executiveDashboardMock } from "@/lib/data/mockDashboardData";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function ExecutiveDashboardPage() {
  const data = executiveDashboardMock;

  return (
    <div className="space-y-8">
      <WelcomeCard
        name={data.welcomeName}
        title={data.title}
        airline={data.airline}
        message="Org health, headcount, and approvals across Copa Airlines."
      />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border bg-card px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
            <p className="text-3xl font-semibold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.trend}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-3xl border bg-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Org health</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {data.orgHealth.map((metric) => (
              <div key={metric.label} className="rounded-2xl border px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{metric.label}</p>
                <p className="text-2xl font-semibold">{metric.value}</p>
              </div>
            ))}
          </div>
        </article>
        <QuickActions actions={data.quickActions} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <RecentActivity items={data.activity} />
        <OrgFocus />
      </section>
    </div>
  );
}

function OrgFocus() {
  const milestones = [
    { title: "Fleet expansion review", subtitle: "Finalize 4 MAX routes", dueDate: "Dec 15" },
    { title: "Avelo onboarding sync", subtitle: "Tenant theming + RLS", dueDate: "Dec 18" },
    { title: "Strategy offsite", subtitle: "Leadership alignment", dueDate: "Jan 5" },
  ];

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Strategic focus</h2>
      <div className="mt-4 space-y-4">
        {milestones.map((item) => (
          <div key={item.title} className="rounded-xl border px-4 py-3">
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.subtitle}</p>
            <p className="text-xs text-muted-foreground">Due {item.dueDate}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
