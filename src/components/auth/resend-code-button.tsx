import { resendEmailVerificationCode } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import CircularLoader from "../circular-loader";

type ResendCodeButtonProps = {
  className?: string;
};

function ResendCodeButton({ className }: ResendCodeButtonProps) {
  const [isPending, startTransition] = useTransition();

  // handle click
  const handleClick = () => {
    startTransition(async () => {
      try {
        const result = await resendEmailVerificationCode();
        if (result.success) {
          toast.success("Code sent successfully");
        }
      } catch (error) {
        toast.error("Failed to resend code");
      }
    });
  };

  return (
    <div className={cn("text-sm flex gap-2 items-center", className)}>
      Didn&apos;t rececive code?{" "}
      <Button
        onClick={handleClick}
        type="button"
        variant="link"
        className="p-0 h-auto"
        disabled={isPending}>
        Resend Code
      </Button>
    </div>
  );
}
export default ResendCodeButton;
