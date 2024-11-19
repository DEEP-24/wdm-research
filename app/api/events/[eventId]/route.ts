import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { eventId: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const event = await db.event.update({
      where: { id: params.eventId },
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
        sessions: {
          upsert: data.sessions.map((session: any) => ({
            where: { id: session.id },
            create: {
              title: session.title,
              description: session.description,
              startTime: session.start_time,
              endTime: session.end_time,
              location: session.location,
              maxAttendees: session.max_attendees,
            },
            update: {
              title: session.title,
              description: session.description,
              startTime: session.start_time,
              endTime: session.end_time,
              location: session.location,
              maxAttendees: session.max_attendees,
            },
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
    console.error("Failed to update event:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { eventId: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.event.delete({
      where: { id: params.eventId },
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error: unknown) {
    console.error("Failed to delete event:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
