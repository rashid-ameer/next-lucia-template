import { validateRequest } from "@/auth";
import { SignupForm } from "@/components";
import OAuthButtons from "@/components/auth/oauth-buttons";
import Seperator from "@/components/auth/seperator";
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
        <OAuthButtons
          className="flex-wrap"
          googleText="Signup with Google"
          githubText="Signup with GitHub"
        />

        {/* seperator */}

        <Seperator />
        {/* signup form */}
        <SignupForm />
      </CardContent>
    </Card>
  );
}
export default Signup;
