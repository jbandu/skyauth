import { operationsDashboardMock } from "@/lib/data/mockDashboardData";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { OperationsMetrics } from "@/components/dashboard/OperationsMetrics";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TeamDirectory } from "@/components/dashboard/TeamDirectory";

export default function OperationsDashboardPage() {
  const data = operationsDashboardMock;

  const crewMembers = [
    { name: "Julio Alvarez", title: "Crew Scheduler · PTY", status: "online" as const },
    { name: "Luisa Romero", title: "Ops Control · MIA", status: "away" as const },
    { name: "Marcus Reid", title: "Ground Ops · LAX", status: "offline" as const },
  ];

  return (
    <div className="space-y-8">
      <WelcomeCard
        name={data.welcomeName}
        title={data.title}
        airline="Copa Airlines"
        message="Crew coverage, fleet readiness, and upcoming schedules."
      />

      <OperationsMetrics crewOnDuty={data.crewOnDuty} crewAvailable={data.crewAvailable} schedules={data.schedules} />

      <section className="grid gap-6 lg:grid-cols-2">
        <QuickActions actions={data.quickActions} />
        <TeamDirectory members={crewMembers} title="Ops control center" />
      </section>

      <TeamSpotlight spots={data.teamSpotlight} />
    </div>
  );
}

function TeamSpotlight({ spots }: { spots: typeof operationsDashboardMock.teamSpotlight }) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Base readiness</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {spots.map((spot) => (
          <div key={spot.name} className="rounded-2xl border px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{spot.name}</p>
            <p className="text-2xl font-semibold">{spot.percentage}%</p>
            <p className="text-sm text-muted-foreground">{spot.status}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
