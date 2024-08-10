"use client";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { signupFormSchema } from "@/lib/schemas";
import { SignupFormValues } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/auth/password-input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/auth/submit-button";
import { useTransition } from "react";

function SignupForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // submit handler
  const handleSubmit = (data: SignupFormValues) => {};

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <Label>Username</Label>
                <Input
                  placeholder="rashid"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <Label>Email</Label>
                <Input
                  placeholder="email@example.com"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <Label>Password</Label>
                <PasswordInput
                  placeholder="********"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button
          variant="link"
          asChild
          className="justify-start px-0 justify-self-start focus-visible:ring-0 focus-visible:underline">
          <Link href="/login">Already signed up? Login instead</Link>
        </Button>

        <SubmitButton type="submit">Sign up</SubmitButton>
      </form>
    </Form>
  );
}
export default SignupForm;
