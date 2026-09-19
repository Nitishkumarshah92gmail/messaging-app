export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch all users except the current logged-in user
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          email: session.user.email
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        about: true,
        lastSeen: true,
        isOnline: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("USERS_GET", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
