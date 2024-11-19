import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId, sessionId } = await request.json();

    const existingRegistration = await db.eventRegistration.findFirst({
      where: {
        eventId,
        sessionId,
        userId: user.id,
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "You are already registered for this session" },
        { status: 400 },
      );
    }

    const registration = await db.eventRegistration.create({
      data: {
        eventId,
        sessionId,
        userId: user.id,
      },
      include: {
        event: true,
        session: true,
        user: true,
      },
    });

    return NextResponse.json(registration);
  } catch (error: unknown) {
    console.error("Failed to register for event:", error);
    return NextResponse.json({ error: "Failed to register for event" }, { status: 500 });
  }
}
