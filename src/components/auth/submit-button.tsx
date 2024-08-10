import React from "react";
import { ButtonProps } from "../ui/button";
import { cn } from "@/lib/utils";
import LoadingButton from "../loading-button";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = ButtonProps & {
  loading?: boolean;
};

const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ loading = false, className, children, ...props }, ref) => {
    const { pending } = useFormStatus();

    return (
      <LoadingButton
        loading={pending || loading}
        ref={ref}
        className={cn(className)}
        {...props}>
        {children}
      </LoadingButton>
    );
  }
);

SubmitButton.displayName = "SubmitButton";
export default SubmitButton;
