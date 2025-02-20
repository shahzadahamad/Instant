import { z } from "zod";

export const signUpSchema = z
  .object({
    fullname: z
      .string()
      .min(1, "Fullname is required")
      .min(3, "Fullname must be at least 3 letters")
      .max(30, "Fullname must be at most 30 letters")
      .regex(/^(?!.*\s{2,})[a-zA-Z ]+$/, "Fullname should only contain letter"),
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters")
      .regex(
        /^[a-z0-9_]+$/,
        "Username should only contain lowercase letters, numbers, and underscores and should not contain spaces or uppercase letters"
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .min(6, "Email must be at least 6 characters")
      .max(30, "Email must be at most 30 letters")
      .email("Invalid email address")
      .regex(/^\S+$/, "Email should not contain spaces"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    // .max(32, "Password must be at most 32 characters")
    // .regex(/^\S+$/, "Password should not contain spaces")
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/\d/, "Password must contain at least one number")
    // .regex(
    //   /[^a-zA-Z0-9]/,
    //   "Password must contain at least one special character"
    // ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const otpSchema = z.object({
  otp: z
    .string()
    .min(1, "Otp is required")
    .min(6, "Otp must be at least 6 numbers")
    .max(6, "Otp must be at most 6 numbers")
    .regex(/^[0-9]+$/, "Code must be integers"),
});

export const signInSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(1, "Username or email is required")
    .min(3, "Username or email must be at least 3 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .regex(/^\S+$/, "Password should not contain spaces"),
});

export const forgotPassSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, "Username or email is required")
    .min(6, "Username or email must be at least 6 characters"),
});

export const resetPassSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    // .max(32, "Password must be at most 32 characters")
    // .regex(/^\S+$/, "Password should not contain spaces")
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/\d/, "Password must contain at least one number")
    // .regex(
    //   /[^a-zA-Z0-9]/,
    //   "Password must contain at least one special character"
    // ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const editProfileSchema = z.object({
  fullname: z
    .string()
    .min(1, "Fullname is required")
    .min(3, "Fullname must be at least 3 letters")
    .max(30, "Fullname must be at most 30 letters")
    .regex(/^(?!.*\s{2,})[a-zA-Z ]+$/, "Fullname should only contain letter"),
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Username should only contain lowercase letters, numbers, and underscores and should not contain spaces or uppercase letters"
    ),
  email: z
    .string()
    .min(1, "Email is required")
    .min(6, "Email must be at least 6 characters")
    .max(30, "Email must be at most 30 letters")
    .email("Invalid email address")
    .regex(/^\S+$/, "Email should not contain spaces"),
  phoneNumber: z.string().refine((value) => {
    if (value.length > 0) {
      const phoneNumberPattern = /^\d{10}$/;
      return phoneNumberPattern.test(value.toString());
    } else {
      return true;
    }
  }, "Invalid Phone number"),
  dateOfBirth: z.string().refine((value) => {
    if (value === "") {
      return true;
    }
    const date = new Date(value);
    const now = new Date();
    const minDate = new Date("1925-01-01");
    const maxDate = now;
    return !isNaN(date.getTime()) && date >= minDate && date <= maxDate;
  }, "Invalid date or date is out of range"),
  gender: z.enum(["Male", "Female", "Other", ""], {
    errorMap: () => ({ message: "Invalid gender" }),
  }),
});

export const AdminSignInSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(1, "Username or email is required")
    .min(3, "Username or email must be at least 3 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .regex(/^\S+$/, "Password should not contain spaces"),
});

export const createMusicSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(4, "Title must be at least 4 characters")
    .max(32, "Title must be at most 32 characters"),
});

export const createSubcriptionSchema = z.object({
  period: z
    .string()
    .min(1, "Period is required"),
  price: z.string().min(1, "Price is required").refine((value) => {
    const numValue = Number(value);

    return !isNaN(numValue) && numValue > 0;
  }, "Enter a valid price greater than 0"),
  offer: z.string().min(1, "Offer is required").refine((value) => {
    const numValue = Number(value);

    return !isNaN(numValue) && (numValue >= 0 && numValue < 100);
  }, "Enter a valid offer lessthan than 100"),
});

export const adminEditProfile = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Username should only contain lowercase letters, numbers, and underscores and should not contain spaces or uppercase letters"
    ),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .regex(/^\S+$/, "Email should not contain spaces"),
});

export const adminChangePassword = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    // .max(32, "Password must be at most 32 characters")
    // .regex(/^\S+$/, "Password should not contain spaces")
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/\d/, "Password must contain at least one number")
    // .regex(
    //   /[^a-zA-Z0-9]/,
    //   "Password must contain at least one special character"
    // ),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "New password must be at least 8 characters"),
    // .max(32, "Password must be at most 32 characters")
    // .regex(/^\S+$/, "Password should not contain spaces")
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/\d/, "Password must contain at least one number")
    // .regex(
    //   /[^a-zA-Z0-9]/,
    //   "Password must contain at least one special character"
    // ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });