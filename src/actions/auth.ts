"use server";

import { getUserByEmail, insertUser } from "@/db/user";
import { signupFormSchema } from "@/lib/schemas";
import { generateIdFromEntropySize } from "lucia";
import { hash } from "@node-rs/argon2";
import { generateEmailVerificationCode } from "@/lib/utils";
import { sendSignupVerificationEmail } from "@/use-cases/users";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { PATHS } from "@/lib/constants";

export async function signup(data: unknown) {
  // validate the data
  const validationResult = signupFormSchema.safeParse(data);
  if (!validationResult.success) {
    return {
      success: false,
      message: "Invalid data format",
    };
  }

  // extract data
  const { email, username, password } = validationResult.data;

  // check if the user already exists
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { success: false, message: "Email already exists" };
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

  return redirect(PATHS.HOME, RedirectType.replace);
}
