type RecentActivityProps = {
  items: Array<{
    title: string;
    description: string;
    timestamp: string;
  }>;
};

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Recent activity</h2>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={`${item.title}-${item.timestamp}`} className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <p className="text-xs text-muted-foreground">{item.timestamp}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
