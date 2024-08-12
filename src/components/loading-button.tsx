import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CircularLoader from "./circular-loader";

type LoadingButtonProps = ButtonProps & {
  loading?: boolean;
};

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={props.disabled || loading}
        className={cn("relative", className)}
        {...props}>
        <span className={cn(loading ? "opacity-0" : "")}>{children}</span>

        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <CircularLoader className="size-6" />
          </div>
        ) : null}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export default LoadingButton;
