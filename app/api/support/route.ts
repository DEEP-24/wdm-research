import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const supportTicketSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = supportTicketSchema.parse(body);

    const ticket = await db.contactUs.create({
      data: validatedData,
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
