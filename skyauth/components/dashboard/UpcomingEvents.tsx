type UpcomingEventsProps = {
  events: Array<{
    title: string;
    subtitle?: string;
    dueDate: string;
  }>;
  title?: string;
};

export function UpcomingEvents({ events, title = "Upcoming events" }: UpcomingEventsProps) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">{title}</h2>
      <div className="mt-4 space-y-4">
        {events.map((event) => (
          <div key={`${event.title}-${event.dueDate}`} className="flex items-center justify-between gap-4 rounded-xl border px-4 py-3">
            <div>
              <p className="font-medium">{event.title}</p>
              {event.subtitle && <p className="text-sm text-muted-foreground">{event.subtitle}</p>}
            </div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{event.dueDate}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
