import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verify } from "argon2";
import { cookies } from "next/headers";
import { z } from "zod";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      return NextResponse.json({ error: "Validation failed", fieldErrors }, { status: 400 });
    }

    const { email, password } = body;

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
          fieldErrors: {
            email: ["No account found with this email"],
          },
        },
        { status: 401 },
      );
    }

    try {
      const isPasswordValid = await verify(user.password, password);

      if (!isPasswordValid) {
        return NextResponse.json(
          {
            error: "Invalid credentials",
            fieldErrors: {
              password: ["Incorrect password"],
            },
          },
          { status: 401 },
        );
      }
    } catch (verifyError) {
      console.error("Password verification error:", verifyError);
      return NextResponse.json(
        {
          error: "Invalid credentials",
          fieldErrors: {
            password: ["Invalid password format"],
          },
        },
        { status: 401 },
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Set cookie
    cookies().set({
      name: "user-token",
      value: user.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        fieldErrors: {
          _form: ["Something went wrong. Please try again later."],
        },
      },
      { status: 500 },
    );
  }
}
