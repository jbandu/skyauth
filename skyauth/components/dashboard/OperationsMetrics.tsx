"use client";

import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, Tooltip, Bar } from "recharts";

type OperationsMetricsProps = {
  crewOnDuty: number;
  crewAvailable: number;
  schedules: Array<{ label: string; flights: number; coverage: number }>;
};

export function OperationsMetrics({ crewOnDuty, crewAvailable, schedules }: OperationsMetricsProps) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard label="Crew on duty" value={crewOnDuty.toLocaleString()} hint="Across all bases" />
        <MetricCard label="Crew available" value={crewAvailable.toLocaleString()} hint="Ready within 2h" />
      </div>
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={schedules}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", borderRadius: "1rem", border: "1px solid hsl(var(--border))" }}
            />
            <Bar dataKey="flights" fill="hsl(var(--airline-primary, var(--primary)))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-3xl font-semibold">{value}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
