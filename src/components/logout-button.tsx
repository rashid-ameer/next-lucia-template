"use client";

import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
};

function LogoutButton({ className }: LogoutButtonProps) {
  return (
    <Button
      onClick={async () => logout()}
      className={cn(className)}>
      Logout
    </Button>
  );
}
export default LogoutButton;
