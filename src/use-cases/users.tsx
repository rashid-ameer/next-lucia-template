import SignupVerificationEmail from "@/emails/signup-verification";
import { sendEmail } from "@/lib/email";

export async function sendSignupVerificationEmail(
  email: string,
  verificationCode: string
) {
  await sendEmail(
    email,
    "Verify your email",
    <SignupVerificationEmail verificationCode={verificationCode} />
  );
}
