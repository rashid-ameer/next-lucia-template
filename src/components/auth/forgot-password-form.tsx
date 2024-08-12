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
import { useState, useTransition } from "react";
import FormServerError from "./form-error";
import { sendResetPasswordLink } from "@/actions/auth";
import toast from "react-hot-toast";
import SubmitButton from "./submit-button";

function ForgotPassowordForm() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // handle submit
  const handleSubmit = (data: ForgotPasswordFormValues) => {
    startTransition(async () => {
      setError("");
      const result = await sendResetPasswordLink(data);

      if (!result) {
        toast.success("Send reset link successfully");
      } else if (result.error) {
        setError(result.error);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}>
        {error && (
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

        <Button
          asChild
          variant="link"
          className="justify-self-start p-0"
          size="sm">
          <Link href="/signup">Not signed up? Sign up Now</Link>
        </Button>

        <SubmitButton loading={isPending}>Reset Password</SubmitButton>
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
