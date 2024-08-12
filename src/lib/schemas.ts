import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");

export const signupFormSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters"),
  email: emailSchema,
  password: passwordSchema,
});

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordFormSchema = z.object({
  email: emailSchema,
});

export const resetPasswordFormSchema = z.object({
  password: passwordSchema,
  token: z.string().min(1, "Token is required"),
});

export const verificationEmailCodeSchema = z.string().regex(/^[A-Z0-9]{6}$/);
