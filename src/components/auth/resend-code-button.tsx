import { resendEmailVerificationCode } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import CircularLoader from "../circular-loader";

type ResendCodeButtonProps = {
  className?: string;
};

function ResendCodeButton({ className }: ResendCodeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [countDown, setCountDown] = useState(0);

  // handle click
  const handleClick = () => {
    startTransition(async () => {
      try {
        const result = await resendEmailVerificationCode();
        if (result.success) {
          toast.success("Code sent successfully");
          setCountDown(30);
        }
      } catch (error) {
        toast.error("Failed to resend code");
      }
    });
  };

  useEffect(() => {
    if (countDown === 0) return;

    const timer = setTimeout(() => setCountDown(countDown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countDown]);

  return (
    <div
      className={cn(
        "text-sm text-gray-500 flex gap-2 items-center",
        className
      )}>
      Didn&apos;t rececive code?{" "}
      <Button
        onClick={handleClick}
        type="button"
        variant="link"
        className="p-0 h-auto"
        disabled={isPending || countDown > 0}>
        {countDown > 0 ? (
          <>
            Resend in <span className="tabular-nums ml-1">{countDown}s</span>
          </>
        ) : (
          "Resend Code"
        )}
      </Button>
    </div>
  );
}
export default ResendCodeButton;
