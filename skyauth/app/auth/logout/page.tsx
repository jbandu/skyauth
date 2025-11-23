"use client";

import { signOut } from "next-auth/react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AuthLogoutPage() {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut({ callbackUrl: "/auth/login" });
    });
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTitle>Ready to wrap up?</AlertTitle>
        <AlertDescription>
          Logging out revokes active refresh tokens and clears any remembered devices for your airline tenant.
        </AlertDescription>
      </Alert>
      <Button className="w-full" onClick={handleSignOut} disabled={isPending}>
        {isPending ? "Signing out…" : "Sign Out"}
      </Button>
    </div>
  );
}
