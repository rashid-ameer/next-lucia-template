"use client";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { loginFormSchema } from "@/lib/schemas";
import { LoginFormValues } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useTransition } from "react";
import FormServerError from "./form-error";
import SubmitButton from "./submit-button";
import { login } from "@/actions/auth";
import { PATHS } from "@/lib/constants";

function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // submit handler
  const handleSubmit = (data: LoginFormValues) => {
    startTransition(async () => {
      const result = await login(data);
      if (result && !result.success) {
        setError(result.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}>
        {!isPending && error && (
          <FormServerError
            message={error}
            className="text-center"
          />
        )}

        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label>Email</Label>
              <Input
                {...field}
                placeholder="email@example.com"
                disabled={isPending}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label>Password</Label>
              <PasswordInput
                {...field}
                disabled={isPending}
                placeholder="********"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button
            variant="link"
            size="sm"
            className="px-0 focus-visible:ring-0 focus-visible:underline"
            asChild>
            <Link href={PATHS.SIGNUP}>Not signed up? Sign up now.</Link>
          </Button>
          <Button
            variant="link"
            size="sm"
            className="px-0 focus-visible:ring-0 focus-visible:underline"
            asChild>
            <Link href={PATHS.RESET_PASSWORD}>Forgot Password?</Link>
          </Button>
        </div>

        <SubmitButton
          loading={isPending}
          type="submit">
          Login
        </SubmitButton>
      </form>
    </Form>
  );
}
export default LoginForm;
