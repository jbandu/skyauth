import { crewDashboardMock } from "@/lib/data/mockDashboardData";
import { CrewPersonalPanel } from "@/components/dashboard/CrewPersonalPanel";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { CompanyNews } from "@/components/dashboard/CompanyNews";

export default function CrewDashboardPage() {
  const data = crewDashboardMock;

  return (
    <div className="space-y-8">
      <CrewPersonalPanel
        role={data.role}
        base={data.base}
        nextFlight={data.nextFlight}
        ptoBalance={data.ptoBalance}
        training={data.training}
      />

      <section className="grid gap-6 lg:grid-cols-2">
        <QuickActions
          title="My shortcuts"
          actions={data.quickActions.map((action) => ({ label: action.label, href: action.href }))}
        />
        <CompanyNews items={data.news} />
      </section>
    </div>
  );
}
