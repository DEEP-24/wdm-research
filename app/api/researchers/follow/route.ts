import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL));
    }

    const { researcherId } = await req.json();

    // Check if already following
    const existingFollow = await db.followers.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: researcherId,
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await db.followers.delete({
        where: {
          followerId_followingId: {
            followerId: currentUser.id,
            followingId: researcherId,
          },
        },
      });
      return NextResponse.json({ followed: false });
    }

    // Follow
    await db.followers.create({
      data: {
        followerId: currentUser.id,
        followingId: researcherId,
      },
    });

    return NextResponse.json({ followed: true });
  } catch (error) {
    console.error("Error following/unfollowing researcher:", error);
    return NextResponse.json({ error: "Failed to follow/unfollow researcher" }, { status: 500 });
  }
}
