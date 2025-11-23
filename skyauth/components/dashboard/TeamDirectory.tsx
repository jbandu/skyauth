import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type TeamDirectoryProps = {
  members: Array<{
    name: string;
    title: string;
    status?: "online" | "away" | "offline";
  }>;
  title?: string;
};

export function TeamDirectory({ members, title = "Team directory" }: TeamDirectoryProps) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">{title}</h2>
      <div className="mt-4 space-y-3">
        {members.map((member) => (
          <div key={member.name} className="flex items-center gap-3 rounded-xl border px-3 py-2">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{initials(member.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.title}</p>
            </div>
            {member.status && <StatusPill status={member.status} />}
          </div>
        ))}
      </div>
    </section>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatusPill({ status }: { status: "online" | "away" | "offline" }) {
  const colors = {
    online: "bg-emerald-500",
    away: "bg-amber-500",
    offline: "bg-muted-foreground/40",
  }[status];

  return (
    <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
      <span className={`size-2 rounded-full ${colors}`} />
      {status}
    </span>
  );
}
