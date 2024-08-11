"use server";

import { getUserByEmail, insertUser, updateUserEmailStatus } from "@/db/user";
import {
  loginFormSchema,
  signupFormSchema,
  verificationEmailCodeSchema,
} from "@/lib/schemas";
import { generateIdFromEntropySize } from "lucia";
import { hash, verify } from "@node-rs/argon2";
import { generateEmailVerificationCode } from "@/lib/utils";
import { lucia, validateRequest } from "@/auth";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { PATHS } from "@/lib/constants";
import {
  sendSignupVerificationEmail,
  verifyVerificationCode,
} from "@/lib/server-utils";

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
  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  await insertUser({ username, email, id: userId, passwordHash });

  const verificationCode = await generateEmailVerificationCode(userId, email);
  await sendSignupVerificationEmail(email, verificationCode);

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

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
  const isValidPassword = await verify(user.passwordHash, password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  if (!isValidPassword) {
    return { success: false, message: "Incorrect email or password" };
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect(PATHS.HOME, RedirectType.replace);
}

export async function logout() {
  const { session } = await validateRequest();
  if (!session) {
    return { error: "Unauthorized" };
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
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
