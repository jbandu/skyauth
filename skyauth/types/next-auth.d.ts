import type { DefaultSession } from "next-auth";

type RoleSummary = {
  id: string | null;
  name: string | null;
  dashboardType: string | null;
  permissions: Record<string, unknown> | null | undefined;
};

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      airlineId?: string;
      airlineCode?: string;
      roles?: RoleSummary[];
      rememberMe?: boolean;
    };
  }

  interface User {
    airlineId?: string;
    airlineCode?: string;
    roles?: RoleSummary[];
    rememberMe?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    airlineId?: string;
    airlineCode?: string;
    roles?: RoleSummary[];
    rememberMe?: boolean;
  }
}
