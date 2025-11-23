"use client";

import { useTransition, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  email: z.string().email("Enter a valid corporate email."),
  password: z
    .string()
    .min(8, "Passwords must be at least 8 characters.")
    .regex(/[A-Z]/, "Include at least one uppercase letter.")
    .regex(/[0-9]/, "Include at least one number."),
  airlineCode: z
    .string()
    .min(2, "Airline code is at least 2 characters.")
    .max(3, "Airline code is at most 3 characters.")
    .transform((val) => val.toUpperCase()),
  rememberMe: z.boolean().default(false),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("redirectTo") ?? "/dashboard/executive";
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      airlineCode: "CM",
      rememberMe: true,
    },
  });

  const handleSubmit = (values: LoginValues) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: values.email.toLowerCase(),
        password: values.password,
        airlineCode: values.airlineCode,
        rememberMe: values.rememberMe,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      setSuccess("Authentication successful. Redirecting…");
      router.push(result?.url ?? callbackUrl);
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Login failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="pedro.heilbron@copa.com" type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="••••••••" type="password" autoComplete="current-password" {...field} />
              </FormControl>
              <FormDescription>
                Min 8 chars, 1 uppercase, 1 number. Five failed attempts trigger a 15-minute lockout.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="airlineCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Airline Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="CM"
                  maxLength={3}
                  {...field}
                  onChange={(event) => field.onChange(event.target.value.toUpperCase())}
                />
              </FormControl>
              <FormDescription>Use the 2-3 letter airline identifier (CM, XP, etc.).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 space-y-0 rounded-lg border px-3 py-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="text-base">Remember this device</FormLabel>
                <FormDescription>Keep me signed in for 7 days instead of 15 minutes.</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Verifying…" : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}
