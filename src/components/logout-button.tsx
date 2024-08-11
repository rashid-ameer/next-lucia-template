"use client";

import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

function LogoutButton() {
  return <Button onClick={async () => logout()}>Logout</Button>;
}
export default LogoutButton;
