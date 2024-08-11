import { validateRequest } from "@/auth";
import VerificationForm from "@/components/auth/verification-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PATHS } from "@/lib/constants";
import { redirect, RedirectType } from "next/navigation";

async function VerifyEmail() {
  const { user } = await validateRequest();

  if (!user) {
    redirect(PATHS.LOGIN, RedirectType.replace);
  }

  if (user && user.emailVerified) {
    redirect(PATHS.HOME, RedirectType.replace);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>Verify your Email</CardTitle>
        <CardDescription>We have sent to {user.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <VerificationForm />
      </CardContent>
    </Card>
  );
}
export default VerifyEmail;
