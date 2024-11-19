import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        researchInterests: true,
        expertise: true,
        phone: true,
        city: true,
        state: true,
        linkedInURL: true,
        twitterURL: true,
        githubURL: true,
        papers: true,
      },
    });

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        researchInterests: body.researchInterests,
        expertise: body.expertise,
        phone: body.phone,
        city: body.city,
        state: body.state,
        linkedInURL: body.linkedInURL,
        twitterURL: body.twitterURL,
        githubURL: body.githubURL,
        papers: body.papers,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
