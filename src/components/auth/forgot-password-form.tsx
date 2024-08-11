"use client";

import { useForm } from "react-hook-form";
import { Form, FormField, FormMessage, FormItem } from "../ui/form";
import { ForgotPasswordFormValues } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordFormSchema } from "@/lib/schemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "../ui/button";

function ForgotPassowordForm() {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(() => {})}>
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

        <Button
          asChild
          variant="link"
          className="justify-self-start p-0"
          size="sm">
          <Link href="/signup">Not signed up? Sign up Now</Link>
        </Button>

        <Button>Reset Password</Button>
        <Button
          variant="secondary"
          asChild>
          <Link href="/login">Cancel</Link>
        </Button>
      </form>
    </Form>
  );
}
export default ForgotPassowordForm;
