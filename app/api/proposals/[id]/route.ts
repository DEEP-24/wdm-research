import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import path from "node:path";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const proposal = await db.projectProposal.findUnique({
      where: { id: params.id },
    });

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    // Only allow admin or the proposal owner to delete
    if (user.role !== "ADMIN" && proposal.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First get the proposal to access its attachments
    const proposalData = await db.projectProposal.findUnique({
      where: { id: params.id },
      select: { attachments: true },
    });

    if (proposalData?.attachments) {
      const attachments = JSON.parse(proposalData.attachments);
      for (const attachment of attachments) {
        try {
          // Get the filename from the URL
          const filename = attachment.url.split("/").pop();
          if (filename) {
            const filePath = path.join(process.cwd(), "public", "attachments", filename);
            await unlink(filePath);
          }
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      }
    }

    // Delete the proposal from the database
    await db.projectProposal.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Proposal deleted successfully" });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const proposal = await db.projectProposal.findUnique({
      where: { id: params.id },
    });

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    // Only allow admin or the proposal owner to edit
    if (user.role !== "ADMIN" && proposal.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const updatedProposal = await db.projectProposal.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        attachments: data.attachments,
      },
      include: {
        proposalReviews: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(updatedProposal);
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
