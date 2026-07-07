import * as z from "zod";

export const SignInFormSchema = z.object({
  username: z.string().trim().min(1, "User ID is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignInFormType = z.infer<typeof SignInFormSchema>;
