import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL));
    }

    const researchers = await db.user.findMany({
      where: {
        role: "USER",
        email: {
          not: currentUser.email,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        imageURL: true,
        expertise: true,
        researchInterests: true,
        followers: {
          where: {
            followerId: currentUser.id,
          },
          select: {
            followerId: true,
          },
        },
        followings: {
          where: {
            followingId: currentUser.id,
          },
          select: {
            followerId: true,
          },
        },
      },
    });

    const formattedResearchers = researchers.map((researcher) => ({
      ...researcher,
      isFollowing: researcher.followers.length > 0,
      isFollowingYou: researcher.followings.length > 0,
      followers: undefined,
      followings: undefined,
    }));

    return NextResponse.json(formattedResearchers);
  } catch (error) {
    console.error("Error fetching researchers:", error);
    return NextResponse.json({ error: "Failed to fetch researchers" }, { status: 500 });
  }
}
