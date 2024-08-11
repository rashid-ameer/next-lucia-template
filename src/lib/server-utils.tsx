import SignupVerificationEmail from "@/emails/signup-verification";
import { sendEmail } from "@/lib/email";
import { User } from "lucia";
import prisma from "./prisma";
import { isWithinExpirationDate } from "oslo";
import { lucia } from "@/auth";
import { cookies } from "next/headers";

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

export async function verifyVerificationCode(
  user: User,
  code: string
): Promise<boolean> {
  return await prisma.$transaction(async (prisma) => {
    const dbCode = await prisma.emailVerificationCode.findFirst({
      where: { userId: user.id },
    });

    // there is no code entry or code does not match
    if (!dbCode || dbCode.code !== code) {
      return false;
    }
    // delete the code if it is found and matched
    await prisma.emailVerificationCode.delete({
      where: {
        id: dbCode.id,
      },
    });

    // if code is  expired
    if (!isWithinExpirationDate(dbCode.expiresAt)) {
      return false;
    }

    // if email does not matched
    if (dbCode.email !== user.email) {
      return false;
    }

    return true;
  });
}

export async function createSessionAndCookie(userId: string) {
  const session = await lucia.createSession(userId, {});
  createSessionCookie(session.id);
}

export async function createSessionCookie(sessionId: string) {
  const sessionCookie = lucia.createSessionCookie(sessionId);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}

export function deleteSessionCookie() {
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
