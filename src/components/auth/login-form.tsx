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

function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // submit handler
  const handleSubmit = (data: LoginFormValues) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label>Email</Label>
              <Input
                {...field}
                placeholder="email@example.com"
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
                placeholder="********"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button
            variant="link"
            className="px-0 focus-visible:ring-0 focus-visible:underline"
            asChild>
            <Link href="/signup">Not signed up? Sign up now.</Link>
          </Button>
          <Button
            variant="link"
            className="px-0 focus-visible:ring-0 focus-visible:underline"
            asChild>
            <Link href="/reset-password">Forgot Password?</Link>
          </Button>
        </div>

        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
}
export default LoginForm;
