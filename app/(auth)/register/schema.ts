import { z } from "zod";
import { UserRole } from "@prisma/client";

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
    researchInterests: z.string().min(1, "Research interests are required"),
    expertise: z.string().min(1, "Expertise is required"),
    role: z.enum([
      UserRole.ADMIN.toLowerCase(),
      UserRole.ORGANIZER.toLowerCase(),
      UserRole.INVESTOR.toLowerCase(),
      UserRole.USER.toLowerCase(),
    ] as const),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    streetNo: z.string().min(1, "Street number is required"),
    aptNo: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipcode: z.string().min(5, "Valid zipcode is required"),
    dob: z.string().min(1, "Date of birth is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
