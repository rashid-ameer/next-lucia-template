import { validateRequest } from "@/auth";
import LogoutButton from "@/components/logout-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PATHS } from "@/lib/constants";
import { redirect, RedirectType } from "next/navigation";

async function page() {
  const { user } = await validateRequest();

  if (!user) {
    return redirect(PATHS.LOGIN, RedirectType.replace);
  }

  return (
    <main className="grid min-h-screen place-items-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>{user.username}</CardTitle>
          <CardDescription>Lerning web is a fun</CardDescription>
        </CardHeader>
        <CardContent>
          <LogoutButton className="mx-auto flex" />
        </CardContent>
      </Card>
    </main>
  );
}
export default page;
