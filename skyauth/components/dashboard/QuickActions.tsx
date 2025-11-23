import Link from "next/link";

type QuickActionsProps = {
  title?: string;
  actions: Array<{
    label: string;
    description?: string;
    href: string;
  }>;
};

export function QuickActions({ title = "Quick actions", actions }: QuickActionsProps) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">{title}</h2>
      </div>
      <div className="mt-4 space-y-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center justify-between rounded-xl border px-4 py-3 text-left transition hover:border-primary"
          >
            <div>
              <p className="font-medium">{action.label}</p>
              {action.description && <p className="text-sm text-muted-foreground">{action.description}</p>}
            </div>
            <span className="text-xs text-muted-foreground">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
