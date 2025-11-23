import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { comparePassword } from "./password";
import { getDb, airlines, employees, employeeRoles, roles, auditLogs } from "@/lib/db";

type RoleSummary = {
  id: string | null;
  name: string | null;
  dashboardType: string | null;
  permissions: Record<string, unknown> | null;
};

type AuthenticatedUser = {
  airlineId?: string;
  airlineCode?: string | null;
  roles?: RoleSummary[];
  rememberMe?: boolean;
};

export const credentialsSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must have at least 8 characters")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[0-9]/, "Password must include a number"),
  airlineCode: z.string().min(2).max(3).optional(),
  rememberMe: z.boolean().optional(),
});

export type CredentialsPayload = z.infer<typeof credentialsSchema>;

export async function logAudit(event: { airlineId?: string | null; employeeId?: string | null; action: string; metadata?: Record<string, unknown> }) {
  try {
    const db = getDb();
    await db.insert(auditLogs).values({
      airlineId: event.airlineId ?? null,
      employeeId: event.employeeId ?? null,
      action: event.action,
      metadata: event.metadata,
      severity: "info",
    });
  } catch (error) {
    console.error("Failed to write audit log", error);
  }
}

export async function authorizeWithCredentials(data: CredentialsPayload) {
  const db = getDb();
  const airlineCode = data.airlineCode?.toUpperCase();

  const tenant = airlineCode
    ? await db.query.airlines.findFirst({
        where: eq(airlines.code, airlineCode),
      })
    : null;

  if (airlineCode && !tenant) {
    return null;
  }

  const emailFilter = eq(employees.email, data.email.toLowerCase());
  const whereClause = tenant ? and(emailFilter, eq(employees.airlineId, tenant.id)) : emailFilter;

  const employee = await db.query.employees.findFirst({
    where: whereClause,
  });

  if (!employee || !employee.passwordHash) {
    return null;
  }

  if (employee.status && employee.status !== "active") {
    await logAudit({
      airlineId: employee.airlineId,
      employeeId: employee.id,
      action: "login_blocked",
      metadata: { reason: `status_${employee.status}` },
    });
    return null;
  }

  const passwordMatches = await comparePassword(data.password, employee.passwordHash);

  if (!passwordMatches) {
    await logAudit({
      airlineId: employee.airlineId,
      employeeId: employee.id,
      action: "login_failed",
    });
    return null;
  }

  const roleAssignments = await db
    .select({
      id: roles.id,
      name: roles.name,
      dashboardType: roles.dashboardType,
      permissions: roles.permissions,
    })
    .from(employeeRoles)
    .leftJoin(roles, eq(employeeRoles.roleId, roles.id))
    .where(eq(employeeRoles.employeeId, employee.id));

  return {
    id: employee.id,
    email: employee.email,
    name: employee.displayName ?? `${employee.firstName} ${employee.lastName}`,
    airlineId: employee.airlineId,
    airlineCode: tenant?.code ?? null,
    rememberMe: data.rememberMe ?? false,
      roles: roleAssignments
        .filter((assignment) => Boolean(assignment.id))
        .map((assignment) => ({
          id: assignment.id,
          name: assignment.name,
          dashboardType: assignment.dashboardType,
          permissions: assignment.permissions,
        })) as RoleSummary[],
  };
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  providers: [
    Credentials({
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) {
          console.warn("Invalid credentials payload", parsed.error.flatten());
          return null;
        }
        const user = await authorizeWithCredentials(parsed.data);
        if (!user) {
          return null;
        }
        await logAudit({
          airlineId: user.airlineId,
          employeeId: user.id,
          action: "login_success",
        });
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const enriched = user as AuthenticatedUser;
        token.airlineId = enriched.airlineId;
        token.airlineCode = enriched.airlineCode;
        token.roles = enriched.roles ?? [];
        token.rememberMe = enriched.rememberMe ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        airlineId: token.airlineId as string | undefined,
        airlineCode: token.airlineCode as string | undefined,
        roles: token.roles as RoleSummary[] | undefined,
        rememberMe: token.rememberMe as boolean | undefined,
      };
      return session;
    },
  },
  trustHost: true,
};
