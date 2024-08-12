"use server";

import {
  getUserByEmail,
  insertUser,
  updateUser,
  updateUserEmailStatus,
} from "@/db/user";
import {
  emailSchema,
  forgotPasswordFormSchema,
  loginFormSchema,
  resetPasswordFormSchema,
  signupFormSchema,
  verificationEmailCodeSchema,
} from "@/lib/schemas";
import { generateIdFromEntropySize } from "lucia";
import { generateEmailVerificationCode } from "@/lib/utils";
import { lucia, validateRequest } from "@/auth";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { PATHS } from "@/lib/constants";
import {
  checkPasswordValidity,
  createPasswordResetToken,
  createSessionAndCookie,
  createSessionCookie,
  deleteSessionCookie,
  getPasswordHash,
  sendResetPasswordEmail,
  sendSignupVerificationEmail,
  verifyVerificationCode,
} from "@/lib/server-utils";
import prisma from "@/lib/prisma";
import { encodeHex } from "oslo/encoding";
import { sha256 } from "oslo/crypto";
import { isWithinExpirationDate } from "oslo";

export async function signup(data: unknown) {
  // validate the data
  const validationResult = signupFormSchema.safeParse(data);
  if (!validationResult.success) {
    return {
      error: "Invalid data format",
    };
  }

  // extract data
  const { email, username, password } = validationResult.data;

  // check if the user already exists
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already exists" };
  }

  // generate the id of user
  const userId = generateIdFromEntropySize(10); // 16 characters long
  // generate password hash
  const passwordHash = await getPasswordHash(password);

  await insertUser({ username, email, id: userId, passwordHash });

  const verificationCode = await generateEmailVerificationCode(userId, email);
  await sendSignupVerificationEmail(email, verificationCode);

  await createSessionAndCookie(userId);

  return redirect(PATHS.VERIFY_EMAIL, RedirectType.replace);
}

export async function login(data: unknown) {
  // validate the data
  const validationResult = loginFormSchema.safeParse(data);
  if (!validationResult.success) {
    return {
      success: false,
      message: "Invalid data format",
    };
  }

  // extract data
  const { email, password } = validationResult.data;

  // check if the user exists
  const user = await getUserByEmail(email);

  if (!user) {
    return { success: false, message: "Incorrect email or password" };
  }

  // verify password
  const isValidPassword = await checkPasswordValidity(
    user.passwordHash!,
    password
  );

  if (!isValidPassword) {
    return { success: false, message: "Incorrect email or password" };
  }

  await createSessionAndCookie(user.id);

  return redirect(PATHS.HOME, RedirectType.replace);
}

export async function logout() {
  const { session } = await validateRequest();
  if (!session) {
    return { error: "Unauthorized" };
  }

  await lucia.invalidateSession(session.id);
  deleteSessionCookie();
  return redirect(PATHS.LOGIN);
}

export async function verifyEmail(code: unknown) {
  // authenticate user
  const { user } = await validateRequest();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // validate data
  const validationResult = verificationEmailCodeSchema.safeParse(code);
  if (!validationResult.success) {
    return { error: "Invalid code" };
  }

  // check if code is valid
  const isValidCode = await verifyVerificationCode(user, validationResult.data);

  if (!isValidCode) {
    return { error: "Invalid code" };
  }

  // invalide user
  await lucia.invalidateUserSessions(user.id);
  // update the user
  await updateUserEmailStatus(user.id);

  // create a new session for user
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect(PATHS.HOME, RedirectType.replace);
}

export async function resendEmailVerificationCode() {
  // authenticate user
  const { user } = await validateRequest();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // generate a new code
  const verificationCode = await generateEmailVerificationCode(
    user.id,
    user.email
  );

  // send the email
  await sendSignupVerificationEmail(user.email, verificationCode);
  return { success: true };
}

export async function sendResetPasswordLink(data: unknown) {
  const validationResult = forgotPasswordFormSchema.safeParse(data);

  if (!validationResult.success) {
    return { error: "Invalid Email" };
  }

  const { email } = validationResult.data;

  const user = await getUserByEmail(email);

  if (!user) {
    return { error: "Invalid Email" };
  }

  const verificationToken = await createPasswordResetToken(user.id);
  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${verificationToken}`;

  await sendResetPasswordEmail(email, verificationLink);

  return redirect(PATHS.LOGIN);
}

export async function resetPassword(data: unknown) {
  const parsed = resetPasswordFormSchema.safeParse(data);
  if (!parsed.success) {
    const errors = parsed.error.flatten();
    return {
      error: errors.fieldErrors.password?.[0] ?? errors.fieldErrors.token?.[0],
    };
  }

  const { token, password } = parsed.data;

  // create a token hash
  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(token)));

  // delete the token entry
  const dbToken = await prisma.$transaction(async (prisma) => {
    const item = await prisma.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
    });

    if (item) {
      await prisma.passwordResetToken.delete({
        where: {
          id: item.id,
        },
      });
    }

    return item;
  });

  // if token is not present or already has been expired
  if (!dbToken || !isWithinExpirationDate(dbToken.expiresAt)) {
    return { error: "Invalid token" };
  }

  await lucia.invalidateUserSessions(dbToken.userId);
  const passwordHash = await getPasswordHash(password);

  await updateUser(dbToken.userId, { passwordHash });

  await createSessionAndCookie(dbToken.userId);
  redirect(PATHS.LOGIN, RedirectType.replace);
}
