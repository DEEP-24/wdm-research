import { z } from "zod";
import { UserRole } from "@prisma/client";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

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

export const eventSessionSchema = z
  .object({
    title: z.string().min(1, "Session title is required"),
    description: z.string().min(1, "Session description is required"),
    startTime: z.date(),
    endTime: z.date(),
    location: z.string().min(1, "Session location is required"),
    maxAttendees: z.number().min(1, "Maximum attendees must be at least 1"),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) {
        return true;
      }
      return new Date(data.endTime) > new Date(data.startTime);
    },
    {
      message: "Session end time must be after start time",
      path: ["endTime"],
    },
  );

const parseDate = (val: unknown) => {
  if (val instanceof Date) {
    return val;
  }
  if (typeof val === "string") {
    return new Date(val);
  }
  return null;
};

export const eventSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    startDate: z.coerce.date({
      required_error: "Start date is required",
    }),
    endDate: z.coerce.date({
      required_error: "End date is required",
    }),
    location: z.string().min(1, "Location is required"),
    isVirtual: z.boolean().default(false),
    maxAttendees: z.number().min(1, "Maximum attendees must be at least 1"),
    registrationDeadline: z.coerce.date({
      required_error: "Registration deadline is required",
    }),
    status: z.string().default("Upcoming"),
    sessions: z.array(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        startTime: z.preprocess(parseDate, z.date()),
        endTime: z.preprocess(parseDate, z.date()),
        location: z.string(),
        maxAttendees: z.number().min(1, "Must have at least 1 attendee"),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    if (!data.startDate || !data.endDate) {
      return;
    }

    // Get date strings for comparison (removes time component)
    const startDateStr = data.startDate.toISOString().split("T")[0];
    const endDateStr = data.endDate.toISOString().split("T")[0];

    if (endDateStr < startDateStr) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be on or after start date",
        path: ["endDate"],
      });
    }

    if (data.registrationDeadline) {
      const regDateStr = data.registrationDeadline.toISOString().split("T")[0];
      if (regDateStr > startDateStr) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Registration deadline must be before event start date",
          path: ["registrationDeadline"],
        });
      }
    }
  });

export type EventFormValues = z.infer<typeof eventSchema>;
export type EventSessionFormValues = z.infer<typeof eventSessionSchema>;
