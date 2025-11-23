import { notFound } from "next/navigation";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";

type ResetPasswordPageProps = {
  params: { token?: string };
};

export default function AuthResetPasswordPage({ params }: ResetPasswordPageProps) {
  if (!params.token) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Set a new password</h1>
        <p className="text-sm text-muted-foreground">
          Tokens expire after 60 minutes. Once updated, we&apos;ll invalidate existing sessions for security.
        </p>
      </div>
      <PasswordResetForm token={params.token} />
    </div>
  );
}
