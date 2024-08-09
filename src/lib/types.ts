import { z } from "zod";
import { loginFormSchema, signupFormSchema } from "@/lib/schemas";

export type SignupFormValues = z.infer<typeof signupFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
