"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const requestSchema = z.object({
  email: z.string().email("Enter a valid airline email."),
});

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters.")
      .regex(/[A-Z]/, "Include an uppercase letter.")
      .regex(/[0-9]/, "Include a number."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

type PasswordResetFormProps = {
  token?: string;
};

export function PasswordResetForm({ token }: PasswordResetFormProps) {
  if (token) {
    return <PasswordUpdateForm token={token} />;
  }
  return <PasswordRequestForm />;
}

function PasswordRequestForm() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: "" },
  });

  const handleSubmit = async (values: z.infer<typeof requestSchema>) => {
    setStatus(null);
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus({
      type: "success",
      message: `If ${values.email} exists, a reset email is on the way (token expires in 60 minutes).`,
    });
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        {status && (
          <Alert variant={status.type === "error" ? "destructive" : "default"}>
            <AlertTitle>{status.type === "error" ? "Error" : "Success"}</AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="pilot@aveloair.com" type="email" {...field} />
              </FormControl>
              <FormDescription>We will send a secure link via Resend. It expires in 60 minutes.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Processing…" : "Send Reset Link"}
        </Button>
      </form>
    </Form>
  );
}

function PasswordUpdateForm({ token }: { token: string }) {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const handleSubmit = async () => {
    setStatus(null);
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus({
      type: "success",
      message: "Password updated. You can now log in with your new credentials.",
    });
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        {status && (
          <Alert variant={status.type === "error" ? "destructive" : "default"}>
            <AlertTitle>{status.type === "error" ? "Error" : "Success"}</AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        <div className="rounded-lg border px-3 py-2 text-xs text-muted-foreground">
          Token <span className="font-mono text-primary">{token.slice(0, 8)}…</span> is being validated.
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormDescription>Cannot match any of your last 5 passwords.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Updating…" : "Update Password"}
        </Button>
      </form>
    </Form>
  );
}
