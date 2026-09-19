export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get("userId");

    if (!otherUserId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    // Get the current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) return new NextResponse("Unauthorized", { status: 401 });

    // Find a chat that has exactly these two members
    let chat = await prisma.chat.findFirst({
      where: {
        isGroup: false,
        AND: [
          { members: { some: { userId: currentUser.id } } },
          { members: { some: { userId: otherUserId } } }
        ]
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    // If chat doesn't exist, create it
    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          isGroup: false,
          members: {
            create: [
              { userId: currentUser.id },
              { userId: otherUserId }
            ]
          }
        },
        include: {
          messages: true
        }
      });
    }

    return NextResponse.json({
      chatId: chat.id,
      messages: chat.messages
    });
  } catch (error) {
    console.error("MESSAGES_GET", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { chatId, text } = body;

    if (!chatId || !text) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        senderId: currentUser.id,
      },
      include: {
        sender: true
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("MESSAGES_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
