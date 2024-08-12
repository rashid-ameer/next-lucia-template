import ForgotPassowordForm from "@/components/auth/forgot-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Forgot Password Page",
};

function ResetPasswordPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Forgot password?</CardTitle>
        <CardDescription>
          Password reset link will be sent to your email
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ForgotPassowordForm />
      </CardContent>
    </Card>
  );
}
export default ResetPasswordPage;
