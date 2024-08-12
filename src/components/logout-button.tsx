"use client";

import { logout } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import LoadingButton from "./loading-button";

type LogoutButtonProps = {
  className?: string;
};

function LogoutButton({ className }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <LoadingButton
      loading={isPending}
      onClick={() => {
        startTransition(async () => {
          await logout();
        });
      }}
      className={cn(className)}>
      Logout
    </LoadingButton>
  );
}
export default LogoutButton;
