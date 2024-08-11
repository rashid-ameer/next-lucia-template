import { z } from "zod";
import {
  forgotPasswordFormSchema,
  loginFormSchema,
  signupFormSchema,
} from "@/lib/schemas";

export type SignupFormValues = z.infer<typeof signupFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;
