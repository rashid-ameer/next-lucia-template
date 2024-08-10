import { Resend } from "resend";
// creating resend isntance
const resend = new Resend(process.env.EMAIL_SERVER_API_KEY);

// send email
export async function sendEmail(
  email: string,
  subject: string,
  body: React.ReactNode
) {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject,
    react: <>{body}</>,
  });

  if (error) {
    throw error;
  }
}
