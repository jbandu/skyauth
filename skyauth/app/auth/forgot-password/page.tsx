import { PasswordResetForm } from "@/components/auth/PasswordResetForm";

export default function AuthForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your work email and we&apos;ll deliver a secure reset link via Resend (expires in 60 minutes).
        </p>
      </div>
      <PasswordResetForm />
    </div>
  );
}
