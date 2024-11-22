import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenData = JSON.parse(authToken.value);
    const userId = tokenData.id;

    // Get all users who have either sent messages to or received messages from the current user
    const users = await db.user.findMany({
      where: {
        OR: [
          {
            receivedMessages: {
              some: {
                senderId: userId,
              },
            },
          },
          {
            sentMessages: {
              some: {
                receiverId: userId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    // For each user, get their last message with the current user
    const usersWithLastMessage = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await db.message.findFirst({
          where: {
            OR: [
              {
                senderId: userId,
                receiverId: user.id,
              },
              {
                senderId: user.id,
                receiverId: userId,
              },
            ],
          },
          orderBy: {
            sentAt: "desc",
          },
          include: {
            sender: {
              select: {
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });

        return {
          ...user,
          lastMessage,
        };
      }),
    );

    // Sort users by last message date
    usersWithLastMessage.sort((a, b) => {
      if (!a.lastMessage || !b.lastMessage) {
        return 0;
      }

      return new Date(b.lastMessage.sentAt).getTime() - new Date(a.lastMessage.sentAt).getTime();
    });

    return NextResponse.json(usersWithLastMessage);
  } catch (error) {
    console.error("Error fetching chat users:", error);
    return NextResponse.json({ error: "Failed to fetch chat users" }, { status: 500 });
  }
}
