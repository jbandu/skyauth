"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";

type AuthGuardProps = {
  children: React.ReactNode;
  fallbackHref?: string;
};

export function AuthGuard({ children, fallbackHref = "/auth/login" }: AuthGuardProps) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(fallbackHref);
    }
  }, [status, router, fallbackHref]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
        <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        Checking session…
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">You need to log in to view this content.</p>
        <Button onClick={() => router.replace(fallbackHref)}>Go to login</Button>
      </div>
    );
  }

  return <>{children}</>;
}
