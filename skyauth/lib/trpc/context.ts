import type { inferAsyncReturnType } from "@trpc/server";

import { auth } from "@/auth";
import { getDb } from "@/lib/db";

export async function createTRPCContext() {
  const session = await auth();
  const db = (() => {
    try {
      return getDb();
    } catch {
      return null;
    }
  })();

  return {
    session,
    db,
  };
}

export type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>;
