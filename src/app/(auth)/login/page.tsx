import { validateRequest } from "@/auth";
import LoginForm from "@/components/auth/login-form";
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
  title: "Login",
  description: "Login Page",
};

async function Login() {
  const { user } = await validateRequest();

  if (user) {
    redirect(PATHS.HOME, RedirectType.replace);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Login to your account to access your dashboard
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Auth Buttons */}
        <OAuthButtons
          className="flex-wrap"
          googleText="Login with Google"
          githubText="Login with GitHub"
        />

        {/* Seperator */}
        <Seperator />

        {/* Login form */}
        <LoginForm />
      </CardContent>
    </Card>
  );
}
export default Login;
