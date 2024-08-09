import { validateRequest } from "@/auth";
import LoginForm from "@/components/auth/login-form";
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
import { redirect, RedirectType } from "next/navigation";

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
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            className="flex-1">
            <GitHubLogoIcon className="size-5 mr-2" />
            Login with GitHub
          </Button>
          <Button
            variant="outline"
            className="flex-1">
            <GoogleLogoIcon className="size-5 mr-2" />
            Login with Google
          </Button>
        </div>

        {/* Seperator */}
        <div className="flex items-center py-2">
          <div className="flex-1 h-px bg-gray-200" />
          <div className="mx-2 text-gray-500">or</div>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Login form */}
        <LoginForm />
      </CardContent>
    </Card>
  );
}
export default Login;
