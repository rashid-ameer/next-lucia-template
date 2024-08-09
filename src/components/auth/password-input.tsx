import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";
import { EyeClosedIcon, EyeOpenIcon } from "@/components/icons";
import { Button } from "../ui/button";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          className={cn("pr-10", className)}
          type={showPassword ? "text" : "password"}
          {...props}
        />{" "}
        <Button
          type="button"
          variant="ghost"
          className="absolute h-full top-0 right-0 px-3 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <EyeClosedIcon className="size-4" />
          ) : (
            <EyeOpenIcon className="size-4" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
