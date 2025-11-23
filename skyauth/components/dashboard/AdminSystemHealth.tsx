type AdminSystemHealthProps = {
  metrics: Array<{ label: string; value: string; change?: string; variant?: "warning" | "ok" }>;
  alerts: Array<{ title: string; description: string; severity: "info" | "warning" }>;
};

export function AdminSystemHealth({ metrics, alerts }: AdminSystemHealthProps) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{metric.label}</p>
            <p className="text-3xl font-semibold">{metric.value}</p>
            {metric.change && (
              <p className={`text-sm ${metric.variant === "warning" ? "text-amber-600" : "text-muted-foreground"}`}>
                {metric.change}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.title}
            className="flex items-center justify-between rounded-2xl border px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold">{alert.title}</p>
              <p className="text-muted-foreground">{alert.description}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs uppercase tracking-wide ${
                alert.severity === "warning" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {alert.severity}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
