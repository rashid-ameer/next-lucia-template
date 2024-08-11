"use client";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import ResendCodeButton from "./resend-code-button";
import SubmitButton from "@/components/auth/submit-button";
import { verifyEmail } from "@/actions/auth";
import FormServerError from "./form-error";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import toast from "react-hot-toast";

type VerificationFormProps = {
  className?: string;
};

function VerificationForm({ className }: VerificationFormProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const canSubmit =
    value.length ===
    parseInt(process.env.NEXT_PUBLIC_EMAIL_VERIFICATION_CODE_LENGTH!);

  // handle button click
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    startTransition(async () => {
      const result = await verifyEmail(value);

      if (!result) {
        toast.success("Email verified successfully");
      } else if (result.error) {
        setError(result.error);
      }
    });
  };

  return (
    <form
      className={cn("grid gap-4 justify-items-center", className)}
      onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <InputOTP
          maxLength={6}
          value={value}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          onChange={(value) => setValue(value)}>
          <InputOTPSlot
            index={0}
            className="rounded-md border-gray-300 border"
          />
          <InputOTPSlot
            index={1}
            className="rounded-md border-gray-300 border"
          />
          <InputOTPSlot
            index={2}
            className="rounded-md border-gray-300 border"
          />
          <InputOTPSlot
            index={3}
            className="rounded-md border-gray-300 border"
          />
          <InputOTPSlot
            index={4}
            className="rounded-md border-gray-300 border"
          />
          <InputOTPSlot
            index={5}
            className="rounded-md border-gray-300 border"
          />
        </InputOTP>

        {error && !isPending && (
          <FormServerError
            message={error}
            className="text-center"
          />
        )}
      </div>

      <ResendCodeButton />

      <SubmitButton
        disabled={!canSubmit || isPending}
        loading={isPending}>
        Verify
      </SubmitButton>
    </form>
  );
}
export default VerificationForm;
