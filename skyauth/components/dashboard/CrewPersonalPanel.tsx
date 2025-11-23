type CrewPersonalPanelProps = {
  role: string;
  base: string;
  nextFlight: {
    route: string;
    departure: string;
    gate: string;
  };
  ptoBalance: string;
  training: {
    name: string;
    dueDate: string;
  };
};

export function CrewPersonalPanel({ role, base, nextFlight, ptoBalance, training }: CrewPersonalPanelProps) {
  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        <CrewStat label="Role" value={role} hint={`Base ${base}`} />
        <CrewStat label="Next flight" value={nextFlight.route} hint={`${nextFlight.departure} · Gate ${nextFlight.gate}`} />
        <CrewStat label="PTO balance" value={ptoBalance} hint="Tap to view accruals" />
      </div>
      <div className="mt-6 rounded-2xl border px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Training</p>
        <p className="text-lg font-semibold">{training.name}</p>
        <p className="text-sm text-muted-foreground">Due {training.dueDate}</p>
      </div>
    </section>
  );
}

function CrewStat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}
