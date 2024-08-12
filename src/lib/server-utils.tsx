import SignupVerificationEmail from "@/emails/signup-verification";
import { sendEmail } from "@/lib/email";
import { generateIdFromEntropySize, User } from "lucia";
import prisma from "./prisma";
import { createDate, isWithinExpirationDate, TimeSpan } from "oslo";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import {
  createPasswordResetTokenEntry,
  deleteAllPasswordResetTokens,
} from "@/db/user";
import { encodeHex } from "oslo/encoding";
import { sha256 } from "oslo/crypto";

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

export async function createPasswordResetToken(userId: string) {
  await deleteAllPasswordResetTokens(userId);

  const tokenId = generateIdFromEntropySize(25); // 40 characters long
  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)));

  await createPasswordResetTokenEntry({
    userId,
    tokenHash,
    expiresAt: createDate(new TimeSpan(2, "h")),
  });

  return tokenId;
}

export async function sendResetPasswordEmail(
  email: string,
  verificationLink: string
) {
  await sendEmail(email, "Password Rest Link", <p>{verificationLink}</p>);
}
