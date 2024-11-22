import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const { projectId, requestAmount, keywords, attachments } = json;

    // Validate required fields
    if (!projectId || !requestAmount || !keywords) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate requestAmount is a positive number
    if (typeof requestAmount !== "number" || requestAmount <= 0) {
      return NextResponse.json({ error: "Invalid request amount" }, { status: 400 });
    }

    const application = await db.grantApplication.create({
      data: {
        projectProposal: { connect: { id: projectId } },
        requestAmount,
        keywords,
        attachments: attachments || [],
        submittedBy: { connect: { id: user.id } },
      },
      include: {
        projectProposal: true,
        submittedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("[GRANT_APPLICATIONS_POST]", error);
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications = await db.grantApplication.findMany({
      where: {
        submittedBy: { email: user.email },
      },
      include: {
        projectProposal: true,
        submittedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("[GRANT_APPLICATIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
