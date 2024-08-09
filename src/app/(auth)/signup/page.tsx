import { validateRequest } from "@/auth";
import { SignupForm } from "@/components";
import { GitHubLogoIcon, GoogleLogoIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PATHS } from "@/lib/constants";
import { Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";

export const metadata: Metadata = {
  title: "Signup",
  description: "Signup page",
};

async function Signup() {
  const { user } = await validateRequest();

  if (user) {
    redirect(PATHS.HOME, RedirectType.replace);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Sign up to start using app</CardDescription>
      </CardHeader>
      <CardContent>
        {/* auth buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            className="flex-1">
            <GitHubLogoIcon className="size-5 mr-2" />
            Signup with GitHub
          </Button>
          <Button
            variant="outline"
            className="flex-1">
            <GoogleLogoIcon className="size-5 mr-2" />
            Signup with Google
          </Button>
        </div>

        {/* seperator */}

        <div className="flex items-center py-2">
          <div className="flex-1 h-px bg-gray-200" />
          <div className="mx-2 text-gray-500">or</div>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        {/* signup form */}
        <SignupForm />
      </CardContent>
    </Card>
  );
}
export default Signup;
