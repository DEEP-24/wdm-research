import { NextResponse } from "next/server";
import * as argon2 from "argon2";
import { db } from "@/lib/db";
import { registerSchema } from "@/app/(auth)/register/schema";
import { z } from "zod";
import type { UserRole } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received registration data:", body);

    // Validate the request body against our schema
    const validatedData = registerSchema.parse(body);
    console.log("Validated data:", validatedData);

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // Hash password using argon2
    const hashedPassword = await argon2.hash(validatedData.password);

    // Convert role to uppercase for database
    const role = validatedData.role.toUpperCase() as UserRole;

    // Create user with properly formatted data
    const user = await db.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role,
        phone: validatedData.phone,
        streetNo: validatedData.streetNo,
        aptNo: validatedData.aptNo || "",
        city: validatedData.city,
        state: validatedData.state,
        zipcode: validatedData.zipcode,
        dob: new Date(validatedData.dob),
        expertise: validatedData.expertise,
        researchInterests: validatedData.researchInterests,
      },
    });

    console.log("User created successfully:", user.id);

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Registration error details:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    // Return more specific error message
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}