import * as z from "zod";

export const SignInFormSchemaPassword = z.object({
  username: z.string().trim().min(10, "Phone Number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const SignInFormSchemaOTP = z.object({
  username: z.string().trim().min(11, "Phone Number is required"),
  otp: z
    .string()
    .min(4, "OTP must be at least 4 characters")
    .max(4, "OTP cannot be more than 4 characters"),
});

export type SignInFormTypePassword = z.infer<typeof SignInFormSchemaPassword>;
export type SignInFormTypeOTP = z.infer<typeof SignInFormSchemaOTP>;

export type OTPType = [string, string, string, string];
