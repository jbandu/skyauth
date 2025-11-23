import Link from "next/link";

type AuthLayoutProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AuthLayout({
  children,
  title = "Welcome to SkyAuth",
  subtitle = "Secure identity and workforce tools for airlines",
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/30 lg:flex-row">
      <aside className="hidden w-full max-w-md flex-col justify-between border-r bg-card/80 px-10 py-12 lg:flex">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-lg font-semibold">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 font-semibold text-primary">
              SA
            </span>
            SkyAuth
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Multi-tenant identity, HR, and org intelligence tailored for global airlines.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Enterprise Ready</p>
            <p className="text-muted-foreground">
              Built with RLS, audit logging, and airline-specific branding baked in.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">API First</p>
            <p className="text-muted-foreground">
              Integrates with crew scheduling, baggage, and finance systems via secure APIs.
            </p>
          </div>
        </div>
      </aside>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6 rounded-2xl border bg-background/70 p-8 shadow-lg backdrop-blur">
          <div className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Airline Workforce Cloud
            </p>
            <h1 className="text-3xl font-semibold">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
