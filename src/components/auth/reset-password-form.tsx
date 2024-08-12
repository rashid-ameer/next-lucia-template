"use client";

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { resetPasswordFormSchema } from "@/lib/schemas";
import { ResetPasswordFormValues } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PasswordInput from "@/components/auth/password-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { resetPassword } from "@/actions/auth";
import toast from "react-hot-toast";
import SubmitButton from "./submit-button";
import FormServerError from "./form-error";

type ResetPasswordFormProps = {
  token: string;
};

function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<Omit<ResetPasswordFormValues, "token">>({
    resolver: zodResolver(resetPasswordFormSchema.omit({ token: true })),
    defaultValues: { password: "" },
  });

  // handle form submit
  const handleSubmit = async (data: Omit<ResetPasswordFormValues, "token">) => {
    startTransition(async () => {
      setError("");
      const result = await resetPassword({ token, password: data.password });
      if (!result) {
        toast.success("Password reset successfully");
      } else if (result.error) {
        setError(result.error);
        return;
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
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label>New Password</Label>
              <PasswordInput
                {...field}
                disabled={isPending}
                placeholder="********"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton loading={isPending}>Reset Password</SubmitButton>
      </form>
    </Form>
  );
}
export default ResetPasswordForm;
