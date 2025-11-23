type WelcomeCardProps = {
  name: string;
  title: string;
  airline: string;
  message?: string;
};

export function WelcomeCard({ name, title, airline, message }: WelcomeCardProps) {
  return (
    <section className="rounded-3xl border bg-card p-8 shadow-sm">
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Welcome back</p>
      <h1 className="mt-2 text-3xl font-semibold">{name}</h1>
      <p className="text-sm text-muted-foreground">
        {title} · {airline}
      </p>
      <p className="mt-4 text-base text-muted-foreground">{message ?? "Here is what needs your attention today."}</p>
    </section>
  );
}
