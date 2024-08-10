import {
  createUserEmailVerificationCode,
  deleteAllUserEmailVerificationCodes,
} from "@/db/email-verification";
import { type ClassValue, clsx } from "clsx";
import { createDate, TimeSpan } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateEmailVerificationCode(
  userId: string,
  email: string
) {
  await deleteAllUserEmailVerificationCodes(userId);
  const code = generateRandomString(6, alphabet("0-9", "A-Z"));
  await createUserEmailVerificationCode({
    userId,
    email,
    code,
    expiresAt: createDate(new TimeSpan(10, "m")),
  });

  return code;
}
