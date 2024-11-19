import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const events = await db.event.findMany({
      include: {
        sessions: true,
        registrations: true,
        user: true,
      },
    });
    return NextResponse.json(events);
  } catch (error: unknown) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const event = await db.event.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: data.start_date,
        endDate: data.end_date,
        location: data.location,
        isVirtual: data.is_virtual,
        maxAttendees: data.max_attendees,
        registrationDeadline: data.registration_deadline,
        status: data.status,
        userId: user.id,
        sessions: {
          create: data.sessions.map((session: any) => ({
            title: session.title,
            description: session.description,
            startTime: session.start_time,
            endTime: session.end_time,
            location: session.location,
            maxAttendees: session.max_attendees,
          })),
        },
      },
      include: {
        sessions: true,
        user: true,
      },
    });

    return NextResponse.json(event);
  } catch (error: unknown) {
    console.error("Failed to create event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
