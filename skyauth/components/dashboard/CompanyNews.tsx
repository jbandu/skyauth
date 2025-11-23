type CompanyNewsProps = {
  items: Array<{ title: string; date: string }>;
};

export function CompanyNews({ items }: CompanyNewsProps) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Company news</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={`${item.title}-${item.date}`} className="flex items-center justify-between rounded-xl border px-4 py-3">
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.date}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
