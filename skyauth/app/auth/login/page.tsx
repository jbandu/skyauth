import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function AuthLoginPage() {
  return (
    <div className="space-y-6">
      <LoginForm />
      <div className="text-center text-sm text-muted-foreground">
        <Link href="/auth/forgot-password" className="font-semibold text-primary hover:underline">
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
