import { z } from "zod";

export const signupFormSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters"),
  email: z.string().trim().min(1, "Email is required").email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginFormSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email(),
  password: z.string().min(1, "Password is required"),
});

export const verificationEmailCodeSchema = z.string().regex(/^[A-Z0-9]{6}$/);
